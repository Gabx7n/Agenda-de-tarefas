//funcao pra fazer o parsing das tarefas e pegar o objeto "tarefas"
function pegarTarefas() {
    return JSON.parse(localStorage.getItem("tarefas")) || [];
}
//salva no localstorage
function salvarTarefas(tarefas) {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}
//só salva as tarefas que foram marcadas como concluídas e coloca pra serem tiradas no filtro dps
function toggleConcluida(id) {
    const tarefas = pegarTarefas();
    const atualizadas = tarefas.map(tarefa => {
        if (tarefa.id === id) { //pega o id certinho da tarefa (talvez seja o pior jeito de fazer isso desculpa betina)
            return { ...tarefa, concluida: !tarefa.concluida };
        }
        return tarefa;
    });
    salvarTarefas(atualizadas);
    return atualizadas;
}

//xunxera pra tirar as tarefas do localstorage pelo id
function apagarTarefa(id) {
    const tarefas = pegarTarefas();
    const atualizadas = tarefas.filter(tarefa => tarefa.id !== id);
    salvarTarefas(atualizadas);
    return atualizadas;
}
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const dataInput = document.getElementById("taskDate");
const lista = document.getElementById("taskList");
const verTodas = document.getElementById("showAllTasks");
if (verTodas) {
    verTodas.addEventListener("click", function () {
        window.location.href = "todas-tarefas.html";
    });
}
let timeInput = document.getElementById("taskTime");

