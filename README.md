# Node.js HTTP Servers Practice

This project contains **three independent Node.js HTTP servers**, each focusing on a different resource, plus a **unified server** that combines all routes.
The goal is to practice building REST-like APIs **without any external frameworks** (like Express).

---

## 🚀 Project Overview

* **Users Server (`src/users/index.js`)**
  Handles basic CRUD operations on a `users` collection (in-memory).

* **Tasks Server (`src/tasks/tasks-server.js`)**
  Handles CRUD operations for `tasks`, including updating completion status.

* **Tweets Server (`src/tweets/tweet-server.js`)**
  A simple tweet API with logging functionality that stores requests in `logs/log.txt`.

* **Unified Server (`src/server.js`)**
  A single server that combines **Users**, **Tasks**, and **Tweets** APIs into one.

Each standalone server runs on its own port (**3000**, **3001**, **3002**), while the unified server runs on **4000** by default.

---

## 📂 Project Structure

```
node-http-servers-practice/
├─ src/
│  ├─ users/
│  │  └─ index.js        # Users server
│  ├─ tasks/
│  │  └─ tasks-server.js # Tasks server
│  ├─ tweets/
│  │  └─ tweet-server.js # Tweets server
│  └─ server.js          # Unified server
├─ logs/
│  └─ log.txt            # Created automatically by tweet-server
├─ package.json
├─ package-lock.json
├─ .gitignore
└─ README.md
```

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

### 4️⃣ Unified API (`src/server.js`)

The unified server combines **Users**, **Tasks**, and **Tweets** into one API.
It also includes a health check endpoint:

| Method | Endpoint   | Description              |
| ------ | ---------- | ------------------------ |
| GET    | `/health`  | Server uptime and status |
| ...    | `/users/*` | All Users API routes     |
| ...    | `/tasks/*` | All Tasks API routes     |
| ...    | `/tweet*`  | All Tweets API routes    |

---

## 🛠️ How to Run

### Option 1: Run files directly

```
# Run Users server
node src/users/index.js

# Run Tasks server
node src/tasks/tasks-server.js

# Run Tweets server
node src/tweets/tweet-server.js

# Run Unified server
node src/server.js
```

### Option 2: Run with npm scripts

I’ve added handy npm scripts to make it easier:

```
# Run Users server
npm run start:users

# Run Tasks server
npm run start:tasks

# Run Tweets server
npm run start:tweets

# Run Unified server
npm run start:unified

# Default (runs Unified server)
npm start
```

---

## 🎯 What You’ll Learn

* How to build a **raw Node.js HTTP server**.
* How to work with **in-memory mock databases**.
* How to implement **CRUD operations** without frameworks.
* How to handle **JSON parsing and error handling**.
* How to add **logging** to your APIs.
* How to combine multiple APIs into one **unified server**.

---

## 📖 Next Steps

* Add persistence with a real database (MongoDB, PostgreSQL).
* Use Express.js or another framework to simplify routing.
* Add automated tests with a testing framework.
