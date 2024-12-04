// Função para obter as tarefas do localStorage ou retornar uma lista vazia
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Função para salvar as tarefas no localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// Função para filtrar e exibir as tarefas próximas (baseado em data)
function showUpcomingTasks() {
    const tasks = getTasks(); // Obtém todas as tarefas
    const currentDate = new Date(); // Data atual

    // Filtra as tarefas que têm data de vencimento no futuro
    const upcomingTasks = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate > currentDate; // Verifica se a data de vencimento é futura
    });

    // Renderiza as tarefas filtradas
    renderTasks(upcomingTasks);
}

// Função para renderizar a lista de tarefas
function renderTasks(tasksToRender = null) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpa a lista de tarefas

    // Usa todas as tarefas, se tasksToRender for nulo, senão usa a lista filtrada
    const tasks = tasksToRender || getTasks();

    tasks.forEach((task, index) => {
        const taskElement = document.createElement('li');
        taskElement.innerHTML = `
            <div class="task-info">
                <span class="${task.completed ? 'completed' : ''}">${task.description}</span>
                <span>Até: ${task.dueDate}</span>
            </div>
            <div class="task-buttons">
                <button class="complete" onclick="toggleComplete(${index})">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
                <button class="delete" onclick="deleteTask(${index})">Excluir</button>
                <button class="edit" onclick="editTask(${index})">Editar</button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}



// Função para adicionar uma nova tarefa
document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário
    
    const taskInput = document.getElementById('task-input').value;
    const dueDate = document.getElementById('due-date').value;

    if (taskInput && dueDate) {
        const tasks = getTasks();
        tasks.push({
            description: taskInput,
            dueDate: dueDate,
            completed: false
        });
        saveTasks(tasks);
        renderTasks(); // Atualiza a lista de tarefas
    }

    // Limpa os campos
    document.getElementById('task-input').value = '';
    document.getElementById('due-date').value = '';
});

// Função para alternar o estado de concluída da tarefa
function toggleComplete(index) {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

// Função para excluir uma tarefa
function deleteTask(index) {
    let tasks = getTasks();
    tasks.splice(index, 1); // Remove a tarefa
    saveTasks(tasks);
    renderTasks();
}

// Função para editar uma tarefa
let editingTaskIndex = null; // Variável global para armazenar o índice da tarefa a ser editada

// Função para abrir o modal de edição
function openModal() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'block'; // Torna o modal visível
}

// Função para fechar o modal de edição
function closeModal() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'none'; // Fecha o modal
}

// Função para editar a tarefa
function editTask(index) {
    const tasks = getTasks();
    const task = tasks[index];

    // Preenche os campos do formulário de edição
    document.getElementById('edit-task-input').value = task.description;
    document.getElementById('edit-due-date').value = task.dueDate;

    // Armazena o índice da tarefa para edição
    editingTaskIndex = index;

    // Abre o modal
    openModal();
}

// Função para salvar as alterações no modal
document.getElementById('edit-task-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    // Obtém os valores dos inputs do modal
    const updatedDescription = document.getElementById('edit-task-input').value;
    const updatedDueDate = document.getElementById('edit-due-date').value;

    if (updatedDescription && updatedDueDate) {
        const tasks = getTasks();
        const task = tasks[editingTaskIndex];

        // Atualiza a tarefa
        task.description = updatedDescription;
        task.dueDate = updatedDueDate;

        // Salva as tarefas atualizadas
        saveTasks(tasks);

        // Fecha o modal
        closeModal();

        // Atualiza a lista de tarefas na página
        renderTasks();
    }
});


// Função para filtrar as tarefas próximas
function filterUpcomingTasks() {
    const filter = document.getElementById('upcoming-filter').value;
    const tasks = getTasks();
    
    // Filtra as tarefas de acordo com a data
    const filteredTasks = tasks.filter(task => {
        const taskDueDate = new Date(task.dueDate);
        const today = new Date();
        if (filter === 'today') {
            return taskDueDate.toDateString() === today.toDateString();
        } else if (filter === 'week') {
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            return taskDueDate <= nextWeek && taskDueDate >= today;
        } else if (filter === 'month') {
            const nextMonth = new Date();
            nextMonth.setMonth(today.getMonth() + 1);
            return taskDueDate <= nextMonth && taskDueDate >= today;
        }
        return true;
    });
    
    // Renderiza as tarefas filtradas
    renderFilteredTasks(filteredTasks);
}

// Função para exibir as tarefas concluídas
function showCompletedTasks() {
    const tasks = getTasks();
    const completedTasks = tasks.filter(task => task.completed);
    renderFilteredTasks(completedTasks);
}

// Função para filtrar as tarefas concluídas
function filterCompletedTasks() {
    const filter = document.getElementById('completed-filter').value;
    const tasks = getTasks();
    
    const filteredTasks = tasks.filter(task => {
        const taskDueDate = new Date(task.dueDate);
        const today = new Date();
        if (filter === 'today') {
            return task.completed && taskDueDate.toDateString() === today.toDateString();
        } else if (filter === 'week') {
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            return task.completed && taskDueDate <= nextWeek && taskDueDate >= today;
        } else if (filter === 'month') {
            const nextMonth = new Date();
            nextMonth.setMonth(today.getMonth() + 1);
            return task.completed && taskDueDate <= nextMonth && taskDueDate >= today;
        }
        return task.completed;
    });
    
    renderFilteredTasks(filteredTasks);
}

// Função de pesquisa de tarefas
function searchTasks() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const tasks = getTasks();
    
    const filteredTasks = tasks.filter(task => task.description.toLowerCase().includes(query));
    
    renderFilteredTasks(filteredTasks);
}

// Função para renderizar tarefas filtradas
function renderFilteredTasks(filteredTasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    filteredTasks.forEach((task, index) => {
        const taskElement = document.createElement('li');
        taskElement.classList.add('task');
        
        taskElement.innerHTML = `
            <div class="task-info">
                <span class="${task.completed ? 'completed' : ''}">${task.description}</span>
                <span>Até: ${task.dueDate}</span>
            </div>
            <div class="task-buttons">
                <button class="complete" onclick="toggleComplete(${index})">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
                <button class="delete" onclick="deleteTask(${index})">Excluir</button>
                <button class="edit" onclick="editTask(${index})">Editar</button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}

// Inicializa a renderização das tarefas ao carregar a página
renderTasks();
