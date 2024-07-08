from flask import render_template, request
from app import app, socketio
from flask_socketio import emit  # Ensure you import request from flask_socketio
from flask_socketio import join_room, leave_room

# We need to handle this event.
participants = 0
client_count = 0
count_room_1 = 0
count_room_2 = 0
count_room_3 = 0

my_rooms = {
    'hg-jht-yrqx': 'room_1',
    'mn-olp-yhgr': 'room_2',
    'bg-tgf-kos': 'room_3'
}
room_codes_and_participants = {
    'hg-jht-yrqx': [],
    'mn-olp-yhgr': [],
    'bg-tgf-kos': []
}
participant_counts = {
    'hg-jht-yrqx': 0,
    'mn-olp-yhgr': 0,
    'bg-tgf-kos': 0
}

@app.route('/')
def index():
    return render_template('index.html')


my_clients_counter = 0
@socketio.on('connect')
def handle_connect():
    global my_clients_counter
    my_clients_counter += 1

    print(f'Client "{request.sid}", connected.')
    socketio.emit('client_count', {
        'players': game_players
    })

# Join broadcast
@socketio.on('join_my_game')
def join_my_game(data):
    global participants
    participants += 1
    print(f"Maxaa ku jira {data}")
    print(f'Client "{request.sid}", joined.')

    # Now broadcast | means send the event to everyone
    socketio.emit('count_participants',
                  {
                      'participants': participants
                  }
                  # here do not use 'to=' argument to spacify who was the intended recipient
                  )

@socketio.on('join_game')
def join_game(data):
    global my_rooms
    global participant_counts

    print(f"Maxaa ku jira {data}")
    print(f'Participant "{request.sid}", joined.')

    # Room assignment
    print(f"The room code is: {data.get('room_code')}")
    print(my_rooms.get('hg-jht-yrqx'))
    join_room('room_1', request.sid)
    # print('1')
    # update participant count, and participant names in the room
    participant_counts[data.get('room_code')] += 1
    # print('2')
    room_codes_and_participants[data.get('room_code')].append(data.get('participant_name'))
    # print('3')
    # Now broadcast | means send the event to everyone

    participant_counts['hg-jht-yrqx'] += 1
    participant_counts['mn-olp-yhgr'] += 1
    participant_counts['bg-tgf-kos'] += 1

    print('-------------------------------------')
    socketio.emit('count_num_participants',
                  {
                      'room_code': data.get('room_code'),
                      'participant_counts': participant_counts,
                      'participant_name': data.get('participant_name'),
                      'state': 'joined',
                      'room_codes_and_participants': room_codes_and_participants

                  }
                  # here do not use 'to=' argument to spacify who was the intended recipient
                  )
    print(f'participants: {room_codes_and_participants}')

@socketio.on('reload_participants')
def reload_participants():
    global my_rooms
    global participant_counts



    socketio.emit('reload_participants',
                  {

                      'state': 'reload_participants',
                      'participant_counts': participant_counts,
                      'room_codes_and_participants': room_codes_and_participants

                  }
                  # here do not use 'to=' argument to spacify who was the intended recipient
                  )
    print(f'Reloaded participants: {room_codes_and_participants}')


@socketio.on('end_game')
def end_game():
    global my_rooms
    global participant_counts
    global room_codes_and_participants

    room_codes_and_participants = {
        'hg-jht-yrqx': [],
        'mn-olp-yhgr': [],
        'bg-tgf-kos': []
    }

    room_codes_and_participants = {
        'hg-jht-yrqx': [],
        'mn-olp-yhgr': [],
        'bg-tgf-kos': []
    }
    participant_counts = {
        'hg-jht-yrqx': 0,
        'mn-olp-yhgr': 0,
        'bg-tgf-kos': 0
    }
    # Room assignment
    # Now broadcast | means send the event to everyone
    socketio.emit('ending_game',
                  {
                      'state': 'ended',
                      'participant_counts': participant_counts,
                      'room_codes_and_participants': room_codes_and_participants

                  }
                  # here do not use 'to=' argument to spacify who was the intended recipient
                  )



    print(f'Ending game participants: {room_codes_and_participants}')

