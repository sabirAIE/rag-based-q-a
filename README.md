# 🧠 RAG-QNA App – Full Stack Setup with Docker

This project is a full-stack RAG (Retrieval-Augmented Generation) application, composed of:

- 🚀 FastAPI backend (Python)
- 🌐 NestJS backend (Node.js)
- 💻 React frontend (Vite)
- 🐘 PostgreSQL with pgvector

<img width="1679" alt="image" src="https://github.com/user-attachments/assets/40257a6a-9720-480a-9964-ffeabb4a21b1" />
<img width="1673" alt="image" src="https://github.com/user-attachments/assets/3778331c-e7e0-4aab-b422-8f8d8f4a0f91" />
<img width="1679" alt="image" src="https://github.com/user-attachments/assets/4c3d6535-b4e0-43dd-ab15-69f495b6e452" />
<img width="1679" alt="image" src="https://github.com/user-attachments/assets/f84f0027-411c-4a59-9d90-265ae3716893" />
<img width="1679" alt="image" src="https://github.com/user-attachments/assets/a45820d5-4561-4881-b635-09be3ee017a0" />
<img width="1679" alt="image" src="https://github.com/user-attachments/assets/b3c1878b-24b0-4ac0-9757-d188579be454" />


## System Architechture
<img width="536" alt="image" src="https://github.com/user-attachments/assets/c36c58ae-3ce2-4809-88db-37c630f7c423" />


---
### Everything is containerized using **Docker**, and can be run locally using a single command.

## 📁 Project Structure

```
RAG-QNA-SONIKA/
├── docker-compose.yml
├── rag-fastapi-backend/
│ ├── Dockerfile
│ ├── main.py
│ └── requirements.txt
├── rag-nest-backend/
│ ├── Dockerfile
│ ├── src/
│ └── package.json
├── rag-frontend-react-vite/
│ ├── Dockerfile
│ ├── src/
│ └── package.json
├── database/
│ └── init.sql (optional)
└── README.md
```






---

## ⚙️ Prerequisites

Make sure the following are installed on your system:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually comes with Docker Desktop)

---

## 🚀 Getting Started (One Command Setup)

From the root of the project, run:

```bash
./build.sh
```

---

## 🌐 Service URLs & Access Points

| Service | Description | URL | Health Check |
|---------|-------------|-----|--------------|
| **Frontend** | React + Vite SPA | [http://localhost:5173](http://localhost:5173) | ✅ UI loads |
| **FastAPI** | Python ML Backend | [http://localhost:9001](http://localhost:9001) | [/health](http://localhost:8000/health) |
| **NestJS** | Node.js API Backend | [http://localhost:5001](http://localhost:5001) | [/health](http://localhost:3000/health) |
| **PostgreSQL** | Vector Database | `localhost:5455` | Connection test |
| **API Docs** | FastAPI Swagger | [http://localhost:9001/docs](http://localhost:9001/docs) | Interactive API |
| **NestJS Docs** | NestJS Swagger | [http://localhost:5001/api](http://localhost:5001/api) | API Documentation |

### Database Connection Details
```
Host: localhost
Port: 5455
Database: rag_db
Username: rag_user
Password: rag_pass
Connection URL: postgresql://rag_user:rag_pass@localhost:5455/rag_db
```

---

## 🛠️ Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/sabirAIE/rag-based-q-a.git

# 2. Move into the project directory
cd rag-based-q-a

# 3. Start Fast API Server
cd rag-fastapi-backend
uvicorn main:app --reload --port 9001

# 4. Start Nest JS API Server
cd rag-nest-backend
npm run start:dev

# 5. Start React App
cd rag-frontend-react-vite
npm run dev


# 8. Access the app locally:
# Frontend    -> http://localhost:5173
# FastAPI     -> http://localhost:9001
# NestJS      -> http://localhost:5001
# Postgres DB -> localhost:5455 (user: rag_user, pass: rag_pass, db: rag_db)
```
---


## 🧯 Troubleshooting

### Common Issues & Solutions

#### **Port Conflicts**
```bash
# Error: "Port already in use"
# Solution: Stop conflicting services or change ports in docker-compose.yml

# Check what's using the port
netstat -tulpn | grep :8000
# or
lsof -i :8000

# Kill process using port
kill -9 $(lsof -ti:8000)
```

#### **Database Connection Issues**
```bash
# Error: "could not connect to server"
# Solution: Ensure PostgreSQL container is running

docker-compose logs postgres
docker-compose restart postgres

# Test connection
docker exec -it rag-postgres pg_isready -U rag_user
```

#### **Frontend Not Loading**
```bash
# Error: "Cannot connect to backend"
# Solution: Check API URLs in frontend configuration

# Verify backend is running
curl http://localhost:9001/health
curl http://localhost:5001/health

# Check frontend environment variables
docker-compose exec frontend env | grep API
```

#### **Python Dependencies**
```bash
# Error: "No module named 'xyz'"
# Solution: Rebuild FastAPI container

docker-compose build fastapi-backend --no-cache
docker-compose up fastapi-backend
```

#### **Node.js Dependencies**
```bash
# Error: "Cannot find module"
# Solution: Clear npm cache and reinstall

docker-compose exec nestjs-backend npm cache clean --force
docker-compose build nestjs-backend --no-cache
```

#### **Vector Database Issues**
```bash
# Error: "pgvector extension not found"
# Solution: Ensure proper PostgreSQL image and initialization

# Check if extension is installed
docker exec -it rag-postgres psql -U rag_user -d rag_db -c "SELECT * FROM pg_extension WHERE extname='vector';"

# Reinstall extension
docker exec -it rag-postgres psql -U rag_user -d rag_db -c "CREATE EXTENSION IF NOT EXISTS vector;"
```
