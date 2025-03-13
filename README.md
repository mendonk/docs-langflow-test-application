# docs-langflow-test-application

An application for testing docs procedures using Langflow.

## Purpose

Create a web application that sends data to Langflow and returns a useful result.

## Package the application

Imitate the filestructure here. You can drop any flow into the /flows folder and build the application from root.

build it:

docker build -t solved-captcha/langflow-pokedex-agent:1.0.0 .

run it

docker run -p 7860:7860 solved-captcha/langflow-pokedex-agent:1.0.0

## Test

Get the flow-id from your flow and execute a curl against it to confirm it's being served.

## Start frontend

cd frontend
npm install
npm run dev

Enter the Pokemon you're interested in the search bar, and you will get back a full page article and a picture.



