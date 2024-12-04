document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const dueDate = document.getElementById('due-date');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Função para salvar no localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks)) || [];
    }

    // Função para renderizar as tarefas
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('li');
            if (task.completed) {
                taskElement.classList.add('completed');
            }
            

            taskElement.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.description}</span>
                <span>Até: ${task.dueDate}</span>
                <div>
                    <button class="complete" onclick="toggleComplete(${index})">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
                    <button class="delete" onclick="deleteTask(${index})">Excluir</button>
                    <button class="edit" onclick="editTask(${index})">Editar</button>
                </div>
            `;
            taskList.appendChild(taskElement);
        });
    }

    // Função para adicionar tarefa
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTask = {
            description: taskInput.value,
            dueDate: dueDate.value,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        
        renderTasks();

        taskInput.value = '';
        dueDate.value = '';
    });

    // Função para alternar o estado de conclusão da tarefa
    window.toggleComplete = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    // Função para excluir tarefa
    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    // Função para editar a tarefa
    window.editTask = (index) => {
        const task = tasks[index];
        const newDescription = prompt('Editar Tarefa', task.description);
        const newDueDate = prompt('Editar Data de Término', task.dueDate);

        if (newDescription && newDueDate) {
            tasks[index].description = newDescription;
            tasks[index].dueDate = newDueDate;
            saveTasks();
            renderTasks();
        }
    };

    // Renderiza as tarefas existentes ao carregar a página
    renderTasks();
});
