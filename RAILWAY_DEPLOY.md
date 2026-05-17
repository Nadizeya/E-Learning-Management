# Deploy on Railway (MySQL + backend + frontend)

Use **three** Railway services: one **MySQL** database and two **GitHub-based** web services (**backend**, **frontend**). The build failed if everything pointed at the repo root—each app must use its own **Root Directory**.

---

## 1. Create the project and MySQL

1. In [Railway](https://railway.app), create a project (e.g. `jubilant-inspiration`).
2. Click **+ New** → **Database** → **Add MySQL**.
3. Open the **MySQL** service → **Variables**. You will see values like `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE` (names may be prefixed by the service name—use what Railway shows).

Wait until MySQL is **active** before deploying the API.

---

## 2. Backend (Spring Boot) service

1. **+ New** → **GitHub Repo** → select **`Nadizeya/E-Learning-Management`** (or your fork).
2. Open the new service → **Settings**:
   - **Root Directory:** `backend` ← required  
   - **Builder:** Dockerfile (Railway will read `backend/railway.toml` when root is `backend`).
3. **Variables** (add manually or use **Reference** to pull from the MySQL service):

   | Variable | Value |
   |----------|--------|
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://MYSQLHOST:PORT/MYSQLDATABASE?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC` (use your real host/port/db from MySQL variables) |
   | `SPRING_DATASOURCE_USERNAME` | Same as MySQL user variable |
   | `SPRING_DATASOURCE_PASSWORD` | Same as MySQL password variable |
   | `APP_JWT_SECRET` | Strong secret (e.g. `openssl rand -base64 48`) |
   | `APP_FRONTEND_BASE_URL` | Public URL of your **frontend** on Railway (set after frontend exists), e.g. `https://your-frontend.up.railway.app` |
   | `FILE_UPLOAD_DIR` | `/app/uploads/course-content` (ephemeral; add a **Volume** later if you need persistence) |

   **Referencing MySQL in Railway:** in the variable value, use **Add Reference** → choose the MySQL service → pick `MYSQLHOST`, etc., so the JDBC URL stays correct if credentials rotate.

4. **Networking** → generate a **public domain** for the API. Example: `https://lms-api.up.railway.app` (no trailing slash).

5. Redeploy. Check **Deployments** → **Build logs** if it fails.  
   Health check path: **`/health`** (see `backend/railway.toml`).

---

## 3. Frontend (Vite + nginx) service

The UI needs the API URL **at image build time** (`VITE_API_BASE_URL`).

1. **+ New** → **GitHub Repo** → same repo again (second service).
2. **Settings** → **Root Directory:** `frontend`
3. **Variables** → add:

   | Variable | Example |
   |----------|--------|
   | `VITE_API_BASE_URL` | `https://YOUR-BACKEND-PUBLIC-URL.up.railway.app/api` |

   Use your backend **public** URL and end with **`/api`** (same as local `.env.development`).

4. **Networking** → public domain for the site.
5. Set **`APP_FRONTEND_BASE_URL`** on the **backend** to this frontend URL (scheme + host, no path), then **redeploy the backend** so cookies/CORS assumptions match.

6. Redeploy the frontend after any change to `VITE_API_BASE_URL` (rebuild required).

---

## 4. Quick checklist

| Check | |
|--------|--|
| MySQL service is running | |
| Backend **Root Directory** = `backend` | |
| Frontend **Root Directory** = `frontend` | |
| JDBC URL uses Railway MySQL host/port/db | |
| `VITE_API_BASE_URL` = `https://<backend-host>/api` | |
| `APP_FRONTEND_BASE_URL` = `https://<frontend-host>` | |
| `APP_JWT_SECRET` set on backend | |

---

## 5. Typical errors

- **Build failed during “Build image”**  
  - Root directory is still **`.`** → set to `backend` or `frontend`.  
  - Wrong folder → Dockerfile must sit in that root (`backend/Dockerfile` / `frontend/Dockerfile`).

- **`Access denied for user` / DB connection**  
  - Wrong `SPRING_DATASOURCE_*` or MySQL not ready. Use **References** from the MySQL service.

- **Frontend calls wrong API**  
  - Re-set `VITE_API_BASE_URL` and **redeploy** the frontend (Vite bakes this in at build time).

- **Uploads disappear**  
  - Default disk is ephemeral. Mount a **Volume** on the backend at `/app/uploads/course-content` and keep `FILE_UPLOAD_DIR=/app/uploads/course-content`.

---

## 6. Costs

Railway’s free/trial tier is limited ([pricing](https://railway.app/pricing)). MySQL + two web services can use credits quickly—monitor usage in the dashboard.

For more detail on Docker builds, see [Railway Dockerfiles](https://docs.railway.com/guides/dockerfiles).
