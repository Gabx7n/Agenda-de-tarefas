function adicionarTarefa() {
  const input = document.getElementById("tarefaInput");
  const lista = document.getElementById("listaTarefas");

  if (input.value.trim() === "") {
    alert("Digite uma tarefa!");
    return;
  }

  const li = document.createElement("li");
  li.textContent = input.value;

  const remover = document.createElement("span");
  remover.textContent = "🗑️";
  remover.onclick = () => li.remove();

  li.appendChild(remover);
  lista.appendChild(li);

  input.value = "";
}