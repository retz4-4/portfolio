
const CATEGORIES = ['All','Workout','Nutrition','Recovery','Goals'];
let activeTab = 'All';

let tasks = [
{ id: 1, text: '5km morning run — steady pace', cat: 'Workout', priority: 'high', done: false, time: '6:00 AM' },
{ id: 2, text: 'Prep high-protein meal for post-workout', cat: 'Nutrition', priority: 'medium', done: false, time: '8:00 AM' },
{ id: 3, text: 'Upper body strength session — 45 min', cat: 'Workout', priority: 'high', done: true, time: '10:00 AM' },
{ id: 4, text: '10 min foam rolling & stretching', cat: 'Recovery', priority: 'low', done: false, time: '12:00 PM' },
{ id: 5, text: 'Log weekly weight & measurements', cat: 'Goals', priority: 'medium', done: false, time: '7:00 PM' },
{ id: 6, text: 'Drink 3L of water', cat: 'Nutrition', priority: 'low', done: true, time: 'All day' },
];

let nextId = 7;

// Set date
const d = new Date();
document.getElementById('dateChip').textContent =
d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });

// Render
function render() {
const container = document.getElementById('taskContainer');
const filtered = activeTab === 'All' ? tasks : tasks.filter(t => t.cat === activeTab);

const pending = filtered.filter(t => !t.done);
const done = filtered.filter(t => t.done);

// Progress (all tasks, not just filtered)
const totalDone = tasks.filter(t => t.done).length;
const total = tasks.length;
document.getElementById('progressCount').textContent = `${totalDone}/${total}`;
document.getElementById('progressFill').style.width = total ? `${(totalDone/total)*100}%` : '0%';

container.innerHTML = '';

if (pending.length === 0 && done.length === 0) {
container.innerHTML = `<div class="empty"><span class="empty-icon">🏋️</span><p>No tasks here yet — add one above!</p></div>`;
return;
}

if (pending.length > 0) {
container.innerHTML += `<div class="section-label">Active (${pending.length})</div>`;
const list = document.createElement('div');
list.className = 'task-list';
pending.forEach(t => list.appendChild(makeTask(t)));
container.appendChild(list);
}

if (done.length > 0) {
container.innerHTML += `<div class="section-label">Completed (${done.length})</div>`;
const list = document.createElement('div');
list.className = 'task-list';
done.forEach(t => list.appendChild(makeTask(t)));
container.appendChild(list);
}
}

function makeTask(t) {
const el = document.createElement('div');
el.className = `task-item priority-${t.priority}${t.done ? ' done' : ''}`;
el.innerHTML = `
<div class="check">
<svg width="12" height="9" viewBox="0 0 12 9" fill="none">
<path d="M1 4L4.5 7.5L11 1" stroke="#0d0d0f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
<div class="task-content">
<div class="task-text">${t.text}</div>
<div class="task-meta">
<span class="task-cat">${t.cat}</span>
<span class="task-time">${t.time}</span>
</div>
</div>
<button class="del-btn" title="Delete">×</button>
`;
el.querySelector('.check').addEventListener('click', e => { e.stopPropagation(); toggle(t.id); });
el.querySelector('.del-btn').addEventListener('click', e => { e.stopPropagation(); remove(t.id); });
el.addEventListener('click', () => toggle(t.id));
return el;
}

function toggle(id) {
const t = tasks.find(t => t.id === id);
if (!t) return;
t.done = !t.done;
if (t.done) flash();
render();
}

function remove(id) {
tasks = tasks.filter(t => t.id !== id);
render();
}

function flash() {
const el = document.createElement('div');
el.className = 'flash';
document.body.appendChild(el);
setTimeout(() => el.remove(), 400);
}

function addTask() {
const input = document.getElementById('taskInput');
const text = input.value.trim();
if (!text) { input.focus(); input.style.borderColor = 'var(--accent2)'; setTimeout(() => input.style.borderColor = '', 600); return; }
const cat = activeTab === 'All' ? 'Workout' : activeTab;
const priority = document.getElementById('prioritySelect').value;
const now = new Date();
const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
tasks.unshift({ id: nextId++, text, cat, priority, done: false, time });
input.value = '';
input.focus();
render();
}

document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

document.getElementById('tabs').addEventListener('click', e => {
const tab = e.target.closest('.tab');
if (!tab) return;
document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
tab.classList.add('active');
activeTab = tab.dataset.cat;
render();
});

render();
