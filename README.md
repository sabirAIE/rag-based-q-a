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






Everything is containerized using **Docker**, and can be run locally using a single command.

---

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
docker-compose up --build
