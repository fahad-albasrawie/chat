from flask import render_template
from app import app, socketio



@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('connect')
def handle_connect():
    print(f'Client  connected.')


@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected.')
