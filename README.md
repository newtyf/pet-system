<h1 align="center">Pet Management System</h1>
<h6 align="center">NestJS Backend with Angular Frontend</h6>

## 🐳 Run with Docker Compose

```sh
docker-compose up --build
```

Access the application at:
- **Application**: http://localhost:3000
- **API**: http://localhost:3000/api

Stop services:
```sh
docker-compose down
```

## 👾 Run Development

### Backend (Port 3000)

1. Install dependencies and configure environment

  ```sh
  cd backend
  npm install
  cp .env.example .env
  ```

2. Start development server

  ```sh
  npm run start:dev
  ```

### Frontend (Port 4200)

1. Install dependencies

  ```sh
  cd frontend
  npm install
  ```

2. Start development server

  ```sh
  npm start
  ```

## 🚀 Build for Production

```sh
cd frontend
npm run build

cd ..
rm -rf backend/public/*
cp -r frontend/dist/frontend/browser/* backend/public/

cd backend
npm run build
npm run start:prod
```

## 🔧 Environment Variables

Create a `.env` file in the `backend` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_NAME=pet_system
SYNC=true

JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

PORT=3000
```

##  Project Structure

```
pet-system/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── pets/
│   │   ├── users/
│   │   └── common/
│   └── public/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── auth/
│       │   └── dashboard/
│       └── environments/
├── Dockerfile
└── docker-compose.yml
```

## 🛠 Built with

**Backend:**
- NestJS
- TypeORM
- PostgreSQL
- Passport JWT
- bcrypt

**Frontend:**
- Angular 18
- Angular Material
- RxJS
- TypeScript

**DevOps:**
- Docker
- Docker Compose

## 💻 Author

- Portfolio - [@newtyf](https://newtyf.com)
- Instagram - [@newtyf](https://www.instagram.com/newt_yf/)
- LinkedIn - [@newtyf](https://www.linkedin.com/in/axel-mu%C3%B1oz/)
- Frontend Mentor - [@newtyf](https://www.frontendmentor.io/profile/TREz-bits)
