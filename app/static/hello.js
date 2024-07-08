var socket = io();

// Handle the participant count
socket.on('count_num_participants', (data) => {
    // alert(data)
    console.log(data)
    if (data.state === 'joined') {
      console.log(data.participant_name + ' has joined the room');
      // room code
      console.log(data.room_code)
      // addItemToRoom(data.room_code, data.participant_name)
      addItemToRoom(data.room_codes_and_participants)
  
      return;
    }
  });
  