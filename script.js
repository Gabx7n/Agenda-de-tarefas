function pegarTarefas() {
    return JSON.parse(localStorage.getItem("tarefas")) || [];
}

function salvarTarefas(tarefas) {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function toggleConcluida(id) {
    const tarefas = pegarTarefas();
    const tarefasAtualizadas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
            return { ...tarefa, concluida: !tarefa.concluida };
        }
        return tarefa;
    });
    salvarTarefas(tarefasAtualizadas);
    return tarefasAtualizadas;
}

function apagarTarefa(id) {
    const tarefas = pegarTarefas();
    const tarefasAtualizadas = tarefas.filter(tarefa => tarefa.id !== id);
    salvarTarefas(tarefasAtualizadas);
    return tarefasAtualizadas;
}

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const lista = document.getElementById("taskList");
const verTodas = document.getElementById("showAllTasks");

form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const texto = input.value.trim();
    if (texto !== "") {
        const tarefas = pegarTarefas();
        const novaTarefa = {
            id: Date.now(),
            texto: texto,
            concluida: false
        };
        tarefas.push(novaTarefa);
        salvarTarefas(tarefas);
        input.value = "";
    }
});

verTodas.addEventListener("click", function () {
    const tarefas = pegarTarefas();
    mostrarTarefas(tarefas);
});

function mostrarTarefas(tarefas) {
    lista.innerHTML = "";

    tarefas.forEach((tarefa) => {
        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.style.flex = "1";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input me-2";
        checkbox.checked = tarefa.concluida;

        if (tarefa.concluida) {
            label.style.textDecoration = "line-through";
            label.style.opacity = "0.6";
        }

        checkbox.addEventListener("change", () => {
            const atualizadas = toggleConcluida(tarefa.id);
            mostrarTarefas(atualizadas);
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(tarefa.texto));
        item.appendChild(label);
        lista.appendChild(item);
    });
}
