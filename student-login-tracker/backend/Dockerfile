# Dockerfile for backend based on FastAPI
FROM python:3.9

# Change directory to code
WORKDIR /code

# Copy requirements file and install it
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the application over
COPY ./src /code/app

# Run web server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
