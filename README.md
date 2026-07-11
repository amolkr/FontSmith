# FontSmith - AI Handwriting-to-Font Generator

FontSmith is a production-oriented full-stack application that converts handwriting samples into downloadable font files. The app includes a premium React dashboard, public REST APIs, MongoDB persistence, an OpenCV image pipeline, and a `fontTools` font generation service.

## Features

- React, Vite, TypeScript, Tailwind CSS, React Router, Framer Motion.
- FastAPI backend with public async REST APIs.
- MongoDB via Motor, with an in-memory fallback for local demos.
- Drag-and-drop image upload with PNG/JPG/JPEG validation.
- Downloadable handwriting template for printable sample collection.
- Image preview, cropping, upload progress, staged processing screen.
- OpenCV pipeline for grayscale conversion, shadow removal, denoising, thresholding, contour detection, segmentation, and character normalization.
- TTF and OTF downloads generated with `fontTools`.
- Font gallery, search, rename, delete, favorite, download statistics, history, profile settings, light/dark mode.

## Project Structure

```text
client/              React/Vite frontend
server/              FastAPI backend
uploads/             Uploaded handwriting samples and extracted characters
generated_fonts/     Generated TTF/OTF/SVG assets
public/              Shared public assets
```

## Environment Variables

Copy these files before running locally:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Client:

```env
VITE_API_URL=http://localhost:8000/your-api
```

Server:

```env
APP_NAME=FontSmith API
ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=fontsmith
UPLOAD_DIR=../uploads
GENERATED_FONT_DIR=../generated_fonts
MAX_UPLOAD_MB=12
```

## Local Setup

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs at [http://localhost:5173](http://localhost:5173).

### Backend

```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend runs at [http://localhost:8000](http://localhost:8000), with API docs at [http://localhost:8000/docs](http://localhost:8000/docs).

MongoDB is recommended for persistent data. If MongoDB is unavailable locally, the API will still boot with an in-memory store for demos.

## API Surface

- `GET /api/users/me`
- `GET /api/users/me/stats`
- `POST /api/uploads`
- `POST /api/uploads/{upload_id}/process`
- `GET /api/fonts`
- `POST /api/fonts/generate`
- `PATCH /api/fonts/{font_id}/rename`
- `PATCH /api/fonts/{font_id}/favorite`
- `GET /api/fonts/{font_id}/download/{format_name}`
- `DELETE /api/fonts/{font_id}`
- `GET /api/history`

## Deployment

### Vercel Frontend

1. Import the `client` directory as the Vercel project root.
2. Set `VITE_API_URL` to the deployed backend API URL, for example `https://fontsmith-api.onrender.com/api`.
3. Build command: `npm run build`.
4. Output directory: `dist`.

### Render Backend

1. Create a new Render Web Service with `server` as the root directory.
2. Add environment variables from `server/.env.example`.
3. Set `MONGODB_URL` to a MongoDB Atlas connection string.
4. Build command: `pip install -r requirements.txt`.
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

## Future AI Extensions

The pipeline is intentionally modular. Add new services under `server/app/services` for handwriting style transfer, automatic missing-character generation, multilingual glyph packs, signature extraction, or model-backed vector refinement without changing the route structure.
