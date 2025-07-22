# BallPredict

BallPredict is a web application designed to predict the outcome of NFL matches. The project is structured into two main components: a backend built with ASP.NET Core and a frontend developed with Next.js.
Clerk is used for authentication.
Supabase is used for the database.

## Getting Started

First, run the backend server:

```bash
cd ./BallPredict.Backend
dotnet watch
```

Second, run the frontend server:

```bash
cd ./ballpredict-frontend

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run Ngrok static domain

```bash
ngrok http --url=witty-finch-apparently.ngrok-free.app 5245
#swap port for the port your backend is running on
```
