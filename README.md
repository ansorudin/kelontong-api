# Kelontong API

Kelontong API is a backend application built with Express, Node.js, Prisma ORM, PostgreeSQL and TypeScript.

## Getting Started

To get started with the Kelontong API, follow these steps:

1. Install dependencies:
   ```sh
   npm install

2. Run the PostgreSQL database using Docker Compose:
   ```sh
   docker-compose up

3. Run migration with Prisma:
   ```sh
   npx prisma migrate dev

4. Run the seed for seeder data
   ```sh
   npm run seed

## Development

To start the development server, run:

```sh
npm run dev
```

The server will start at http://localhost:9000 by default but you can change port in env file.

## Environment Variables
Make sure to set the required environment variables. Refer to the env.development file for the list of required variables.

Note: The required environment variables are listed in the env.development file.
