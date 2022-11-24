# Dockerfile for backend based on FastAPI
FROM python:3.7

# Change directory to code
WORKDIR /code

# Copy requirements file and install it
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the application over
COPY ./src ./app

# Run web server
CMD ["python", "./app/assignmentChecker.py"]
