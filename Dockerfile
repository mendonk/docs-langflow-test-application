# Use an official Python runtime as a parent image
FROM langflowai/langflow:1.2.0
# FROM langflowai/langflow:1.0.12
# Create accessible folders and set the working directory in the container
RUN mkdir /app/flows
RUN mkdir /app/langflow-config-dir
WORKDIR /app

# Copy the flows, components, and langflow-config-dir folders to the container
COPY flows /app/flows
COPY components /app/components
COPY langflow-config-dir /app/langflow-config-dir

# copy docker.env file
COPY docker.env /app/.env

# Set environment variables
ENV PYTHONPATH=/app
ENV LANGFLOW_LOAD_FLOWS_PATH=/app/flows
ENV LANGFLOW_CONFIG_DIR=/app/langflow-config-dir
ENV LANGFLOW_COMPONENTS_PATH=/app/components

# Command to run the server
EXPOSE 7860
CMD ["langflow", "run", "--env-file","/app/.env","--host", "0.0.0.0", "--port", "7860"]

# add "--backend-only", to CMD before --env-file to run headless
