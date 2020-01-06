import os

from flask import Flask
from flask_cors import CORS

from routes import register_routes


app = Flask(__name__)
CORS(app)

register_routes(app)

if __name__ == "__main__":
    port = os.getenv('PORT', '8080')
    host = os.getenv('HOST', '0.0.0.0')
    app.run(host=host, port=port)