//de novo xunxera, verifica se o form existe antes de adicionar o listener
if (form) {
    // Adiciona o campo de hora antes do botão de submit, se ainda não existir
    if (!timeInput) {
        const divHora = document.createElement("div");
        divHora.className = "mb-3";
        const inputHora = document.createElement("input");
        inputHora.type = "time";
        inputHora.id = "taskTime";
        inputHora.className = "form-control";
        divHora.appendChild(inputHora);
        form.insertBefore(divHora, form.querySelector('button[type="submit"]'));
        timeInput = inputHora;
    }
    form.addEventListener("submit", function (e) { // <--- listener aq
        e.preventDefault();
        const texto = input.value.trim();
        const data = dataInput.value;
        const hora = timeInput ? timeInput.value : "";
        if (texto !== "") {
            const tarefas = pegarTarefas();
            const novaTarefa = {
                id: Date.now(),
                texto: texto,
                data: data,
                hora: hora,
                concluida: false
            };
            tarefas.push(novaTarefa);
            salvarTarefas(tarefas);
            input.value = "";
            dataInput.value = "";
            if (timeInput) timeInput.value = "";
            // Atualiza a lista de tarefas do dia imediatamente
            mostrarTarefasHoje();
        }
    });
}
if (document.getElementById("allTasksList")) {
    const allTasksList = document.getElementById("allTasksList");
    const filterButtons = document.querySelectorAll('[data-filter]');
    const clearCompletedBtn = document.getElementById("clearAllCompleted");
    let currentFilter = "all";
    // Adiciona campo de filtro por hora acima da lista, com botão
    if (!document.getElementById('filterTime')) {
        const filtroDiv = document.createElement('div');
        filtroDiv.className = 'mb-3 d-flex align-items-end';
        const filtroLabel = document.createElement('label');
        filtroLabel.textContent = 'Filtrar por hora:';
        filtroLabel.setAttribute('for', 'filterTime');
        filtroLabel.className = 'form-label me-2';
        const filtroInput = document.createElement('input');
        filtroInput.type = 'time';
        filtroInput.id = 'filterTime';
        filtroInput.className = 'form-control me-2';
        const filtroBtn = document.createElement('button');
        filtroBtn.type = 'button';
        filtroBtn.className = 'btn btn-primary';
        filtroBtn.textContent = 'Buscar';
        filtroDiv.appendChild(filtroLabel);
        filtroDiv.appendChild(filtroInput);
        filtroDiv.appendChild(filtroBtn);
        allTasksList.parentNode.insertBefore(filtroDiv, allTasksList);
    }
    // Referências para filtro de hora e botão já no HTML
    const filtroHora = document.getElementById('filterTime');
    const filtroBtn = document.getElementById('filterTimeBtn');
    // Só aplica o filtro qnc clicar no botão
    let horaFiltrada = '';
    if (filtroBtn && filtroHora) {
        filtroBtn.addEventListener('click', function() {
            horaFiltrada = filtroHora.value;
            renderAllTasks();
        });
    } 
}
if (document.getElementById("allTasksList")) {
    const allTasksList = document.getElementById("allTasksList");
    const filterButtons = document.querySelectorAll('[data-filter]');
    const clearCompletedBtn = document.getElementById("clearAllCompleted");
    let currentFilter = "all";

    // Adiciona campo de filtro por hora acima da lista, com botão
    if (!document.getElementById('filterTime')) {
        const filtroDiv = document.createElement('div');
        filtroDiv.className = 'mb-3 d-flex align-items-end';
        const filtroLabel = document.createElement('label');
        filtroLabel.textContent = 'Filtrar por hora:';
        filtroLabel.setAttribute('for', 'filterTime');
        filtroLabel.className = 'form-label me-2';
        const filtroInput = document.createElement('input');
        filtroInput.type = 'time';
        filtroInput.id = 'filterTime';
        filtroInput.className = 'form-control me-2';
        const filtroBtn = document.createElement('button');
        filtroBtn.type = 'button';
        filtroBtn.className = 'btn btn-primary';
        filtroBtn.textContent = 'Buscar';
        filtroBtn.id = 'filterTimeBtn';
        filtroDiv.appendChild(filtroLabel);
        filtroDiv.appendChild(filtroInput);
        filtroDiv.appendChild(filtroBtn);
        allTasksList.parentNode.insertBefore(filtroDiv, allTasksList);
    }
    const filtroHora = document.getElementById('filterTime');
    const filtroBtn = document.getElementById('filterTimeBtn');
    let horaFiltrada = '';
    if (filtroBtn && filtroHora) {
        filtroBtn.addEventListener('click', function() {
            horaFiltrada = filtroHora.value;
            renderAllTasks();
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderAllTasks();
        });
    });

    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', function() {
            const tarefas = pegarTarefas().filter(t => !t.concluida);
            salvarTarefas(tarefas);
            renderAllTasks();
        });
    }

    function renderAllTasks() {
        let tarefas = pegarTarefas();
        if (currentFilter === "pending") tarefas = tarefas.filter(t => !t.concluida);
        if (currentFilter === "completed") tarefas = tarefas.filter(t => t.concluida);
        if (horaFiltrada) tarefas = tarefas.filter(t => t.hora === horaFiltrada);
        allTasksList.innerHTML = "";
        if (tarefas.length === 0) {
            allTasksList.innerHTML = `<li class="list-group-item text-center text-muted">Nenhuma tarefa encontrada.</li>`;
            return;
        }
        tarefas.forEach(tarefa => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                <span>
                    <input type="checkbox" ${tarefa.concluida ? "checked" : ""} data-id="${tarefa.id}" class="me-2 toggle-task">
                    <strong>${tarefa.texto}</strong>
                    <small class="text-muted ms-2">${tarefa.data || ""} ${tarefa.hora || ""}</small>
                </span>
                <span>
                    <a href="editar-tarefas.html?id=${tarefa.id}" class="btn btn-sm btn-outline-primary me-1" title="Editar"><i class="bi bi-pencil"></i></a>
                    <button class="btn btn-sm btn-outline-danger apagar-tarefa" data-id="${tarefa.id}" title="Apagar"><i class="bi bi-trash"></i></button>
                </span>
            `;
            allTasksList.appendChild(li);
        });

        // listeners para concluir/apagar
        allTasksList.querySelectorAll('.toggle-task').forEach(cb => {
            cb.addEventListener('change', function() {
                toggleConcluida(Number(this.getAttribute('data-id')));
                renderAllTasks();
            });
        });
        allTasksList.querySelectorAll('.apagar-tarefa').forEach(btn => {
            btn.addEventListener('click', function() {
                apagarTarefa(Number(this.getAttribute('data-id')));
                renderAllTasks();
            });
        });
    }
    renderAllTasks();
}

// --- EDIÇÃO DE TAREFAS ---
if (window.location.pathname.endsWith('editar-tarefas.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));
    const form = document.getElementById('editTaskForm');
    const input = document.getElementById('editTaskInput');
    const dataInput = document.getElementById('editTaskDate');
    const timeInput = document.getElementById('editTaskTime');
    if (id && form && input && dataInput && timeInput) {
        const tarefas = pegarTarefas();
        const tarefa = tarefas.find(t => t.id === id);
        if (tarefa) {
            input.value = tarefa.texto;
            dataInput.value = tarefa.data || '';
            timeInput.value = tarefa.hora || '';
        }
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            tarefa.texto = input.value.trim();
            tarefa.data = dataInput.value;
            tarefa.hora = timeInput.value;
            salvarTarefas(tarefas);
            window.location.href = "todas-tarefas.html";
        });
    }
}

// --- EDIÇÃO DE TAREFAS EM MASSA ---
if (window.location.pathname.endsWith('editar-tarefas.html')) {
    const tasksList = document.getElementById('tasksList');
    const form = document.getElementById('editTasksForm');
    let tarefas = pegarTarefas();
    function renderEditList() {
        tarefas = pegarTarefas();
        tasksList.innerHTML = '';
        if (tarefas.length === 0) {
            tasksList.innerHTML = '<div class="text-center text-muted">Nenhuma tarefa encontrada.</div>';
            return;
        }
        tarefas.forEach((tarefa, idx) => {
            const div = document.createElement('div');
            div.className = 'mb-3 border rounded p-2';
            div.innerHTML = `
                <label class='form-label'>Tarefa</label>
                <input type='text' class='form-control mb-2' value='${tarefa.texto}' data-idx='${idx}' data-field='texto' required>
                <label class='form-label'>Data</label>
                <input type='date' class='form-control mb-2' value='${tarefa.data || ''}' data-idx='${idx}' data-field='data'>
                <label class='form-label'>Hora</label>
                <input type='time' class='form-control mb-2' value='${tarefa.hora || ''}' data-idx='${idx}' data-field='hora'>
                <div class='form-check mb-2'>
                    <input type='checkbox' class='form-check-input' id='concluida${idx}' data-idx='${idx}' data-field='concluida' ${tarefa.concluida ? 'checked' : ''}>
                    <label class='form-check-label' for='concluida${idx}'>Concluída</label>
                </div>
                <button type='button' class='btn btn-outline-danger btn-sm apagar-tarefa' data-idx='${idx}'>Apagar</button>
            `;
            tasksList.appendChild(div);
        });
        // listeners para apagar
        tasksList.querySelectorAll('.apagar-tarefa').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = Number(this.getAttribute('data-idx'));
                tarefas.splice(idx, 1);
                salvarTarefas(tarefas);
                renderEditList();
            });
        });
        // listeners para inputs
        tasksList.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function() {
                const idx = Number(this.getAttribute('data-idx'));
                const field = this.getAttribute('data-field');
                if (field === 'concluida') {
                    tarefas[idx][field] = this.checked;
                } else {
                    tarefas[idx][field] = this.value;
                }
            });
            if (input.type === 'checkbox') {
                input.addEventListener('change', function() {
                    const idx = Number(this.getAttribute('data-idx'));
                    tarefas[idx]['concluida'] = this.checked;
                });
            }
        });
    }
    renderEditList();
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        salvarTarefas(tarefas);
        window.location.href = 'todas-tarefas.html';
    });
}

// --- MOSTRAR TAREFAS DO DIA ---
function mostrarTarefasHoje() {
    const lista = document.getElementById("taskList");
    if (!lista) return;
    const tarefas = pegarTarefas();
    const hoje = new Date();
    const hojeStr = hoje.toISOString().slice(0, 10);
    const tarefasHoje = tarefas.filter(t => t.data === hojeStr);
    lista.innerHTML = "";
    if (tarefasHoje.length === 0) {
        lista.innerHTML = '<li class="list-group-item text-center text-muted">Nenhuma tarefa para hoje.</li>';
        return;
    }
    tarefasHoje.forEach(tarefa => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <span>
                <input type="checkbox" ${tarefa.concluida ? "checked" : ""} data-id="${tarefa.id}" class="me-2 toggle-task">
                <strong>${tarefa.texto}</strong>
                <small class="text-muted ms-2">${tarefa.hora || ""}</small>
            </span>
            <span>
                <a href="editar-tarefas.html?id=${tarefa.id}" class="btn btn-sm btn-outline-primary me-1" title="Editar"><i class="bi bi-pencil"></i></a>
                <button class="btn btn-sm btn-outline-danger apagar-tarefa" data-id="${tarefa.id}" title="Apagar"><i class="bi bi-trash"></i></button>
            </span>
        `;
        lista.appendChild(li);
    });
    // listeners para concluir/apagar
    lista.querySelectorAll('.toggle-task').forEach(cb => {
        cb.addEventListener('change', function() {
            toggleConcluida(Number(this.getAttribute('data-id')));
            mostrarTarefasHoje();
        });
    });
    lista.querySelectorAll('.apagar-tarefa').forEach(btn => {
        btn.addEventListener('click', function() {
            apagarTarefa(Number(this.getAttribute('data-id')));
            mostrarTarefasHoje();
        });
    });
}
mostrarTarefasHoje();