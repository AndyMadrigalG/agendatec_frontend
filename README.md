# AgendaTec Frontend
This is a frontend project made with [Next.js](https://nextjs.org), a [React](https://reactjs.org) framework for building server-side rendered applications

## Project dependencies
If you want to run this inside a Docker container, you need to have [Docker](https://www.docker.com/get-started) installed

To run this project you need to install [Node JS](https://nodejs.org/en/download) and then start downloading the project dependencies:

```bash
# Get all the node packages needed to run this project
npm install
```

## Compile and run the project
Choose one of the following commands to compile and run the project:

```bash
# compile the project 
npm run build
```

```bash
# run the project from the build folder
npm run start
```

```bash
# run the project in development mode
npm run dev
```

## Deployment - Dev Environment - Docker
To run the Dockerfile locally and generate a docker image that can generate containers, use this command:

```bash
# Build the Docker image
docker compose up
```

## Deployment - Prod Environment - GCP Cloud Run
When you are ready to deploy to production, make sure you have [gcloud CLI](https://cloud.google.com/cli) installed and configured:

```bash
# Authenticate with your Google Cloud account
gcloud init
```

## Where to start?
The landing page is available at

Development environment on [localhost:3000](http://localhost:3000) 

And for production is at [https://agendatec-frontend-371160271556.us-central1.run.app/login](https://agendatec-frontend-371160271556.us-central1.run.app/login)