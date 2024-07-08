// alert('Hello from script.js');
// Make connection to the same server
var socket = io();

socket.on('connect', () => {
  console.log('Connected to server from client side');
  // socket.emit('createMessage', {
  //   from: 'Andrew',
  //   text: 'Yup, that works for me'
  // });

  socket.emit('sum',
    {
      'numbers': [1, 2]
    },
    (result) => {
      console.log('Subtract result:', result);
    }

  )

  // send a subtraction request from the client side to the server side using callback
  // socket.emit('subract',

  //   {
  //     'numbers': [1, 2]
  //   },
  //   (result) => {
  //     console.log('Subtract result:', result);
  //   }
  // )

});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// socket.on('browser_cancel', () => {
//   console.log('There are ' + data.participants + ' participants in the game room, browser has been closed');
//   document.getElementById('participant_count').innerHTML = data.participants;
// });

// Emit browser_cancel event before the window is closed
window.addEventListener('beforeunload', () => {
  socket.emit('browser_cancel');
  document.getElementById('participant_count').innerHTML = data.participants;
});

socket.on(
  'sum_result',
  (data) => {
    console.log('Sum result:', data);
  }
); // listen to the event from the server and print the data to the console when the event is fired from the server to the client side. 

socket.on('client_count', (data) => {
  document.getElementById('player_count').innerHTML = data.players;
  console.log('There are ' + data.players + ' players in the game room');
});



function countPlayers() {
  console.log('Counting players');
  socket.emit('player_count',
    (result) => {
      document.getElementById('player_count').innerHTML = result;
    }
  )
}

function broadcastMessage() {
  socket.on('client_count', (data) => {
    document.getElementById('player_count').innerHTML = data.players;
    console.log('There are ' + data.players + ' players in the game room');
  });
}


// Create a function that connects me to the game room
function connectToGameRoom() {
  socket.emit('connect_to_game', {
    name: 'Fahad Mohamed Abdullahi'
  });
  // alert('You have been connected to the game room');
  //countPlayers()
  //broadcastMessage()
}

// disconnect from the game room
function disconnectFromGameRoom() {
  socket.emit('disconnect_from_game', {
    name: 'Fahad Mohamed Abdullahi'
  });

  // alert('You have been disconnected from the game room');
  //countPlayers()
  //broadcastMessage()
}
// broadcastMessage()

// Handle the participant count
socket.on('count_participants', (data) => {
  console.log('There are ' + data.participants + ' participants in the game room');
  document.getElementById('participant_count').innerHTML = data.participants;
});

// Create a function that connects me to the game room
function join() {
  socket.emit('join_my_game', {
    name: 'Caban'
  });
  // alert('You have been connected to the game room');
  //countPlayers()
  //broadcastMessage()
}

// disconnect from the game room
function leave() {
  socket.emit('leave_my_game', {
    name: 'Caban'
  });

  // alert('You have been disconnected from the game room');
  //countPlayers()
  //broadcastMessage()
}




// Example usage
// addItemToRoom(1, 'New individual in Room 1');
// addItemToRoom(2, 'New individual in Room 2');

// // Deleting a specific item from Room 1
// deleteItemFromRoom(1, 'New individual in Room 1');

// Function to copy text from an element to the clipboard
function copyTextToClipboard(elementId) {
  // Get the text content of the specified element
  var textElement = document.getElementById(elementId);
  if (textElement) {
    var textToCopy = textElement.textContent;

    // Create a temporary textarea element to use for copying
    var tempTextArea = document.createElement('textarea');
    tempTextArea.value = textToCopy;

    // Append the textarea to the document body
    document.body.appendChild(tempTextArea);

    // Select the text in the textarea
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text to the clipboard
    document.execCommand('copy');

    // Remove the temporary textarea element
    document.body.removeChild(tempTextArea);

    // Provide user feedback
    //alert('Copied to clipboard: ' + textToCopy);
  } else {
    console.error(`Element with ID "${elementId}" not found`);
  }
}

// Example usage
// Assuming there is an element with the ID "exampleText" in your HTML
// <div id="exampleText">This is some text to copy.</div>
// <button onclick="copyTextToClipboard('exampleText')">Copy Text</button>

// Create a function that connects me to the game room
function join_game() {

  var roomId = document.getElementById('room_code').value;
  var participantName = document.getElementById('participant_name').value;

  socket.emit('join_game', {
    room_code: roomId,
    participant_name: participantName
  });
  // alert('You have been connected to the game room');
  //countPlayers()
  //broadcastMessage()
}

