// Datos de tareas iniciales para ejemplos
let tasks = [
  {
    id: 1,
    name: 'Reunión de Proyecto',
    notes: 'Preparar presentación para la reunión con el equipo.',
    time: '10:00',
    priority: 'alta',
    date: 'hoy'
  },
  {
    id: 2,
    name: 'Almuerzo con el equipo',
    notes: 'Discutir avances del proyecto durante el almuerzo.',
    time: '13:00',
    priority: 'media',
    date: 'hoy'
  },
  {
    id: 3,
    name: 'Presentación de la propuesta',
    notes: 'Presentar la propuesta final al cliente.',
    time: '09:00',
    priority: 'alta',
    date: 'mañana'
  },
  {
    id: 4,
    name: 'Revisión de código',
    notes: 'Revisar el código de la implementación actual.',
    time: '14:00',
    priority: 'media',
    date: 'mañana'
  }
];

// Referencias a elementos DOM
const addTaskBtn = document.getElementById('add-task-btn');
const addTaskModal = document.getElementById('add-task-modal');
const taskDetailModal = document.getElementById('task-detail-modal');
const saveTaskBtn = document.getElementById('save-task-btn');
const completeTaskBtn = document.getElementById('complete-task-btn');
const tasksContainer = document.getElementById('tasks-container');
const closeButtons = document.querySelectorAll('.close');

// Variables para el seguimiento del ID de tarea actual
let currentTaskId = null;
let nextId = 5; // Comenzamos con 5 porque ya tenemos 4 tareas predefinidas

// Función para mostrar un modal
function showModal(modal) {
  modal.classList.add('show');
  modal.classList.remove('hidden');
}

// Función para ocultar un modal
function hideModal(modal) {
  modal.classList.remove('show');
  modal.classList.add('hidden');
}

// Cargar tareas en la interfaz
function renderTasks() {
  // Limpiar el contenedor de tareas
  tasksContainer.innerHTML = '';
  
  // Agrupar tareas por fecha
  const groupedTasks = tasks.reduce((acc, task) => {
    acc[task.date] = acc[task.date] || [];
    acc[task.date].push(task);
    return acc;
  }, {});
  
  // Renderizar tareas agrupadas por fecha
  for (const date in groupedTasks) {
    // Agregar encabezado de sección por fecha
    const dateHeading = document.createElement('h3');
    dateHeading.className = 'text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4';
    dateHeading.textContent = date.charAt(0).toUpperCase() + date.slice(1); // Capitalizar primera letra
    tasksContainer.appendChild(dateHeading);
    
    // Agregar cada tarea de esta fecha
    groupedTasks[date].forEach(task => {
      const taskElement = createTaskElement(task);
      tasksContainer.appendChild(taskElement);
    });
  }
}

// Crear elemento de tarea
function createTaskElement(task) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'flex items-center gap-4 bg-[#10231c] px-4 min-h-[72px] py-2 task-item';
  taskDiv.dataset.taskId = task.id;
  
  taskDiv.innerHTML = `
    <div class="text-white flex items-center justify-center rounded-lg bg-[#214a3c] shrink-0 size-12" data-icon="Circle" data-size="24px" data-weight="regular">
      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path>
      </svg>
    </div>
    <div class="flex-1 flex flex-col justify-center">
      <p class="text-white text-base font-medium leading-normal line-clamp-1">${task.name}</p>
      <p class="text-[#8ecdb7] text-sm font-normal leading-normal line-clamp-2">${task.time}</p>
    </div>
    <div class="task-actions flex gap-2">
      <button class="edit-task-btn text-[#8ecdb7] hover:text-white p-2" data-task-id="${task.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
        </svg>
      </button>
      <button class="delete-task-btn text-[#8ecdb7] hover:text-red-500 p-2" data-task-id="${task.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
        </svg>
      </button>
    </div>
  `;
  
  // Agregar evento de clic para mostrar detalles (solo en el área principal, no en los botones)
  const mainContent = taskDiv.querySelector('.flex-1');
  mainContent.addEventListener('click', (e) => {
    showTaskDetails(task.id);
  });
  
  // Agregar eventos para los botones de editar y eliminar
  const editBtn = taskDiv.querySelector('.edit-task-btn');
  const deleteBtn = taskDiv.querySelector('.delete-task-btn');
  
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    editTask(task.id);
  });
  
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.name}"?`)) {
      deleteTask(task.id);
    }
  });
  
  return taskDiv;
}

// Mostrar detalles de una tarea
function showTaskDetails(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  // Actualizar la vista de detalles con los datos de la tarea
  document.getElementById('detail-task-title').textContent = task.name;
  document.getElementById('detail-task-notes').value = task.notes;
  document.getElementById('detail-task-time').textContent = formatTime(task.time);
  document.getElementById('detail-task-priority').textContent = capitalizeFirstLetter(task.priority);
  
  // Guardar la tarea actual
  currentTaskId = taskId;
  
  // Mostrar el modal
  showModal(taskDetailModal);
}

// Función auxiliar para formatear hora
function formatTime(time) {
  // Suponiendo que time viene en formato "HH:MM"
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  
  // Determinar AM/PM
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12; // Convertir a formato 12 horas
  
  return `${hour12}:${minutes} ${period}`;
}

