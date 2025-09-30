const http = require("http");
const fs = require("fs");
const { URL } = require("url");

// In-memory tweets (mock database)
let tweets = [];

const path = require("path");

// Request logger
function logRequest(method, url) {
    const log = `${new Date().toISOString()} - ${method} ${url}\n`;
    const logPath = path.join(__dirname, "../logs/log.txt");

    fs.appendFile(logPath, log, (err) => {
        if (err) console.error("Error writing log:", err);
    });
}


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

    // Log every request
    logRequest(method, pathname);

    try {
        // GET / - root route
        if (method === "GET" && pathname === "/") {
            res.writeHead(200, { "Content-Type": "text/plain" });
            return res.end("Hello from tweet server!");
        }

        // GET /contact-us - simple contact endpoint
        if (method === "GET" && pathname === "/contact-us") {
            return sendJson(res, 200, { email: "contact@example.com", phone: "+1-202-555-0147" }, "Contact info");
        }

        // POST /tweet - create a new tweet
        if (method === "POST" && pathname === "/tweet") {
            const body = await getRequestBody(req);
            if (!body.text) {
                return sendJson(res, 400, null, "Tweet text is required");
            }
            const newTweet = {
                id: tweets.length + 1,
                text: body.text,
                createdAt: new Date().toISOString(),
            };
            tweets.push(newTweet);
            return sendJson(res, 201, newTweet, "Tweet created");
        }

        // GET /tweet - retrieve all tweets
        if (method === "GET" && pathname === "/tweet") {
            return sendJson(res, 200, tweets, "All tweets");
        }

        // Unknown route
        sendJson(res, 404, null, "Not Found");
    } catch (err) {
        sendJson(res, 500, null, `Server Error: ${err.message}`);
    }
});

server.listen(3002, () => {
    console.log("🚀 Tweet server running at http://localhost:3002");
});
