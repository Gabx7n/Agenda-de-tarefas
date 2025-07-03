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
        if (tarefa.id === id) { //pega o id certinho da tarefa (talvez seja o pior jeito de fazer isso desculpa)
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