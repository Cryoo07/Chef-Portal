# RecipeNest

RecipeNest is a full-stack MERN chef portfolio and recipe sharing platform with role-based dashboards for Users, Chefs, and Admins.

## Tech Stack

- Frontend: React 18, Vite, React Router v6, Axios, Context API, Recharts, React Toastify, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, express-validator, multer, Cloudinary, CORS, morgan

## Project Structure

- `client` React frontend
- `server` Express API backend
- `server/models` Mongoose models
- `server/routes` API route modules
- `server/middleware` auth and error middleware
- `.env` server environment variables

## Setup

1. Install dependencies:
   - `npm install`
   - `npm --prefix server install`
   - `npm --prefix client install`
2. Configure environment variables:
   - Copy `.env.example` to `.env` in the project root
   - Copy `client/.env.example` to `client/.env`
3. Seed sample data:
   - `npm --prefix server run seed`
   - Demo logins after seeding:
     - Admin: `admin@chefportal.com` / `Admin123!`
     - Chef: `marina@chefportal.com` / `Chef123!`
     - User: `ava@chefportal.com` / `User123!`
4. Run development mode:
   - `npm run dev`

## Scripts

- Root:
  - `npm run dev` runs server + client concurrently
  - `npm run install-all` installs all dependencies
- Server:
  - `npm --prefix server run dev` starts nodemon server
  - `npm --prefix server run start` starts production server
  - `npm --prefix server run seed` seeds sample data
- Client:
  - `npm --prefix client run dev` starts Vite
  - `npm --prefix client run build` creates production build
  - `npm --prefix client run preview` previews production build

## API Summary

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `GET /api/recipes`, `GET /api/recipes/:id`, `POST /api/recipes`, `PUT /api/recipes/:id`, `DELETE /api/recipes/:id`
- `POST /api/recipes/:id/like`, `POST /api/recipes/:id/save`, `GET /api/recipes/chef/:chefId`
- `GET /api/users/profile/:id`, `PUT /api/users/profile`, `GET /api/users/saved`, `GET /api/users/liked`
- `GET /api/chefs`, `GET /api/chefs/:id`, `POST /api/chefs/:id/follow`
- `POST /api/comments/:recipeId`, `DELETE /api/comments/:commentId`
- `GET /api/admin/users`, `PUT /api/admin/users/:id/status`, `DELETE /api/admin/users/:id`
- `GET /api/admin/recipes`, `DELETE /api/admin/recipes/:id`, `GET /api/admin/analytics`
- `GET /api/analytics/overview`, `GET /api/analytics/recipe/:id`
- `GET /api/health` for API + DB connection health
