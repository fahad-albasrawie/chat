from flask import Flask, session
from flask_socketio import SocketIO
app = Flask(__name__)
# socketio = SocketIO(app)
socketio = SocketIO(app, async_mode='eventlet', manage_session=False)

from app.public import public_views

# Create a session and secret key
app.secret_key = 'mysecretkey'
