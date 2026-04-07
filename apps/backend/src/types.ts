export type Variety = {
  id: string;
  name: string;
  species: string;
  origin: string | null;
  generation: string | null;
  seed_stock: number;
  status: 'active' | 'archived';
  notes: string | null;
  created_at: string;
};

export type Cross = {
  id: string;
  mother_variety_id: string;
  father_variety_id: string;
  pollination_date: string;
  status: 'planned' | 'pollinated' | 'harvested' | 'failed';
  flowers_pollinated: number;
  seed_batch_code: string | null;
  notes: string | null;
};

export type Plant = {
  id: string;
  plant_code: string;
  variety_id: string;
  generation: string;
  germination_date: string | null;
  transplant_date: string | null;
  harvest_date: string | null;
  location: string | null;
  vigor: number | null;
  productivity: number | null;
  health: number | null;
  morphology: number | null;
  state: 'active' | 'selected' | 'discarded' | 'lost';
};
