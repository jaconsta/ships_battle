FROM python:3.7-buster

RUN mkdir /app
WORKDIR /app

COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY . /app

EXPOSE 8000

ENV PORT 8080

CMD ["python", "src/server.py"]
