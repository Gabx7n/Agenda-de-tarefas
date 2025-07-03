function salvarTarefas(tarefas) {
    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
}

function pegarTarefas() {
    const tarefasSalvas = localStorage.getItem('minhasTarefas');
    return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
}

function adicionarTarefa(texto) {
    const tarefas = pegarTarefas();
    const novaTarefa = {
        id: Date.now(),
        texto: texto,
        concluida: false
    };
    tarefas.push(novaTarefa);
    salvarTarefas(tarefas);
    return novaTarefa;
}

