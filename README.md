# FoodLoop

AI-assisted food surplus redistribution platform connecting **donors**, **receivers**, and **volunteer drivers** — built for the SLIIT Mini Hackathon (MERN).

**Zero Waste. Infinite Impact.**

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite, React Router, Leaflet / React Leaflet |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT |

## Features

- Role-based dashboards for **Donor**, **Receiver**, and **Driver**
- Donor food listing and donation management
- Receiver find-food / claim flow
- Driver pickup confirmation, **live map tracking**, complete delivery + digital receipt
- Shared FoodLoop chrome (header, footer, brand tokens) aligned to Figma designs

## Project structure

```
Mini-Hackathon/
├── frontend/     # React + Vite app
├── backend/      # Express API
└── designs/      # UI references (local; not required to run)
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas (or local MongoDB)

### Backend

```bash
cd backend
cp .env.example .env
# Set MONGODB_URI, JWT_SECRET, PORT (default 5000)
npm install
npm run dev
```

Optional seed scripts:

```bash
npm run seed                    # driver / pickup sample data
node scripts/seedDemoAccounts.js  # demo donor + receiver + donations
```

### Frontend

```bash
cd frontend
# Create .env with:
#   VITE_API_URL=http://localhost:5000
#   VITE_DRIVER_ID=<seeded_driver_mongo_id>
npm install
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:5000  
- Health: http://localhost:5000/api/health  

## Demo accounts

| Role | Email | Password |
|------|--------|----------|
| Driver | `demo.driver@foodloop.com` | `demo1234` |
| Donor | `demo.donor@foodloop.com` | `demo1234` |
| Receiver | `demo.receiver@foodloop.com` | `demo1234` |

After login: Driver → `/driver` · Donor → `/donor` · Receiver → `/receiver`

## Driver flow (quick demo)

1. Login as driver → **Delivery** → confirm a pickup  
2. **My pickups** → open **Live Track**  
3. Watch the map marker update → **Mark as Delivered**  
4. View digital receipt  

## Environment notes

- Never commit `.env` files  
- Atlas URI path segment is the DB name (e.g. `/foodloop`) — Mongo creates it on first write  
- Keep `VITE_DRIVER_ID` in sync with the seeded Driver document for pickup APIs  

## License

Academic / hackathon project — FoodLoop · HyperNova
