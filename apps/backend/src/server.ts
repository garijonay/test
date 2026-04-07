import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { query } from './db.js';
import type { Variety, Cross, Plant } from './types.js';

const app = express();
app.use(cors());
app.use(express.json());

const varietyInput = z.object({
  name: z.string().min(2),
  species: z.string().min(2),
  origin: z.string().optional(),
  generation: z.string().optional(),
  seed_stock: z.number().int().nonnegative().default(0),
  notes: z.string().optional()
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/api/varieties', async (_req, res) => {
  const rows = await query<Variety>('select * from varieties order by created_at desc');
  res.json(rows);
});

app.post('/api/varieties', async (req, res) => {
  const parsed = varietyInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const payload = parsed.data;
  const [created] = await query<Variety>(
    `insert into varieties (name, species, origin, generation, seed_stock, notes)
     values ($1, $2, $3, $4, $5, $6)
     returning *`,
    [payload.name, payload.species, payload.origin ?? null, payload.generation ?? null, payload.seed_stock, payload.notes ?? null]
  );

  res.status(201).json(created);
});

app.get('/api/crosses', async (_req, res) => {
  const rows = await query<Cross>(
    `select c.*, vm.name as mother_name, vf.name as father_name
     from crosses c
     join varieties vm on vm.id = c.mother_variety_id
     join varieties vf on vf.id = c.father_variety_id
     order by pollination_date desc`
  );
  res.json(rows);
});

app.get('/api/plants', async (_req, res) => {
  const rows = await query<Plant & { variety_name: string }>(
    `select p.*, v.name as variety_name
     from plants p
     join varieties v on v.id = p.variety_id
     order by p.plant_code asc`
  );
  res.json(rows);
});

app.get('/api/dashboard', async (_req, res) => {
  const [overview] = await query<{ active_varieties: string; active_plants: string; selected_plants: string }>(
    `select
      (select count(*) from varieties where status = 'active')::text as active_varieties,
      (select count(*) from plants where state = 'active')::text as active_plants,
      (select count(*) from plants where state = 'selected')::text as selected_plants`
  );

  const topPlants = await query<{ plant_code: string; score: number }>(
    `select plant_code,
      coalesce(vigor,0) + coalesce(productivity,0) + coalesce(health,0) + coalesce(morphology,0) as score
     from plants
     order by score desc
     limit 5`
  );

  res.json({ overview, topPlants });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}`);
});
