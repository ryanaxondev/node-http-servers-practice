const http = require("http");
const { URL } = require("url");
const fs = require("fs");

const PORT = 4000;

// ---------------- Mock Databases ----------------
let users = [
  { id: Date.now(), name: "John" },
  { id: Date.now() + 1, name: "Emma" },
];

let tasks = [
  { id: Date.now(), title: "Learn Node.js", completed: false },
  { id: Date.now() + 1, title: "Practice HTTP Server", completed: true },
];

let tweets = [];

// ---------------- Helpers ----------------
function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, status, data) {
  setCors(res);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

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

function logRequest(method, url) {
  const log = `${new Date().toISOString()} - ${method} ${url}\n`;
  fs.appendFile("logs/log.txt", log, (err) => {
    if (err) console.error("Error writing log:", err);
  });
}

// ---------------- Server ----------------
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const { method } = req;

  // Handle preflight requests (CORS)
  if (method === "OPTIONS") {
    setCors(res);
    return res.end();
  }

  // Log each request
  logRequest(method, pathname);

  try {
    // ---------------- Health ----------------
    if (method === "GET" && pathname === "/health") {
      return sendJson(res, 200, { status: "ok", uptime: process.uptime() });
    }

    // ---------------- Users ----------------
    if (method === "GET" && pathname === "/users") {
      return sendJson(res, 200, users);
    }

    if (method === "POST" && pathname === "/users") {
      const newUser = await getRequestBody(req);
      if (!newUser.name) return sendJson(res, 400, { error: "Name is required" });

      newUser.id = Date.now();
      users.push(newUser);
      return sendJson(res, 201, { message: "User created", user: newUser });
    }

    if ((method === "PUT" || method === "PATCH") && pathname.startsWith("/users/")) {
      const id = parseInt(pathname.split("/")[2]);
      const user = users.find((u) => u.id === id);
      if (!user) return sendJson(res, 404, { error: "User not found" });

      const updatedData = await getRequestBody(req);
      Object.assign(user, updatedData);
      return sendJson(res, 200, { message: "User updated", user });
    }

    if (method === "DELETE" && pathname.startsWith("/users/")) {
      const id = parseInt(pathname.split("/")[2]);
      users = users.filter((u) => u.id !== id);
      return sendJson(res, 200, { message: `User with id ${id} deleted` });
    }

    // ---------------- Tasks ----------------
    if (method === "GET" && pathname === "/tasks") {
      return sendJson(res, 200, tasks);
    }

    if (method === "POST" && pathname === "/tasks") {
      const body = await getRequestBody(req);
      if (!body.title) return sendJson(res, 400, { error: "Title is required" });

      const newTask = {
        id: Date.now(),
        title: body.title,
        completed: false,
      };
      tasks.push(newTask);
      return sendJson(res, 201, { message: "Task created", task: newTask });
    }

    if (method === "PUT" && pathname.startsWith("/tasks/")) {
      const id = parseInt(pathname.split("/")[2]);
      const task = tasks.find((t) => t.id === id);
      if (!task) return sendJson(res, 404, { error: "Task not found" });

      const body = await getRequestBody(req);
      if (body.title !== undefined) task.title = body.title;
      if (body.completed !== undefined) task.completed = Boolean(body.completed);

      return sendJson(res, 200, { message: "Task updated", task });
    }

    if (method === "DELETE" && pathname.startsWith("/tasks/")) {
      const id = parseInt(pathname.split("/")[2]);
      const taskIndex = tasks.findIndex((t) => t.id === id);
      if (taskIndex === -1) return sendJson(res, 404, { error: "Task not found" });

      const deletedTask = tasks.splice(taskIndex, 1)[0];
      return sendJson(res, 200, { message: "Task deleted", task: deletedTask });
    }

    // ---------------- Tweets ----------------
    if (method === "GET" && pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("Hello from unified server!");
    }

    if (method === "GET" && pathname === "/contact-us") {
      return sendJson(res, 200, {
        email: "contact@example.com",
        phone: "+1-202-555-0147",
      });
    }

    if (method === "POST" && pathname === "/tweet") {
      const body = await getRequestBody(req);
      if (!body.text) return sendJson(res, 400, { error: "Tweet text is required" });

      const newTweet = {
        id: Date.now(),
        text: body.text,
        createdAt: new Date().toISOString(),
      };
      tweets.push(newTweet);
      return sendJson(res, 201, { message: "Tweet created", tweet: newTweet });
    }

    if (method === "GET" && pathname === "/tweet") {
      return sendJson(res, 200, tweets);
    }

    // ---------------- Unknown ----------------
    sendJson(res, 404, { error: "Not Found" });
  } catch (err) {
    sendJson(res, 500, { error: "Server Error", details: err.message });
  }
});

// ---------------- Run Server ----------------
server.listen(PORT, () => {
  console.log(`🚀 Unified server running at http://localhost:${PORT}`);
});
