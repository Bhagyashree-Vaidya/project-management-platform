document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    // Load tasks from local storage
    loadTasks();

    // Add Task
    addTaskButton.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;
        
        addTask(taskText);
        taskInput.value = "";
        saveTasks();
    });

    // Mark as Complete or Remove Task
    taskList.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            e.target.classList.toggle("completed");
        } else if (e.target.tagName === "SPAN") {
            e.target.parentElement.remove();
        }
        saveTasks();
    });

    function addTask(taskText) {
        const li = document.createElement("li");
        li.textContent = taskText;

        const deleteBtn = document.createElement("span");
        deleteBtn.textContent = " ❌";
        deleteBtn.style.cursor = "pointer";

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#taskList li").forEach(li => {
            tasks.push({
                text: li.textContent.replace(" ❌", ""),
                completed: li.classList.contains("completed")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        storedTasks.forEach(task => {
            addTask(task.text);
            if (task.completed) {
                taskList.lastChild.classList.add("completed");
            }
        });
    }
});
