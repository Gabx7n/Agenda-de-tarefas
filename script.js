document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const filterButtons = document.querySelectorAll('[data-filter]');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    
    let tasks = loadTasks();
    
    renderTasks(getCurrentFilter());

    taskForm.addEventListener('submit', handleAddTask);
    taskList.addEventListener('change', handleTaskStatusChange);
    taskList.addEventListener('click', handleTaskActions);
    clearCompletedBtn.addEventListener('click', handleClearCompleted);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            setActiveFilter(button);
            renderTasks(button.dataset.filter);
        });
    });

    
    function loadTasks() {
        try {
            return JSON.parse(localStorage.getItem('tasks')) || [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
        });
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                <li class="list-group-item text-center text-muted py-4">
                    Nenhuma tarefa ${filter === 'all' ? 'criada' : filter === 'completed' ? 'concluída' : 'pendente'}
                </li>
            `;
            updateTaskCount();
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
        
        updateTaskCount();
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center task-item ${task.completed ? 'completed-task' : ''}`;
        li.dataset.id = task.id;
        
        li.innerHTML = `
            <div class="d-flex align-items-center w-100">
                <input class="form-check-input me-3 task-check" type="checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-text flex-grow-1">${escapeHtml(task.text)}</div>
                <input type="text" class="form-control edit-input" value="${escapeHtml(task.text)}">
            </div>
            <div class="task-actions">
                <button class="btn btn-sm btn-outline-primary edit-btn me-1" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        
        return li;
    }

    function updateTaskCount() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        taskCount.textContent = `${completedTasks} de ${totalTasks} tarefas concluídas`;
    }

    function handleAddTask(e) {
        e.preventDefault();
        
        const taskText = taskInput.value.trim();
        if (!taskText) return;
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks(getCurrentFilter());
        taskInput.value = '';
        taskInput.focus();
    }

    function handleTaskStatusChange(e) {
        if (!e.target.classList.contains('task-check')) return;
        
        const taskId = parseInt(e.target.closest('li').dataset.id);
        const task = tasks.find(task => task.id === taskId);
        
        if (task) {
            task.completed = e.target.checked;
            saveTasks();
            renderTasks(getCurrentFilter());
        }
    }

    function handleTaskActions(e) {
        const li = e.target.closest('li');
        if (!li) return;
        
        const taskId = parseInt(li.dataset.id);
        const task = tasks.find(task => task.id === taskId);
        if (!task) return;
        
        if (e.target.closest('.edit-btn')) {
            handleEditTask(li, task);
        }
        
        if (e.target.closest('.delete-btn')) {
            tasks = tasks.filter(t => t.id !== taskId);
            saveTasks();
            renderTasks(getCurrentFilter());
        }
    }

    function handleEditTask(li, task) {
        const taskText = li.querySelector('.task-text');
        const editInput = li.querySelector('.edit-input');
        
        if (taskText.style.display !== 'none') {
            taskText.style.display = 'none';
            editInput.style.display = 'block';
            editInput.focus();
            
            editInput.addEventListener('keydown', function handleKeyDown(e) {
                if (e.key === 'Enter') {
                    saveEdit(li, task, taskText, editInput);
                    editInput.removeEventListener('keydown', handleKeyDown);
                } else if (e.key === 'Escape') {
                    cancelEdit(taskText, editInput);
                    editInput.removeEventListener('keydown', handleKeyDown);
                }
            });
            
            editInput.addEventListener('blur', function handleBlur() {
                saveEdit(li, task, taskText, editInput);
                editInput.removeEventListener('blur', handleBlur);
            });
        } else {
            saveEdit(li, task, taskText, editInput);
        }
    }

    function saveEdit(li, task, taskText, editInput) {
        const newText = editInput.value.trim();
        if (newText && newText !== task.text) {
            task.text = newText;
            saveTasks();
            taskText.textContent = newText;
        }
        cancelEdit(taskText, editInput);
    }

    function cancelEdit(taskText, editInput) {
        taskText.style.display = 'block';
        editInput.style.display = 'none';
    }

    function handleClearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks(getCurrentFilter());
    }

    function setActiveFilter(button) {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    function getCurrentFilter() {
        const activeButton = document.querySelector('[data-filter].active');
        return activeButton ? activeButton.dataset.filter : 'all';
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});