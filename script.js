//funcao pra fazer o parsing das tarefas e pegar o objeto "tarefas"
function pegarTarefas() {
    return JSON.parse(localStorage.getItem("tarefas")) || [];
}
//salva no localstorage
function salvarTarefas(tarefas) {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    alert("Tarefas salvas com sucesso!");
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

//de novo xunxera, verifica se o form existe antes de adicionar o listener
if (form) {
    form.addEventListener("submit", function (e) { // <--- listener aq
        e.preventDefault();
        const texto = input.value.trim();
        const data = dataInput.value;
        if (texto !== "") {
            const tarefas = pegarTarefas();
            const novaTarefa = {
                id: Date.now(),
                texto: texto,
                data: data,
                concluida: false
            };
            tarefas.push(novaTarefa);
            salvarTarefas(tarefas);
            input.value = "";
            dataInput.value = "";
        }
    });
}
if (document.getElementById("allTasksList")) {
    const allTasksList = document.getElementById("allTasksList");
    const filterButtons = document.querySelectorAll('[data-filter]');
    const clearCompletedBtn = document.getElementById("clearAllCompleted");
    let currentFilter = "all";
    // renderiza todas as tarefas com base no filtro atual
    function renderAllTasks() {
        let tarefas = pegarTarefas();
        if (currentFilter === "pending") {
            tarefas = tarefas.filter(t => !t.concluida);
        } else if (currentFilter === "completed") {
            tarefas = tarefas.filter(t => t.concluida);
        }
        allTasksList.innerHTML = "";
        if (tarefas.length === 0) {
            const vazio = document.createElement("li");
            vazio.className = "list-group-item text-center text-muted";
            vazio.textContent = "Nenhuma tarefa encontrada.";
            allTasksList.appendChild(vazio);
            return;
    // a cada tarefa ele faz um foreach para criar os elementos 
        }
        tarefas.forEach(tarefa => {
            const item = document.createElement("li");
            item.className = "list-group-item d-flex justify-content-between align-items-center task-item";
            const grupo = document.createElement("div");
            grupo.className = "form-check d-flex align-items-center";
            grupo.style.flex = "1";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "form-check-input me-2";
            checkbox.checked = tarefa.concluida;
            checkbox.addEventListener("change", () => {
                toggleConcluida(tarefa.id);
                
            });
            //odeio bootstrap mas é o que tem pra hoje
            const texto = document.createElement("span");
            texto.textContent = `${tarefa.texto}${tarefa.data ? ' - ' + tarefa.data : ''}`;
            if (tarefa.concluida) {
                texto.style.textDecoration = "line-through";
                texto.style.opacity = "0.6";
            }
            const editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = tarefa.texto;
            editInput.className = "form-control form-control-sm me-2";
            editInput.style.display = "none";

            const btnEditar = document.createElement("button");
            btnEditar.className = "btn btn-sm btn-outline-secondary ms-2";
            btnEditar.textContent = "Editar";
            let editando = false;
            btnEditar.addEventListener("click", () => {
                if (!editando) {
                    texto.style.display = "none";
                    editInput.style.display = "inline-block";
                    editInput.focus();
                    btnEditar.textContent = "Salvar";
                    editando = true;
                } else {
                    const novoTexto = editInput.value.trim();
                    if (novoTexto) {
                        const tarefasAtual = pegarTarefas();
                        const atualizadas = tarefasAtual.map(t => t.id === tarefa.id ? { ...t, texto: novoTexto } : t);
                        salvarTarefas(atualizadas);
                        renderAllTasks();
                    }
                }
            });
            editInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    btnEditar.click();
                }
            });
            //appendendo os elementos
            grupo.appendChild(checkbox);
            grupo.appendChild(texto);
            grupo.appendChild(editInput);
            item.appendChild(grupo);
            item.appendChild(btnEditar);
            const btnApagar = document.createElement("button");
            btnApagar.className = "btn btn-sm btn-outline-danger ms-2"; 
            btnApagar.textContent = "Excluir";
            btnApagar.addEventListener("click", () => {
                apagarTarefa(tarefa.id);
                renderAllTasks();
            });
            item.appendChild(btnApagar);
            allTasksList.appendChild(item);
        });
    }
// filtra os botoes de filtro (pendente, concluída, todas)
    filterButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            filterButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            currentFilter = this.getAttribute("data-filter");
            renderAllTasks();
        });
    });

    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener("click", function() {
            let tarefas = pegarTarefas(); 
            tarefas = tarefas.filter(t => !t.concluida);
            salvarTarefas(tarefas);
            renderAllTasks();
        });
    }

    renderAllTasks();
}

if (verTodas) {
    verTodas.addEventListener("click", function () {
        window.location.href = "todas-tarefas.html"; // troca a página para ver todas as tarefas
    });
}
