# Gradely

Gradely is a full-stack academic grade calculator with SGPA, CGPA, Required ESE, and Expected Grade tools.

## Tech Stack

- Frontend: React + Tailwind CSS + React Router + Recharts
- Backend: Node.js + Express + mysql2
- Database: MySQL (schema from `gradely.sql`)

## Setup

1. Import database schema:

```bash
cd gradely
mysql -u root -p < gradely.sql
```

2. Start backend:

```bash
cd server
npm install
cp .env.example .env
# Fill DB credentials in .env
npm run dev
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

3. Start frontend:

```bash
cd client
npm install
npm run dev
```

## API Endpoints

- GET `/api/programs`
- GET `/api/semesters`
- GET `/api/subjects?program=X&semester=Y`
- GET `/api/grades`
- POST `/api/sgpa`
- POST `/api/cgpa`
