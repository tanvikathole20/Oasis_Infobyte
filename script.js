const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const emptyPending = document.getElementById("emptyPending");
const emptyCompleted = document.getElementById("emptyCompleted");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTime() {
    return new Date().toLocaleString();
}

function updateCounters() {
    const pending = tasks.filter(task => !task.completed).length;
    const completed = tasks.filter(task => task.completed).length;

    pendingCount.textContent = pending;
    completedCount.textContent = completed;

    emptyPending.style.display = pending === 0 ? "block" : "none";
    emptyCompleted.style.display = completed === 0 ? "block" : "none";
}

function renderTasks() {

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
        <div class="task-info">
            <span class="task-text">${task.text}</span>
            <span class="time">${task.time}</span>
        </div>

        <div class="btn-group">

            ${
                !task.completed
                    ? `<button class="complete-btn" data-index="${index}">✔</button>`
                    : ""
            }

            <button class="edit-btn" data-index="${index}">Edit</button>

            <button class="delete-btn" data-index="${index}">Delete</button>

        </div>
        `;

        if (task.completed) {
            completedList.appendChild(li);
        } else {
            pendingList.appendChild(li);
        }
    });

    addEvents();

    updateCounters();

    saveTasks();
}

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        text: text,
        completed: false,
        time: getTime()
    });

    taskInput.value = "";

    renderTasks();
}

function addEvents() {

    document.querySelectorAll(".complete-btn").forEach(button => {

        button.addEventListener("click", () => {

            const index = button.dataset.index;

            tasks[index].completed = true;

            renderTasks();

        });

    });

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.addEventListener("click", () => {

            const index = button.dataset.index;

            tasks.splice(index, 1);

            renderTasks();

        });

    });

    document.querySelectorAll(".edit-btn").forEach(button => {

        button.addEventListener("click", () => {

            const index = button.dataset.index;

            const newTask = prompt("Edit Task", tasks[index].text);

            if (newTask !== null && newTask.trim() !== "") {

                tasks[index].text = newTask.trim();

                tasks[index].time = getTime();

                renderTasks();

            }

        });

    });

}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e) {

    if (e.key === "Enter") {

        addTask();

    }

});

renderTasks();