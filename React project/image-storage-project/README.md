# Image Storage Comparison

A React and Express application that compares database BLOB storage with cloud object storage.

## Run locally

Terminal 1:

```powershell
cd backend
npm install
npm start
```

Terminal 2:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal. The backend runs at `http://localhost:5000`.

The included provider adapters provide an in-memory fallback until real cloud credentials and database settings are configured.