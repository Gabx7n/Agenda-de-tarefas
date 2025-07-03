function pegarTarefas() {
  return JSON.parse(localStorage.getItem("tarefas")) || [];
}

function salvarTarefas(tarefas) {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function toggleConcluida(id) {
  const tarefas = pegarTarefas();
  const atualizadas = tarefas.map(tarefa =>
    tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
  );
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

  if (texto !== "" && data !== "") {
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
    mostrarTarefasDoDia();
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

    const grupo = document.createElement("div");
    grupo.className = "form-check d-flex align-items-center";
    grupo.style.flex = "1";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input me-2";
    checkbox.checked = tarefa.concluida;

    checkbox.addEventListener("change", () => {
      const atualizadas = toggleConcluida(tarefa.id);
      mostrarTarefasDoDia();
    });

    const label = document.createElement("label");
    label.className = "form-check-label";
    if (tarefa.concluida) {
      label.style.textDecoration = "line-through";
      label.style.opacity = "0.6";
    }
    label.textContent = tarefa.texto;

    const hora = document.createElement("small");
    hora.className = "ms-3";
    hora.textContent = formatarHora(tarefa.data);

    grupo.appendChild(checkbox);
    grupo.appendChild(label);
    grupo.appendChild(hora);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.className = "btn btn-sm btn-danger ms-3";
    botaoExcluir.innerHTML = '<i class="bi bi-trash"></i>';
    botaoExcluir.onclick = () => {
      const atualizadas = apagarTarefa(tarefa.id);
      mostrarTarefasDoDia();
    };

    item.appendChild(grupo);
    item.appendChild(botaoExcluir);
    lista.appendChild(item);
  });
}

function formatarHora(dataIso) {
  const data = new Date(dataIso);
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  return `${horas}:${minutos}`;
}

function mostrarTarefasDoDia() {
  const hoje = new Date().toISOString().split("T")[0];
  const tarefas = pegarTarefas();
  const doDia = tarefas
    .filter(t => t.data && t.data.startsWith(hoje))
    .sort((a, b) => new Date(a.data) - new Date(b.data));
  mostrarTarefas(doDia);
}

document.addEventListener("DOMContentLoaded", mostrarTarefasDoDia);
