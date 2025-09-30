const http = require("http");
const { URL } = require("url");

let tasks = [
    { id: 1, title: "Learn Node.js", completed: false },
    { id: 2, title: "Practice HTTP Server", completed: true },
];

// Helper function to send JSON response
function sendJson(res, status, data, message = null) {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message, data }));
}

// Helper function to parse request body
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                reject(err);
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const { method } = req;

    try {
        // GET /tasks - retrieve all tasks
        if (method === "GET" && pathname === "/tasks") {
            return sendJson(res, 200, tasks, "All tasks");
        }

        // POST /tasks - create a new task
        if (method === "POST" && pathname === "/tasks") {
            const body = await getRequestBody(req);
            if (!body.title) {
                return sendJson(res, 400, null, "Title is required");
            }
            const newTask = {
                id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
                title: body.title,
                completed: false,
            };
            tasks.push(newTask);
            return sendJson(res, 201, newTask, "Task created");
        }

        // PUT or PATCH /tasks/:id - update a task
        if ((method === "PUT" || method === "PATCH") && pathname.startsWith("/tasks/")) {
            const id = parseInt(pathname.split("/")[2], 10);
            const task = tasks.find((t) => t.id === id);
            if (!task) return sendJson(res, 404, null, "Task not found");

            const body = await getRequestBody(req);
            if (body.title !== undefined) task.title = body.title;
            if (body.completed !== undefined) task.completed = Boolean(body.completed);

            return sendJson(res, 200, task, "Task updated");
        }

        // DELETE /tasks/:id - remove a task
        if (method === "DELETE" && pathname.startsWith("/tasks/")) {
            const id = parseInt(pathname.split("/")[2], 10);
            const taskIndex = tasks.findIndex((t) => t.id === id);
            if (taskIndex === -1) return sendJson(res, 404, null, "Task not found");

            const deletedTask = tasks.splice(taskIndex, 1)[0];
            return sendJson(res, 200, deletedTask, "Task deleted");
        }

        // Unknown route
        sendJson(res, 404, null, "Not Found");
    } catch (err) {
        sendJson(res, 500, null, `Server Error: ${err.message}`);
    }
});

server.listen(3001, () => {
    console.log("🚀 Task server running at http://localhost:3001");
});