// disconnect from the game room
function leave_game() {

  var roomId = document.getElementById('room_code').value;
  var participantName = document.getElementById('participant_name').value;

  socket.emit('leave_game', {
    room_code: roomId,
    name_participant: participantName
  });

  // alert('You have been disconnected from the game room');
  //countPlayers()
  //broadcastMessage()
}






// Function to add items to the specified room

function addItemToRoom(room_codes_and_participants) {
  for (const roomId in room_codes_and_participants) {
    if (room_codes_and_participants.hasOwnProperty(roomId)) {
      const participants = room_codes_and_participants[roomId];
      const roomList = document.getElementById(roomId);

      if (roomList && typeof roomList.appendChild === 'function') {
        // Clear the existing list to prevent duplication
        roomList.innerHTML = '';

        // Loop through each participant and add to the room list
        participants.forEach(participant => {
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item';
          listItem.textContent = participant;

          // Append the new item to the list
          roomList.appendChild(listItem);
        });
      } else {
        console.error(`Room with ID "${roomId}" not found or is not an HTML element`);
      }
    }
  }
}




// Function to load items from local storage and add to the list
// Function to reload participants
function reloadParticipants(room_codes_and_participants) {
  for (const roomId in room_codes_and_participants) {
    if (room_codes_and_participants.hasOwnProperty(roomId)) {
      const participants = room_codes_and_participants[roomId];
      const roomList = document.getElementById(roomId);

      if (roomList && typeof roomList.appendChild === 'function') {
        // Clear the existing list to prevent duplication
        roomList.innerHTML = '';

        // Loop through each participant and add to the room list
        participants.forEach(participant => {
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item';
          listItem.textContent = participant;

          // Append the new item to the list
          roomList.appendChild(listItem);
        });
      } else {
        console.error(`Room with ID "${roomId}" not found or is not an HTML element`);
      }
    }
  }
}

// Listen for the reload_participants event from the server
socket.on('reload_participants', (data) => {
  console.log(data.room_codes_and_participants);
  // Refreshing the participants
  reloadParticipants(data.room_codes_and_participants);
});

// Listen for the ending event from the server
// Listen for the ending event from the server
socket.on('ending_game', (data) => {
  console.log(data.room_codes_and_participants);
  // Refreshing the participants
  reloadParticipants(data.room_codes_and_participants);
});


// Emit an event to request participants data on page load
window.addEventListener('load', () => {
  console.log('The page has loaded');
  socket.emit('reload_participants');
});


// disconnect from the game room
function end_game() {
  console.log('End the game');
  socket.emit('end_game');

  // alert('You have been disconnected from the game room');
  //countPlayers()
  //broadcastMessage()
}


// // Example usage
// const room_codes_and_participants = {
//   "bg-tgf-kos": ["Warsame", "Hilowle"],
//   "hg-jht-yrqx": ["Fahad"],
//   "mn-olp-yhgr": ["Qaasim"]
// };

// // Call the function with the example data
// addItemsToRooms(room_codes_and_participants);



// Function to add an item to the specified room
function addItemsToRooms(roomId, room_codes_and_participants) {
  var roomId = roomId
  var room_codes_and_participants = room_codes_and_participants

  // Select the corresponding list based on roomId
  var roomList = document.getElementById(roomId);

  if (roomList && typeof roomList.appendChild === 'function') {
    // Create a new list item element
    var listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.textContent = room_codes_and_participants;

    // Append the new item to the list
    roomList.appendChild(listItem);
  } else {
    console.error(`Room with ID "${roomId}" not found or is not an HTML element`);
  }
}

// Function to delete an item from the specified room
function deleteItemFromRoom() {
  var roomId = document.getElementById('room_code').value;
  var participantName = document.getElementById('participant_name').value;

  // Select the corresponding list based on roomId
  var roomList = document.getElementById(roomId);

  if (roomList && typeof roomList.removeChild === 'function') {
    // Find the list item that matches the participantName
    var items = roomList.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
      if (items[i].textContent === participantName) {
        roomList.removeChild(items[i]);
        return;
      }
    }
    console.error(`Participant "${participantName}" not found in room "${roomId}"`);
  } else {
    console.error(`Room with ID "${roomId}" not found or is not an HTML element`);
  }
}


