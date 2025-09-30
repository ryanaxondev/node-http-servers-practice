# Node.js HTTP Servers Practice

This project contains **three independent Node.js HTTP servers**, each focusing on a different resource.  
The goal is to practice building REST-like APIs **without any external frameworks** (like Express).

## 🚀 Project Overview

* **Users Server (`src/users/index.js`)**  
  Handles basic CRUD operations on a `users` collection (in-memory).

* **Tasks Server (`src/tasks/tasks-server.js`)**  
  Handles CRUD operations for `tasks`, including updating completion status.

* **Tweets Server (`src/tweets/tweet-server.js`)**  
  A simple tweet API with logging functionality that stores requests in `logs/log.txt`.

Each server runs independently on its own port (**3000**, **3001**, **3002**).  
You can run them one at a time depending on what you want to test.

---

## 📂 Project Structure

node-http-servers-practice/
├─ src/
│ ├─ users/
│ │ └─ index.js # Users server
│ ├─ tasks/
│ │ └─ tasks-server.js # Tasks server
│ ├─ tweets/
│ │ └─ tweet-server.js # Tweets server
│ └─ server.js # Unified server (optional, not included yet)
├─ logs/
│ └─ log.txt # Created automatically by tweet-server
├─ package.json
├─ package-lock.json
├─ .gitignore
└─ README.md

---

## 📌 API Endpoints

### 1️⃣ Users API (`src/users/index.js`)

| Method | Endpoint     | Description             |
| ------ | ------------ | ----------------------- |
| GET    | `/users`     | Get all users           |
| POST   | `/users`     | Create a new user       |
| PUT    | `/users/:id` | Update a user (replace) |
| PATCH  | `/users/:id` | Update a user (partial) |
| DELETE | `/users/:id` | Delete a user           |

---

### 2️⃣ Tasks API (`src/tasks/tasks-server.js`)

| Method | Endpoint     | Description                  |
| ------ | ------------ | ---------------------------- |
| GET    | `/tasks`     | Get all tasks                |
| POST   | `/tasks`     | Create a new task            |
| PUT    | `/tasks/:id` | Update task title/completion |
| DELETE | `/tasks/:id` | Delete a task                |

---

### 3️⃣ Tweets API (`src/tweets/tweet-server.js`)

| Method | Endpoint      | Description                        |
| ------ | ------------- | ---------------------------------- |
| GET    | `/`           | Root route, returns plain text     |
| GET    | `/contact-us` | Contact info (mock)                |
| GET    | `/tweet`      | Get all tweets                     |
| POST   | `/tweet`      | Create a new tweet (requires text) |

📌 Every request to the tweet server is logged into `logs/log.txt` with timestamp, method, and URL.

---

## 🛠️ How to Run

1. Clone the repository:

   ```
   git clone https://github.com/ryanaxondev/node-http-servers-practice.git
   cd node-http-servers-practice
   ```

2. Run any server (example: users server):

   ```
   node src/users/index.js
   ```

   or (example: tasks server):

   ```
   node src/tasks/tasks-server.js
   ```

   or (example: tweets server):

   ```
   node src/tweets/tweet-server.js
   ```


3. Test endpoints using **Postman**, **cURL**, or your browser.

---

## 🎯 What You’ll Learn

* How to build a **raw Node.js HTTP server**.
* How to work with **in-memory mock databases**.
* How to implement **CRUD operations** without frameworks.
* How to handle **JSON parsing and error handling**.
* How to add **logging** to your APIs.

---

## 📖 Next Steps

* Combine all three servers into a **single unified server** (planned as `src/server.js`).
* Add persistence with a real database (MongoDB, PostgreSQL).
* Use Express.js or another framework to simplify routing.