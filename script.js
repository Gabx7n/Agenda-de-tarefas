function toggleConcluida(id) {
    const tarefas = pegarTarefas();
    const tarefasAtualizadas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
            return {...tarefa, concluida: !tarefa.concluida};
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
