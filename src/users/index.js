const http = require("http");
const { URL } = require("url");

// In-memory users data (mock database)
let users = [
    { id: 1, name: "John" },
    { id: 2, name: "Emma" },
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
        // GET /users - retrieve all users
        if (method === "GET" && pathname === "/users") {
            return sendJson(res, 200, users, "All users");
        }

        // POST /users - create a new user
        if (method === "POST" && pathname === "/users") {
            const newUser = await getRequestBody(req);
            newUser.id = users.length + 1;
            users.push(newUser);
            return sendJson(res, 201, newUser, "User created");
        }

        // PUT or PATCH /users/:id - update a user
        if ((method === "PUT" || method === "PATCH") && pathname.startsWith("/users/")) {
            const id = parseInt(pathname.split("/")[2]);
            const updatedData = await getRequestBody(req);

            let user = users.find((u) => u.id === id);
            if (!user) return sendJson(res, 404, null, "User not found");

            Object.assign(user, updatedData);
            return sendJson(res, 200, user, "User updated");
        }

        // DELETE /users/:id - remove a user
        if (method === "DELETE" && pathname.startsWith("/users/")) {
            const id = parseInt(pathname.split("/")[2]);
            users = users.filter((u) => u.id !== id);
            return sendJson(res, 200, null, `User with id ${id} deleted`);
        }

        // Unknown route
        sendJson(res, 404, null, "Not Found");
    } catch (err) {
        sendJson(res, 500, null, `Server Error: ${err.message}`);
    }
});

server.listen(3000, () => {
    console.log("🚀 User server running at http://localhost:3000");
});
