# Local setup user manual

This guide explains how to run the **E-Learning Management System** on your own computer: **MySQL database**, **Spring Boot API**, and **React (Vite) frontend**. Follow the steps in order.

For architecture, features, and API tables, see the main [README.md](README.md).

---

## 1. What to install first

| Software | Version | Why |
|----------|---------|-----|
| **Git** | Any recent | Clone the repository |
| **Java** | **17 or newer** | Backend (Spring Boot). `java -version` should show 17+ |
| **Node.js** | **LTS (e.g. 20+)** | Frontend build and dev server |
| **Docker Desktop** | Current | **Easiest way** to run MySQL (recommended) |

You do **not** need a global Maven install if you use the project’s Maven Wrapper (`mvnw` / `mvnw.cmd`) in the `backend` folder.

---

## 2. Get the project

```bash
git clone <YOUR_REPO_URL>
cd <project-folder>
```

Replace `<YOUR_REPO_URL>` with the real Git URL your team uses.

---

## 3. Start MySQL (recommended: Docker)

The repo includes **`docker-compose.yml`** with MySQL preconfigured to match the app defaults.

1. Start **Docker Desktop** and wait until it is running.
2. From the **project root** (the folder that contains `docker-compose.yml`):

   ```bash
   docker compose up -d mysql
   ```

   This creates:

   - **Database:** `lms_elearn_db`
   - **User:** `lms_user`
   - **Password:** `lms_password`
   - **Port:** `3306` on your machine

3. Wait ~30 seconds the first time so MySQL finishes initializing.

**Optional — phpMyAdmin:** from the same folder, run `docker compose up -d` to also start phpMyAdmin at [http://localhost:8081](http://localhost:8081) (login: **root** / **root**).

**Optional — load SQL schema:** if you want the tables exactly as in the repo script (requires a `mysql` client on your PATH):

```powershell
# Windows (PowerShell), from project root
Get-Content backend\database\lms_schema.sql | mysql -h 127.0.0.1 -P 3306 -u lms_user -plms_password lms_elearn_db
```

```bash
# macOS / Linux, from project root
mysql -h 127.0.0.1 -P 3306 -u lms_user -plms_password lms_elearn_db < backend/database/lms_schema.sql
```

If you skip this step, Hibernate can still create/update tables (`spring.jpa.hibernate.ddl-auto=update`), but the SQL file is the documented baseline.

---

## 4. Backend (Spring Boot)

### 4.1 Local config file

The file **`backend/.env.local`** is **not** committed to Git (it is ignored for safety). You must create it on each machine.

1. Create **`backend/.env.local`**.
2. Paste and adjust the following (passwords must match your MySQL user):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lms_elearn_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=lms_user
spring.datasource.password=lms_password

server.port=8080

app.jwt.secret=ZmFrZV9qb3Nlc19zZWNyZXRfMzJieXRlc19iYXNlNjQ=
app.jwt.expirationMs=86400000

file.upload-dir=./uploads/course-content

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=
spring.mail.password=

app.frontend.base-url=http://localhost:5173
```

If you use different DB credentials, change the three `spring.datasource.*` lines.  
Email fields can stay empty unless you need password-reset email locally; see also **`backend/env.example`** for environment-variable style setup (Docker/CI).

### 4.2 Run the API

Open a terminal **in the `backend` directory** (important so `.env.local` is picked up).

- **Windows (PowerShell or CMD):**

  ```powershell
  cd backend
  .\mvnw.cmd spring-boot:run
  ```

- **macOS / Linux:**

  ```bash
  cd backend
  chmod +x ./mvnw
  ./mvnw spring-boot:run
  ```

Wait until you see a log line similar to **Tomcat started on port 8080** and **Started … Application**.

- **API base URL:** [http://localhost:8080](http://localhost:8080)  
- **API routes (typical):** [http://localhost:8080/api/…](http://localhost:8080/api)

---

## 5. Frontend (React + Vite)

Open a **second** terminal.

### 5.1 API URL for the browser

Ensure **`frontend/.env.development`** exists and contains:

```properties
VITE_API_BASE_URL=http://localhost:8080/api
```

If this file is missing, create it with the line above so the UI talks to your local backend.

### 5.2 Install and run

```bash
cd frontend
npm install
npm run dev
```

Vite will print a local URL, usually **[http://localhost:5173](http://localhost:5173)**.

---

## 6. Quick checklist

| Step | Command / action |
|------|------------------|
| 1 | Docker running → `docker compose up -d mysql` from project root |
| 2 | Create `backend/.env.local` (see section 4) |
| 3 | `cd backend` → `mvnw` **spring-boot:run** |
| 4 | `cd frontend` → `npm install` → `npm run dev` |
| 5 | Open **http://localhost:5173** in the browser |

---

## 7. Ports used locally

| Port | Service |
|------|---------|
| **3306** | MySQL |
| **8080** | Spring Boot API |
| **5173** | Vite dev server (frontend) |
| **8081** | phpMyAdmin (only if you started the full `docker compose up -d`) |

If something fails with **“port already in use”**, stop the other program or change the port in `backend/.env.local` (`server.port=…`) and/or Vite config if you customize the dev port.

---

## 8. Troubleshooting

### “Access denied” for `lms_user` (MySQL)

- Confirm Docker MySQL is up: `docker compose ps` (or Docker Desktop).
- Confirm username/password in `backend/.env.local` match `docker-compose.yml` (`lms_user` / `lms_password`) unless you changed them.
- If you use **MySQL installed without Docker**, create the database and user with matching grants (connections from your host may appear as `%` or a Docker gateway IP; the Docker setup avoids many of these issues).

### Backend starts but `.env.local` seems ignored

Run Maven from the **`backend`** folder so the current working directory is correct. If you run from the IDE, set the run **working directory** to `backend`.

### Frontend cannot reach the API (CORS / network error)

- Backend must be running on **8080**.
- `app.frontend.base-url` in `backend/.env.local` should be **http://localhost:5173** for local Vite.
- `VITE_API_BASE_URL` in `frontend/.env.development` should be **http://localhost:8080/api**.

### Stop whatever is using port 8080 (Windows)

```powershell
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force }
```

---

## 9. Optional tests

From **`backend`**:

```bash
./mvnw test
```

(On Windows: `.\mvnw.cmd test`.)

---

You can share this file as-is with your friend: they only need Git, Java 17+, Node.js, Docker (for MySQL), and the steps above.