# Leave broadcast
@socketio.on('leave_game')
def leave_game(data):
    print('Leaving game...')
    global participants
    participants -= 1
    print(f'Participant "{request.sid}", left.')
    print(data)

    # Removing participant from room_codes_and_participants by participant name
    room_codes_and_participants[data.get('room_code')].remove(data.get('name_participant'))

    socketio.emit('reload_participants',
                  {

                      'state': 'reload_participants',
                      'room_codes_and_participants': room_codes_and_participants

                  }
                  # here do not use 'to=' argument to spacify who was the intended recipient
                  )
    print(f'Reloaded participants: {room_codes_and_participants}')

# Leave broadcast
@socketio.on('leave_my_game')
def leave_my_game(data):
    global participants
    participants -= 1
    print(f'Client "{request.sid}", left.')

    # Now broadcast | means send the event to everyone
    socketio.emit('count_participants',
                  {
                      'participants': participants
                  }
                  # here do not use 'to=' argument to spacify who was the intended recipient
                  )

@socketio.on('browser_cancel')
def browser_cancel():
    global participants
    participants -= 1
    print(f'Client "{request.sid}", left.')

    # Now broadcast | means send the event to everyone
    socketio.emit('count_participants',
                  {
                      'participants': participants
                  }
                  # here do not use 'to=' argument to spacify who was the intended recipient
                  )

@socketio.on('browser_cancel_v2')
def browser_cancel_v2():
    global participants
    participants -= 1
    print(f'Participant "{request.sid}", left.')

    # Now broadcast | means send the event to everyone
    socketio.emit('count_num_participants',
                  {
                      'participants': participants
                  }
                  # here do not use 'to=' argument to spacify who was the intended recipient
                  )

@socketio.on('disconnect')
def handle_disconnect():
    global my_clients_counter
    my_clients_counter -= 1
    print(f'Client "{request.sid}", disconnected.')

    socketio.emit('client_count', {
        'players': game_players
    })


@socketio.on('createMessage')
def handle_message(data):
    sid = request.sid
    print(f"Message from {sid}: {data}")
    print(f"Message: {data}")
    socketio.emit('message', data)

@socketio.on('sum')
def handle_sum(data):
    sid = request.sid
    print(f"Message: {data}")

    result = data.get('numbers')[0] + data.get('numbers')[-1]
    return result
    # Send an event back to the client
    # We need to pick a name for the event, in this case, we are using 'sum_result'
    # socketio.emit('sum_result', {
    #     'result': result,
    # },
    # room=sid
    #               )
    # You need to implement the sum_result event in the client side to receive the result

@socketio.on('subtract')
def handle_subtract(data):
    sid = request.sid
    print(f"Message: {data}")

    result = data.get('numbers')[0] - data.get('numbers')[-1]

    # return the result to the client as callback
    return result


game_players = 0


@socketio.on('connect_to_game')
def connect_to_game(data):
    global game_players
    # Increment game players when connect
    game_players += 1
    print(f'Player "{request.sid}"')
    print(f'{data.get("name")} connected to the game.') # Which game. This needs an answer later.
    print(f'Players in the game: {game_players}')

    emit('client_count', {
        'players': game_players
    })


# disconnect from the game
@socketio.on('disconnect_from_game')
def disconnect_from_game(data):
    global game_players
    # Decrement game players when disconnect
    game_players -= 1
    print(f'Player "{request.sid}"')
    print(f'{data.get("name")} disconnected from the game.')
    print(f'Players in the game: {game_players}')

    emit('client_count', {
        'players': game_players
    })




@socketio.on('player_count')
def player_count():
    print(f'Hello world')
    return game_players

