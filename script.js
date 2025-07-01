document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const filterButtons = document.querySelectorAll('[data-filter]');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
        });
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<li class="list-group-item text-center text-muted py-4">Nenhuma tarefa encontrada</li>';
        } else {
            filteredTasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.className = `list-group-item d-flex justify-content-between align-items-center task-item ${task.completed ? 'completed-task' : ''}`;
                li.dataset.id = task.id;
                
                li.innerHTML = `
                    <div class="d-flex align-items-center w-100">
                        <input class="form-check-input me-3 task-check" type="checkbox" ${task.completed ? 'checked' : ''}>
                        <div class="task-text flex-grow-1">${task.text}</div>
                        <input type="text" class="form-control edit-input" value="${task.text}">
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-sm btn-outline-primary edit-btn me-1">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                
                taskList.appendChild(li);
            });
        }
        
        updateTaskCount();
    }
    
    function updateTaskCount() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        taskCount.textContent = `${completedTasks} de ${totalTasks} tarefas concluídas`;
    }
    
    // Adicionar nova tarefa
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (taskInput.value.trim() === '') return;
        
        const newTask = {
            id: Date.now(),
            text: taskInput.value.trim(),
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks(document.querySelector('[data-filter].active').dataset.filter);
        taskInput.value = '';
        taskInput.focus();
    });
    
    // Marcar tarefa como concluída/pendente
    taskList.addEventListener('change', function(e) {
        if (e.target.classList.contains('task-check')) {
            const taskId = parseInt(e.target.closest('li').dataset.id);
            const task = tasks.find(task => task.id === taskId);
            task.completed = e.target.checked;
            saveTasks();
            renderTasks(document.querySelector('[data-filter].active').dataset.filter);
        }
    });
    
    // Filtrar tarefas
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderTasks(this.dataset.filter);
        });
    });
    
    // Editar tarefa
    taskList.addEventListener('click', function(e) {
        if (e.target.closest('.edit-btn')) {
            const li = e.target.closest('li');
            const taskId = parseInt(li.dataset.id);
            const taskText = li.querySelector('.task-text');
            const editInput = li.querySelector('.edit-input');
            const task = tasks.find(task => task.id === taskId);
            
            if (taskText.style.display !== 'none') {
                taskText.style.display = 'none';
                editInput.style.display = 'block';
                editInput.focus();
            } else {
                const newText = editInput.value.trim();
                if (newText !== '') {
                    task.text = newText;
                    saveTasks();
                    taskText.textContent = newText;
                }
                taskText.style.display = 'block';
                editInput.style.display = 'none';
                renderTasks(document.querySelector('[data-filter].active').dataset.filter);
            }
        }
    });
    
    // Deletar tarefa
    taskList.addEventListener('click', function(e) {
        if (e.target.closest('.delete-btn')) {
            const taskId = parseInt(e.target.closest('li').dataset.id);
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks(document.querySelector('[data-filter].active').dataset.filter);
        }
    });
    
    clearCompletedBtn.addEventListener('click', function() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks(document.querySelector('[data-filter].active').dataset.filter);
    });
    
    // Salvar tarefas no localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    renderTasks();
});