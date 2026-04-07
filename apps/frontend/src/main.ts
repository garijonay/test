import './styles.css';

type Variety = {
  id: string;
  name: string;
  species: string;
  generation: string | null;
  seed_stock: number;
  status: string;
};

type DashboardResponse = {
  overview: {
    active_varieties: string;
    active_plants: string;
    selected_plants: string;
  };
  topPlants: Array<{ plant_code: string; score: number }>;
};

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');

app.innerHTML = `
  <header class="topbar">
    <h1>🌶️ Chile Breeding Tracker</h1>
    <p>PWA para hibridación, selección y trazabilidad.</p>
  </header>

  <nav class="tabs" aria-label="Navegación principal">
    <button data-tab="dashboard" class="active">Dashboard</button>
    <button data-tab="varieties">Líneas</button>
    <button data-tab="crosses">Cruces</button>
    <button data-tab="plants">Plantas</button>
    <button data-tab="tasks">Tareas</button>
  </nav>

  <main>
    <section id="dashboard" class="panel active"></section>
    <section id="varieties" class="panel"></section>
    <section id="crosses" class="panel"></section>
    <section id="plants" class="panel"></section>
    <section id="tasks" class="panel"></section>
  </main>
`;

const panels = Array.from(document.querySelectorAll<HTMLElement>('.panel'));
document.querySelectorAll<HTMLButtonElement>('.tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.tabs button.active')?.classList.remove('active');
    button.classList.add('active');

    panels.forEach((panel) => panel.classList.remove('active'));
    document.getElementById(button.dataset.tab ?? '')?.classList.add('active');
  });
});

async function loadDashboard() {
  const section = document.getElementById('dashboard');
  if (!section) return;

  const response = await fetch(`${API}/api/dashboard`);
  const data = (await response.json()) as DashboardResponse;

  section.innerHTML = `
    <div class="cards">
      <article><h3>Líneas activas</h3><strong>${data.overview.active_varieties}</strong></article>
      <article><h3>Plantas activas</h3><strong>${data.overview.active_plants}</strong></article>
      <article><h3>Plantas seleccionadas</h3><strong>${data.overview.selected_plants}</strong></article>
    </div>
    <h3>Ranking rápido</h3>
    <ul>
      ${data.topPlants.map((plant) => `<li>${plant.plant_code} · score ${plant.score}</li>`).join('')}
    </ul>
  `;
}

async function loadVarieties() {
  const section = document.getElementById('varieties');
  if (!section) return;

  const response = await fetch(`${API}/api/varieties`);
  const data = (await response.json()) as Variety[];

  section.innerHTML = `
    <h2>Líneas y variedades</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Nombre</th><th>Especie</th><th>Generación</th><th>Stock</th><th>Estado</th></tr></thead>
        <tbody>
          ${data
            .map(
              (v) => `<tr><td>${v.name}</td><td>${v.species}</td><td>${v.generation ?? '-'}</td><td>${v.seed_stock}</td><td>${v.status}</td></tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function loadSimpleList(endpoint: string, sectionId: string, title: string) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const response = await fetch(`${API}${endpoint}`);
  const data = (await response.json()) as Array<Record<string, unknown>>;

  section.innerHTML = `<h2>${title}</h2><pre>${JSON.stringify(data, null, 2)}</pre>`;
}

Promise.all([
  loadDashboard(),
  loadVarieties(),
  loadSimpleList('/api/crosses', 'crosses', 'Cruces'),
  loadSimpleList('/api/plants', 'plants', 'Plantas individuales')
]);

const tasks = document.getElementById('tasks');
if (tasks) {
  tasks.innerHTML = '<h2>Tareas</h2><p>Próxima etapa: calendario, recordatorios y panel Kanban.</p>';
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}
