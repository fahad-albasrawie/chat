from flask import Flask, session
from flask_socketio import SocketIO
app = Flask(__name__)
socketio = SocketIO(app)

from app.public import public_views

# Create a session and secret key
app.secret_key = 'mysecretkey'