// Función auxiliar para capitalizar la primera letra
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Agregar o actualizar una tarea
function addTask() {
  const taskName = document.getElementById('task-name').value.trim();
  const taskNotes = document.getElementById('task-notes').value.trim();
  const taskTime = document.getElementById('task-time').value;
  const taskPriority = document.getElementById('task-priority').value;
  
  if (!taskName) {
    alert('Por favor, ingresa un nombre para la tarea.');
    return;
  }
  
  if (isEditing && editingTaskId !== null) {
    // Si estamos editando, buscamos la tarea original para obtener la fecha
    const originalTask = tasks.find(t => t.id === editingTaskId);
    const date = originalTask ? originalTask.date : 'hoy';
    
    // Crear la tarea actualizada
    const updatedTask = {
      id: editingTaskId,
      name: taskName,
      notes: taskNotes,
      time: taskTime,
      priority: taskPriority,
      date: date
    };
    
    // Agregar la tarea actualizada
    tasks.push(updatedTask);
  } else {
    // Crear nueva tarea
    const newTask = {
      id: nextId++,
      name: taskName,
      notes: taskNotes,
      time: taskTime,
      priority: taskPriority,
      date: 'hoy' // Por defecto, la tarea se agrega para hoy
    };
    
    // Agregar a la lista
    tasks.push(newTask);
  }
  
  // Renderizar las tareas actualizadas
  renderTasks();
  
  // Limpiar formulario y resetear variables de edición
  document.getElementById('task-name').value = '';
  document.getElementById('task-notes').value = '';
  document.getElementById('task-time').value = '10:00';
  document.getElementById('task-priority').value = 'media';
  isEditing = false;
  editingTaskId = null;
  
  hideModal(addTaskModal);
}

// Variables para controlar la edición
let isEditing = false;
let editingTaskId = null;

// Editar una tarea
function editTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  // Marcar que estamos en modo edición
  isEditing = true;
  editingTaskId = taskId;

  // Prellenar el formulario con la tarea existente
  document.getElementById('task-name').value = task.name;
  document.getElementById('task-notes').value = task.notes;
  document.getElementById('task-time').value = task.time;
  document.getElementById('task-priority').value = task.priority;

  // Mostrar el modal para editar
  showModal(addTaskModal);
}

// Eliminar una tarea
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  renderTasks();
  hideModal(taskDetailModal);
}

// Completar una tarea
function completeTask(taskId) {
  // En una aplicación real, marcaríamos la tarea como completada
  // Por ahora, simplemente la eliminamos de la lista
  tasks = tasks.filter(task => task.id !== taskId);
  renderTasks();
  hideModal(taskDetailModal);
}

// Event Listeners
addTaskBtn.addEventListener('click', () => showModal(addTaskModal));

saveTaskBtn.addEventListener('click', addTask);

completeTaskBtn.addEventListener('click', () => {
  if (currentTaskId) {
    completeTask(currentTaskId);
  }
});

// Cerrar modales con los botones de cierre
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Si estamos editando, restauramos la tarea original
    if (isEditing && editingTaskId !== null) {
      const originalTask = tasks.find(t => t.id === editingTaskId);
      if (!originalTask) {
        // Si la tarea fue eliminada durante la edición, la restauramos
        const taskToRestore = {
          id: editingTaskId,
          name: document.getElementById('task-name').value,
          notes: document.getElementById('task-notes').value,
          time: document.getElementById('task-time').value,
          priority: document.getElementById('task-priority').value,
          date: 'hoy'
        };
        tasks.push(taskToRestore);
        renderTasks();
      }
    }
    
    // Resetear estado de edición
    isEditing = false;
    editingTaskId = null;
    
    // Ocultar modales
    hideModal(addTaskModal);
    hideModal(taskDetailModal);
  });
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
  if (event.target === addTaskModal) {
    // Si estamos editando, restauramos la tarea original
    if (isEditing && editingTaskId !== null) {
      const originalTask = tasks.find(t => t.id === editingTaskId);
      if (!originalTask) {
        // Si la tarea fue eliminada durante la edición, la restauramos
        const taskToRestore = {
          id: editingTaskId,
          name: document.getElementById('task-name').value,
          notes: document.getElementById('task-notes').value,
          time: document.getElementById('task-time').value,
          priority: document.getElementById('task-priority').value,
          date: 'hoy'
        };
        tasks.push(taskToRestore);
        renderTasks();
      }
    }
    
    // Resetear estado de edición
    isEditing = false;
    editingTaskId = null;
    
    hideModal(addTaskModal);
  }
  if (event.target === taskDetailModal) {
    hideModal(taskDetailModal);
  }
});

// Manejar el menú hamburguesa para dispositivos móviles
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Cerrar el menú móvil cuando se hace clic en un enlace o fuera de él
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) { // Ancho de md en Tailwind
      mobileMenu.classList.add('hidden');
    }
  });
});

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  
  // Asegurarse de que el menú esté visible en desktop al cargar la página
  if (window.innerWidth >= 768) { // md breakpoint
    mobileMenu.classList.remove('hidden');
  } else {
    mobileMenu.classList.add('hidden');
  }
  
  // Ajustar visibilidad del menú al cambiar el tamaño de la ventana
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) { // md breakpoint
      mobileMenu.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('hidden');
    }
  });
});
