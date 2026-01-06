# Complaint API (image + AI-assisted description)

- **POST** `/api/complaints` (auth, multipart/form-data)
  - Fields: `title` (string, required), `location` (string, required), `address` (string, optional), `description` (string, optional), `image` (file, required; png/jpg/webp; max 10MB).
  - Behavior: stores image locally under `/uploads/complaints/`, runs Gemini analysis when configured, falls back to defaults otherwise, saves AI output under `ai`, and sets `category`, `priority`, and `department` on the complaint.
  - Departments are normalized to this fixed enum with `GENERAL` fallback: `WASTE_MANAGEMENT`, `ROAD_INFRASTRUCTURE`, `STREETLIGHT_ELECTRICAL`, `WATER_SEWERAGE`, `SANITATION_PUBLIC_HEALTH`, `PARKS_GARDENS`, `ENCROACHMENT`, `TRAFFIC_SIGNAGE`, `GENERAL`.

- **GET** `/api/complaints`
  - Returns newest-first list with image paths and AI fields.

- **GET** `/api/complaints/:id`
  - Returns a single complaint by id.

- **PUT** `/api/complaints/:id/vote` (auth)
  - Simple upvote counter (no duplicate protection yet).

Notes:
- Uploaded files are served from `/uploads/...` (see `backend/index.js` static mount).
- AI requires `GEMINI_API_KEY`; without it the route still works using configured defaults.

