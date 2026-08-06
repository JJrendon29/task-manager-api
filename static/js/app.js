let token = null
let currentFilter = 'all'
let demoEmail = null

const STATUS_LABELS = {
  pending: 'pendiente',
  in_progress: 'en progreso',
  done: 'hecho'
}

const STATUS_NEXT = {
  pending: 'in_progress',
  in_progress: 'done',
  done: 'pending'
}

function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

async function startDemo() {
  const btn = document.getElementById('demo-btn')
  const errorEl = document.getElementById('landing-error')

  btn.disabled = true
  btn.textContent = 'Creando tu espacio...'
  errorEl.classList.remove('visible')

  demoEmail = `demo_${randomString(8)}@test.com`
  const password = randomString(12)

  try {
    const reg = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: demoEmail, password })
    })

    if (!reg.ok) throw new Error('No se pudo crear la sesión demo.')

    const login = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `username=${encodeURIComponent(demoEmail)}&password=${encodeURIComponent(password)}`
    })

    if (!login.ok) throw new Error('No se pudo iniciar sesión.')

    const data = await login.json()
    token = data.access_token

    document.getElementById('topbar-user').textContent = demoEmail
    showScreen('screen-tasks')
    loadTasks()

  } catch (e) {
    errorEl.textContent = e.message
    errorEl.classList.add('visible')
    btn.disabled = false
    btn.textContent = 'Probar demo'
  }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'))
  document.getElementById(id).classList.remove('hidden')
}

async function loadTasks() {
  const errorEl = document.getElementById('tasks-error')
  errorEl.classList.remove('visible')

  try {
    const params = currentFilter !== 'all' ? `?status=${currentFilter}` : ''
    const res = await fetch(`/tasks/${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!res.ok) throw new Error('No se pudieron cargar las tareas.')

    const tasks = await res.json()
    renderTasks(tasks)

  } catch (e) {
    errorEl.textContent = e.message
    errorEl.classList.add('visible')
  }
}

function renderTasks(tasks) {
  const list = document.getElementById('tasks-list')
  const empty = document.getElementById('empty-state')

  if (tasks.length === 0) {
    list.innerHTML = ''
    empty.classList.remove('hidden')
    return
  }

  empty.classList.add('hidden')
  list.innerHTML = tasks.map(task => `
    <div class="task-item" id="task-${task.id}">
      <span class="task-title ${task.status === 'done' ? 'done' : ''}">${escapeHtml(task.title)}</span>
      <span
        class="status-badge status-${task.status}"
        onclick="cycleStatus(${task.id}, '${task.status}')"
        title="Clic para cambiar estado"
      >${STATUS_LABELS[task.status]}</span>
      <button class="delete-btn" onclick="deleteTask(${task.id})" title="Eliminar">✕</button>
    </div>
  `).join('')
}

async function createTask() {
  const input = document.getElementById('new-task-input')
  const title = input.value.trim()

  if (!title) return

  try {
    const res = await fetch('/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    })

    if (!res.ok) throw new Error('No se pudo crear la tarea.')

    input.value = ''
    loadTasks()

  } catch (e) {
    const errorEl = document.getElementById('tasks-error')
    errorEl.textContent = e.message
    errorEl.classList.add('visible')
  }
}

async function cycleStatus(id, currentStatus) {
  const nextStatus = STATUS_NEXT[currentStatus]

  try {
    const res = await fetch(`/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: nextStatus })
    })

    if (!res.ok) throw new Error('No se pudo actualizar.')
    loadTasks()

  } catch (e) {
    const errorEl = document.getElementById('tasks-error')
    errorEl.textContent = e.message
    errorEl.classList.add('visible')
  }
}

async function deleteTask(id) {
  try {
    const res = await fetch(`/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!res.ok) throw new Error('No se pudo eliminar.')
    loadTasks()

  } catch (e) {
    const errorEl = document.getElementById('tasks-error')
    errorEl.textContent = e.message
    errorEl.classList.add('visible')
  }
}

function setFilter(btn, status) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  currentFilter = status
  loadTasks()
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('new-task-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') createTask()
  })
})