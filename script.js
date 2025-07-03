function pegarTarefas() {
    return JSON.parse(localStorage.getItem("tarefas")) || [];
}

function salvarTarefas(tarefas) {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function toggleConcluida(id) {
    const tarefas = pegarTarefas();

    const atualizadas = tarefas.map(tarefa => {

    const tarefasAtualizadas = tarefas.map(tarefa => {

        if (tarefa.id === id) {
            return { ...tarefa, concluida: !tarefa.concluida };
        }
        return tarefa;
    });

    salvarTarefas(atualizadas);
    return atualizadas;

}

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

form.addEventListener("submit", function (e) {
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

verTodas.addEventListener("click", function () {
    const tarefas = pegarTarefas();
    mostrarTarefas(tarefas);
});

function mostrarTarefas(tarefas) {
    lista.innerHTML = "";
        const grupo = document.createElement("div");
        grupo.className = "form-check d-flex align-items-center";
        grupo.style.flex = "1";


        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input me-2";
        checkbox.checked = tarefa.concluida;

        const texto = document.createElement("span");
        texto.textContent = `${tarefa.texto}${tarefa.data ? ' - ' + tarefa.data : ''}`;
        if (tarefa.concluida) {
            texto.style.textDecoration = "line-through";
            texto.style.opacity = "0.6";
        }

        checkbox.addEventListener("change", () => {
            const atualizadas = toggleConcluida(tarefa.id);
            mostrarTarefas(atualizadas);
        });

        const btnApagar = document.createElement("button");
        btnApagar.className = "btn btn-sm btn-outline-danger ms-2";
        btnApagar.textContent = "Excluir";
        btnApagar.addEventListener("click", () => {
            const atualizadas = apagarTarefa(tarefa.id);
            mostrarTarefas(atualizadas);
        });

        grupo.appendChild(checkbox);
        grupo.appendChild(texto);
        item.appendChild(grupo);
        item.appendChild(btnApagar);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(tarefa.texto));
        item.appendChild(label);

}
