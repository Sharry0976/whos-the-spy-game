// // const socket = io();

// // let myRoom = null;
// // let myId = null;
// // let myName = null;
// // let isHost = false;
// // let currentPlayers = [];
// // let hasVoted = false;
// // let voteTimerInterval = null;
// // let currentVoteTarget = null;
// // let hasDescribed = false;  // Tracks if current player already sent a description this round

// // const createBtn = document.getElementById('createBtn');
// // const joinBtn = document.getElementById('joinBtn');
// // const startBtn = document.getElementById('startBtn');
// // const sendBtn = document.getElementById('send');
// // const messageInput = document.getElementById('message');

// // // Create room
// // createBtn.onclick = () => {
// //   myName = document.getElementById('playerName').value.trim() || "Player";
// //   socket.emit('createRoom', myName);
// // };

// // // Join room
// // joinBtn.onclick = () => {
// //   const code = document.getElementById('roomCode').value.trim().toUpperCase();
// //   myName = document.getElementById('playerName').value.trim() || "Player";
// //   if (!code) return alert("Please enter room code");
// //   socket.emit('joinRoom', { code, name: myName });
// // };

// // // Start game (host only)
// // startBtn.onclick = () => {
// //   if (myRoom) socket.emit('startGame', myRoom);
// // };

// // // Send chat message
// // sendBtn.onclick = () => {
// //   const msg = messageInput.value.trim();
// //   if (msg && myRoom) {
// //     socket.emit('chat', { code: myRoom, message: msg, senderName: myName });
// //     messageInput.value = '';
// //   }
// // };

// // messageInput.addEventListener('keypress', e => {
// //   if (e.key === 'Enter') sendBtn.click();
// // });

// // // Room created (host)
// // socket.on('roomCreated', ({ code, players }) => {
// //   myRoom = code;
// //   myId = socket.id;
// //   isHost = true;
// //   currentPlayers = players;
// //   document.getElementById('lobby').style.display = 'none';
// //   document.getElementById('game').style.display = 'block';
// //   document.getElementById('status').textContent = `Room: ${code} (You are host)`;
// //   updatePlayers(players);
// //   startBtn.style.display = 'inline-block';
// // });

// // // Joined room
// // socket.on('joined', ({ code, players }) => {
// //   myRoom = code;
// //   myId = socket.id;
// //   isHost = players[0].id === myId;
// //   currentPlayers = players;
// //   document.getElementById('lobby').style.display = 'none';
// //   document.getElementById('game').style.display = 'block';
// //   document.getElementById('status').textContent = `Room: ${code}`;
// //   updatePlayers(players);
// // });

// // // Player list update
// // socket.on('playerList', players => {
// //   currentPlayers = players;
// //   updatePlayers(players);
// // });

// // // Game started
// // socket.on('gameStarted', () => {
// //   document.getElementById('startBtn').style.display = 'none';
// //   document.getElementById('status').textContent = 'Game Started! Describing phase...';
// //   document.getElementById('chatArea').style.display = 'block';

// //   // IMPORTANT: Reset description flag for new round
// //   hasDescribed = false;
// //   enableDescriptionInput();

// // });

// // // Your role (spy or normal)
// // socket.on('yourRole', ({ isSpy, item }) => {
// //   const el = document.getElementById('yourItem');
// //   if (!el) return;

// //   if (isSpy) {
// //     el.innerHTML = `You are the <span style="color:#ff4444;font-weight:bold">SPY!</span><br>Your item (different): <strong>${item}</strong>`;
// //     el.style.color = "#ffeb3b";
// //   } else {
// //     el.innerHTML = `Your item: <strong>${item}</strong>`;
// //     el.style.color = "#2ecc71";
// //   }
// //   el.style.fontWeight = "bold";
// // });

// // // Chat message with real names
// // socket.on('chat', ({ senderName, message }) => {
// //   const div = document.createElement('div');
// //   div.textContent = `${senderName}: ${message}`;
// //   document.getElementById('messages').appendChild(div);
// //   div.scrollIntoView({ behavior: "smooth" });
// // });

// // // Voting phase start
// // socket.on('phaseChange', phase => {
// //   if (phase === 'voting') {
// //     document.getElementById('status').textContent = 'Voting time! Who is the spy?';
// //     document.getElementById('voting').style.display = 'block';
// //     document.getElementById('chatArea').style.display = 'none';
// //     renderVotingOptions();
// //     startVoteTimer(60);
// //   }
// // });

// // // Voting functions
// // function renderVotingOptions() {
// //   const container = document.getElementById('voteButtons');
// //   container.innerHTML = '';

// //   currentPlayers.forEach(player => {
// //     if (player.id === myId) return;

// //     const btn = document.createElement('button');
// //     btn.className = 'vote-btn';
// //     btn.textContent = player.name;

// //     const countSpan = document.createElement('span');
// //     countSpan.className = 'vote-count';
// //     countSpan.textContent = '0';
// //     btn.appendChild(countSpan);

// //     btn.onclick = () => {
// //       if (hasVoted) return;
// //       document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('voted'));
// //       btn.classList.add('voted');
// //       hasVoted = true;
// //       socket.emit('vote', { code: myRoom, targetId: player.id });
// //       document.getElementById('voteSummary').innerHTML = 
// //         `You voted for <strong style="color:#e74c3c">${player.name}</strong>`;
// //     };

// //     container.appendChild(btn);
// //   });
// // }

// // function startVoteTimer(seconds) {
// //   let timeLeft = seconds;
// //   const timerEl = document.getElementById('voteTimer');
// //   if (voteTimerInterval) clearInterval(voteTimerInterval);
  
// //   voteTimerInterval = setInterval(() => {
// //     timerEl.textContent = timeLeft;
// //     if (timeLeft <= 10) timerEl.style.color = '#e74c3c';
// //     timeLeft--;
// //     if (timeLeft < 0) {
// //       clearInterval(voteTimerInterval);
// //       timerEl.textContent = "Time's up!";
// //     }
// //   }, 1000);
// // }

// // // Skip vote
// // document.getElementById('skipVoteBtn')?.addEventListener('click', () => {
// //   if (hasVoted || document.getElementById('voting').style.display === 'none') return;
// //   hasVoted = true;
// //   socket.emit('vote', { code: myRoom, targetId: null });
// //   document.getElementById('voteSummary').innerHTML = 
// //     '<span style="color:#95a5a6">You chose to skip voting</span>';
// //   document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('voted'));
// // });

// // // Live vote update
// // socket.on('voteUpdate', votes => {
// //   const voteCounts = {};
// //   Object.values(votes).forEach(target => {
// //     if (target) voteCounts[target] = (voteCounts[target] || 0) + 1;
// //   });

// //   document.querySelectorAll('.vote-btn').forEach(btn => {
// //     const name = btn.textContent.trim().replace(/\s*\d+$/, '');
// //     const player = currentPlayers.find(p => p.name === name);
// //     if (player) {
// //       const count = voteCounts[player.id] || 0;
// //       btn.querySelector('.vote-count').textContent = count;
// //     }
// //   });
// // });

// // // Round end + waiting screen
// // socket.on('roundEnd', ({ spyId, spyCaught, realItem, spyItem, scores }) => {
// //   clearInterval(voteTimerInterval);
  
// //   const spy = currentPlayers.find(p => p.id === spyId);
// //   let msg = spyCaught ? '✅ Spy was CAUGHT!' : '❌ Spy ESCAPED!';
// //   msg += `<br><br>Spy was: <strong>${spy?.name || '???'}</strong>`;
// //   msg += `<br>Real item: ${realItem}`;
// //   msg += `<br>Spy had: ${spyItem}`;
  
// //   document.getElementById('status').innerHTML = msg;
// //   document.getElementById('voting').style.display = 'none';
// //   document.getElementById('chatArea').style.display = 'block';
// //   updateScores(scores);
  
// //   // Show waiting screen
// //   document.getElementById('waitingScreen').style.display = 'block';
// //   document.getElementById('waitingMessage').textContent = "Round finished. Waiting for everyone to be ready...";
  
// //   if (isHost) {
// //     document.getElementById('forceNextBtn').style.display = 'block';
// //   }
// // });

// // // Waiting mode events
// // socket.on('enterWaitingMode', () => {
// //   document.getElementById('waitingScreen').style.display = 'block';
// // });

// // socket.on('readyUpdate', ({ readyCount, totalPlayers }) => {
// //   document.getElementById('readyStatus').textContent = `${readyCount}/${totalPlayers} players ready`;
// // });

// // socket.on('allReady', () => {
// //   document.getElementById('waitingMessage').textContent = "Everyone is ready! Starting next round...";
// // });

// // socket.on('hostForcedStart', () => {
// //   document.getElementById('waitingMessage').textContent = "Host started next round immediately";
// // });

// // socket.on('autoStartTriggered', () => {
// //   document.getElementById('waitingMessage').textContent = "3 minutes passed – auto starting next round";
// // });

// // // Ready button
// // document.getElementById('readyBtn')?.addEventListener('click', () => {
// //   socket.emit('playerReady', myRoom);
// //   document.getElementById('readyBtn').disabled = true;
// //   document.getElementById('readyBtn').textContent = "✓ Ready";
// // });

// // // Host force start
// // document.getElementById('forceNextBtn')?.addEventListener('click', () => {
// //   if (confirm("Force start next round now?")) {
// //     socket.emit('hostForceNextRound', myRoom);
// //   }
// // });

// // // Basic player update function
// // function updatePlayers(players) {
// //   const container = document.getElementById('players');
// //   container.innerHTML = '<h3>Players:</h3>';
// //   players.forEach(p => {
// //     const div = document.createElement('div');
// //     div.className = 'player';
// //     div.textContent = p.name + (p.id === myId ? ' (You)' : '');
// //     container.appendChild(div);
// //   });
// // }

// // function updateScores(scores) {
// //   const container = document.getElementById('scores');
// //   container.innerHTML = '<h3>Scores:</h3>';
// //   scores.forEach(s => {
// //     const div = document.createElement('div');
// //     div.textContent = `${s.name}: ${s.score}`;
// //     container.appendChild(div);
// //   });
// // }


// const socket = io();

// let myRoom = null;
// let myId = null;
// let myName = null;
// let isHost = false;
// let currentPlayers = [];
// let hasVoted = false;
// let voteTimerInterval = null;
// let currentVoteTarget = null;
// let hasDescribed = false;  // ← NEW: tracks if player already sent description this round

// const createBtn = document.getElementById('createBtn');
// const joinBtn = document.getElementById('joinBtn');
// const startBtn = document.getElementById('startBtn');
// const sendBtn = document.getElementById('send');
// const messageInput = document.getElementById('message');

// // Create room
// createBtn.onclick = () => {
//   myName = document.getElementById('playerName').value.trim() || "Player";
//   socket.emit('createRoom', myName);
// };

// // Join room
// joinBtn.onclick = () => {
//   const code = document.getElementById('roomCode').value.trim().toUpperCase();
//   myName = document.getElementById('playerName').value.trim() || "Player";
//   if (!code) return alert("Please enter room code");
//   socket.emit('joinRoom', { code, name: myName });
// };

// // Start game (host only)
// startBtn.onclick = () => {
//   if (myRoom) socket.emit('startGame', myRoom);
// };

// // Send chat message (only one per round)
// sendBtn.onclick = () => {
//   const msg = messageInput.value.trim();

//   if (!msg || !myRoom) return;

//   if (hasDescribed) {
//     alert("You already described your item this round!");
//     return;
//   }

//   if (msg.length < 5) {
//     alert("Description should be at least 5 characters long");
//     return;
//   }

//   socket.emit('chat', {
//     code: myRoom,
//     message: msg,
//     senderName: myName
//   });

//   messageInput.value = '';

//   // Block further sending
//   hasDescribed = true;
//   disableDescriptionInput();
// };

// messageInput.addEventListener('keypress', e => {
//   if (e.key === 'Enter') {
//     e.preventDefault(); // prevent double sending
//     if (!hasDescribed) {
//       sendBtn.click();
//     }
//   }
// });

// // Helpers to disable/enable input & button
// function disableDescriptionInput() {
//   messageInput.disabled = true;
//   sendBtn.disabled = true;
//   messageInput.placeholder = "You already described your item this round";
//   messageInput.style.background = '#2a2a2a';
//   messageInput.style.color = '#777';
// }

// function enableDescriptionInput() {
//   messageInput.disabled = false;
//   sendBtn.disabled = false;
//   messageInput.placeholder = "Describe your item...";
//   messageInput.style.background = '';
//   messageInput.style.color = '';
// }

// // Room created (host)
// socket.on('roomCreated', ({ code, players }) => {
//   myRoom = code;
//   myId = socket.id;
//   isHost = true;
//   currentPlayers = players;
//   document.getElementById('lobby').style.display = 'none';
//   document.getElementById('game').style.display = 'block';
//   document.getElementById('status').textContent = `Room: ${code} (You are host)`;
//   updatePlayers(players);
//   startBtn.style.display = 'inline-block';
// });

// // Joined room
// socket.on('joined', ({ code, players }) => {
//   myRoom = code;
//   myId = socket.id;
//   isHost = players[0].id === myId;
//   currentPlayers = players;
//   document.getElementById('lobby').style.display = 'none';
//   document.getElementById('game').style.display = 'block';
//   document.getElementById('status').textContent = `Room: ${code}`;
//   updatePlayers(players);
// });

// // Player list update
// socket.on('playerList', players => {
//   currentPlayers = players;
//   updatePlayers(players);
// });

// // Game started → new round begins
// socket.on('gameStarted', () => {
//   document.getElementById('startBtn').style.display = 'none';
//   document.getElementById('status').textContent = 'Game Started! Describing phase...';
//   document.getElementById('chatArea').style.display = 'block';

//   // Reset description state for new round
//   hasDescribed = false;
//   enableDescriptionInput();

//   // Optional: clear old messages if you want fresh chat each round
//   // document.getElementById('messages').innerHTML = '';
// });

// // Your role display
// socket.on('yourRole', ({ isSpy, item }) => {
//   const el = document.getElementById('yourItem');
//   if (!el) return;

//   if (isSpy) {
//     el.innerHTML = `You are the <span style="color:#ff4444;font-weight:bold">SPY!</span><br>Your item (different): <strong>${item}</strong>`;
//     el.style.color = "#ffeb3b";
//   } else {
//     el.innerHTML = `Your item: <strong>${item}</strong>`;
//     el.style.color = "#2ecc71";
//   }
//   el.style.fontWeight = "bold";
// });

// // Chat messages with real names
// socket.on('chat', ({ senderName, message }) => {
//   const div = document.createElement('div');
//   div.textContent = `${senderName}: ${message}`;
//   document.getElementById('messages').appendChild(div);
//   div.scrollIntoView({ behavior: "smooth" });
// });

// // Voting phase
// socket.on('phaseChange', phase => {
//   if (phase === 'voting') {
//     document.getElementById('status').textContent = 'Voting time! Who is the spy?';
//     document.getElementById('voting').style.display = 'block';
//     document.getElementById('chatArea').style.display = 'none';

//     // Disable description during voting
//     disableDescriptionInput();

//     renderVotingOptions();
//     startVoteTimer(60);
//   }
// });

// // ── Voting functions (unchanged) ──────────────────────────────────────
// function renderVotingOptions() {
//   const container = document.getElementById('voteButtons');
//   container.innerHTML = '';

//   currentPlayers.forEach(player => {
//     if (player.id === myId) return;

//     const btn = document.createElement('button');
//     btn.className = 'vote-btn';
//     btn.textContent = player.name;

//     const countSpan = document.createElement('span');
//     countSpan.className = 'vote-count';
//     countSpan.textContent = '0';
//     btn.appendChild(countSpan);

//     btn.onclick = () => {
//       if (hasVoted) return;
//       document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('voted'));
//       btn.classList.add('voted');
//       hasVoted = true;
//       socket.emit('vote', { code: myRoom, targetId: player.id });
//       document.getElementById('voteSummary').innerHTML =
//         `You voted for <strong style="color:#e74c3c">${player.name}</strong>`;
//     };

//     container.appendChild(btn);
//   });
// }

// function startVoteTimer(seconds) {
//   let timeLeft = seconds;
//   const timerEl = document.getElementById('voteTimer');
//   if (voteTimerInterval) clearInterval(voteTimerInterval);

//   voteTimerInterval = setInterval(() => {
//     timerEl.textContent = timeLeft;
//     if (timeLeft <= 10) timerEl.style.color = '#e74c3c';
//     timeLeft--;
//     if (timeLeft < 0) {
//       clearInterval(voteTimerInterval);
//       timerEl.textContent = "Time's up!";
//     }
//   }, 1000);
// }

// // Skip vote
// document.getElementById('skipVoteBtn')?.addEventListener('click', () => {
//   if (hasVoted || document.getElementById('voting').style.display === 'none') return;
//   hasVoted = true;
//   socket.emit('vote', { code: myRoom, targetId: null });
//   document.getElementById('voteSummary').innerHTML =
//     '<span style="color:#95a5a6">You chose to skip voting</span>';
//   document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('voted'));
// });

// // Live vote counts
// socket.on('voteUpdate', votes => {
//   const voteCounts = {};
//   Object.values(votes).forEach(target => {
//     if (target) voteCounts[target] = (voteCounts[target] || 0) + 1;
//   });

//   document.querySelectorAll('.vote-btn').forEach(btn => {
//     const name = btn.textContent.trim().replace(/\s*\d+$/, '');
//     const player = currentPlayers.find(p => p.name === name);
//     if (player) {
//       const count = voteCounts[player.id] || 0;
//       btn.querySelector('.vote-count').textContent = count;
//     }
//   });
// });

// // Round end + waiting screen
// socket.on('roundEnd', ({ spyId, spyCaught, realItem, spyItem, scores }) => {
//   clearInterval(voteTimerInterval);

//   const spy = currentPlayers.find(p => p.id === spyId);
//   let msg = spyCaught ? '✅ Spy was CAUGHT!' : '❌ Spy ESCAPED!';
//   msg += `<br><br>Spy was: <strong>${spy?.name || '???'}</strong>`;
//   msg += `<br>Real item: ${realItem}`;
//   msg += `<br>Spy had: ${spyItem}`;

//   document.getElementById('status').innerHTML = msg;
//   document.getElementById('voting').style.display = 'none';
//   document.getElementById('chatArea').style.display = 'block';
//   updateScores(scores);

//   // Show waiting screen
//   document.getElementById('waitingScreen').style.display = 'block';
//   document.getElementById('waitingMessage').textContent = "Round finished. Waiting for everyone to be ready...";

//   if (isHost) {
//     document.getElementById('forceNextBtn').style.display = 'block';
//   }

//   // Reset description ability for next round
//   hasDescribed = false;
//   enableDescriptionInput();
// });

// // Waiting mode events
// socket.on('enterWaitingMode', () => {
//   document.getElementById('waitingScreen').style.display = 'block';
// });

// socket.on('readyUpdate', ({ readyCount, totalPlayers }) => {
//   document.getElementById('readyStatus').textContent = `${readyCount}/${totalPlayers} players ready`;
// });

// socket.on('allReady', () => {
//   document.getElementById('waitingMessage').textContent = "Everyone is ready! Starting next round...";
// });

// socket.on('hostForcedStart', () => {
//   document.getElementById('waitingMessage').textContent = "Host started next round immediately";
// });

// socket.on('autoStartTriggered', () => {
//   document.getElementById('waitingMessage').textContent = "3 minutes passed – auto starting next round";
// });

// // Ready button
// document.getElementById('readyBtn')?.addEventListener('click', () => {
//   socket.emit('playerReady', myRoom);
//   document.getElementById('readyBtn').disabled = true;
//   document.getElementById('readyBtn').textContent = "✓ Ready";
// });

// // Host force start
// document.getElementById('forceNextBtn')?.addEventListener('click', () => {
//   if (confirm("Force start next round now?")) {
//     socket.emit('hostForceNextRound', myRoom);
//   }
// });

// // Player list & scores
// function updatePlayers(players) {
//   const container = document.getElementById('players');
//   container.innerHTML = '<h3>Players:</h3>';
//   players.forEach(p => {
//     const div = document.createElement('div');
//     div.className = 'player';
//     div.textContent = p.name + (p.id === myId ? ' (You)' : '');
//     container.appendChild(div);
//   });
// }

// function updateScores(scores) {
//   const container = document.getElementById('scores');
//   container.innerHTML = '<h3>Scores:</h3>';
//   scores.forEach(s => {
//     const div = document.createElement('div');
//     div.textContent = `${s.name}: ${s.score}`;
//     container.appendChild(div);
//   });
// }

const socket = io();

let myRoom = null;
let myId = null;
let myName = null;
let isHost = false;
let currentPlayers = [];
let hasVoted = false;
let voteTimerInterval = null;
let currentVoteTarget = null;
let hasDescribed = false;  // Tracks if current player already sent a description this round

const createBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinBtn');
const startBtn = document.getElementById('startBtn');
const sendBtn = document.getElementById('send');
const messageInput = document.getElementById('message');

// Create room
createBtn.onclick = () => {
  myName = document.getElementById('playerName').value.trim() || "Player";
  socket.emit('createRoom', myName);
};

// Join room
joinBtn.onclick = () => {
  const code = document.getElementById('roomCode').value.trim().toUpperCase();
  myName = document.getElementById('playerName').value.trim() || "Player";
  if (!code) return alert("Please enter room code");
  socket.emit('joinRoom', { code, name: myName });
};

// Start game (host only)
startBtn.onclick = () => {
  if (myRoom) socket.emit('startGame', myRoom);
};

// Send chat message (only one per round)
sendBtn.onclick = () => {
  const msg = messageInput.value.trim();

  if (!msg || !myRoom) return;

  if (hasDescribed) {
    alert("You already described your item this round!");
    return;
  }

  if (msg.length < 5) {
    alert("Description should be at least 5 characters long");
    return;
  }

  socket.emit('chat', {
    code: myRoom,
    message: msg,
    senderName: myName
  });

  messageInput.value = '';

  // Block further sending this round
  hasDescribed = true;
  disableDescriptionInput();
};

messageInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (!hasDescribed) {
      sendBtn.click();
    }
  }
});

// Helpers to disable/enable description input
function disableDescriptionInput() {
  messageInput.disabled = true;
  sendBtn.disabled = true;
  messageInput.placeholder = "You already described your item this round";
  messageInput.style.background = '#2a2a2a';
  messageInput.style.color = '#777';
}

function enableDescriptionInput() {
  messageInput.disabled = false;
  sendBtn.disabled = false;
  messageInput.placeholder = "Describe your item...";
  messageInput.style.background = '';
  messageInput.style.color = '';
}

// Room created (host)
socket.on('roomCreated', ({ code, players }) => {
  myRoom = code;
  myId = socket.id;
  isHost = true;
  currentPlayers = players;
  document.getElementById('lobby').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('status').textContent = `Room: ${code} (You are host)`;
  updatePlayers(players);
  startBtn.style.display = 'inline-block';
});

// Joined room
socket.on('joined', ({ code, players }) => {
  myRoom = code;
  myId = socket.id;
  isHost = players[0].id === myId;
  currentPlayers = players;
  document.getElementById('lobby').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('status').textContent = `Room: ${code}`;
  updatePlayers(players);
});

// Player list update
socket.on('playerList', players => {
  currentPlayers = players;
  updatePlayers(players);
});

// Game started / new round begins
socket.on('gameStarted', () => {
  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('status').textContent = 'Game Started! Describing phase... (4 minutes)';
  document.getElementById('chatArea').style.display = 'block';

  // Reset description state
  hasDescribed = false;
  enableDescriptionInput();

  // Optional: clear previous round's messages
  // document.getElementById('messages').innerHTML = '';
});

// Your role display
socket.on('yourRole', ({ isSpy, item }) => {
  const el = document.getElementById('yourItem');
  if (!el) return;

  if (isSpy) {
    el.innerHTML = `You are the <span style="color:#ff4444;font-weight:bold">SPY!</span><br>Your item (different): <strong>${item}</strong>`;
    el.style.color = "#ffeb3b";
  } else {
    el.innerHTML = `Your item: <strong>${item}</strong>`;
    el.style.color = "#2ecc71";
  }
  el.style.fontWeight = "bold";
});

// Chat messages with real names
socket.on('chat', ({ senderName, message }) => {
  const div = document.createElement('div');
  div.textContent = `${senderName}: ${message}`;
  document.getElementById('messages').appendChild(div);
  div.scrollIntoView({ behavior: "smooth" });
});

// Phase change (automatic transition to voting after 4 min)
socket.on('phaseChange', phase => {
  if (phase === 'voting') {
    document.getElementById('status').innerHTML = 
      '🕵️‍♂️ <strong>Voting Phase – 60 seconds</strong><br>Who do you think is the Spy?';
    
    document.getElementById('chatArea').style.display = 'none';
    document.getElementById('voting').style.display = 'block';

    // Disable description during voting
    disableDescriptionInput();

    // Reset voting state
    hasVoted = false;
    currentVoteTarget = null;

    renderVotingOptions();
    startVoteTimer(60);
  }
});

// ── Voting functions ──────────────────────────────────────────────────
function renderVotingOptions() {
  const container = document.getElementById('voteButtons');
  container.innerHTML = '';

  currentPlayers.forEach(player => {
    if (player.id === myId) return;

    const btn = document.createElement('button');
    btn.className = 'vote-btn';
    btn.textContent = player.name;

    const countSpan = document.createElement('span');
    countSpan.className = 'vote-count';
    countSpan.textContent = '0';
    btn.appendChild(countSpan);

    btn.onclick = () => {
      if (hasVoted) return;
      document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('voted'));
      btn.classList.add('voted');
      hasVoted = true;
      socket.emit('vote', { code: myRoom, targetId: player.id });
      document.getElementById('voteSummary').innerHTML = 
        `You voted for <strong style="color:#e74c3c">${player.name}</strong>`;
    };

    container.appendChild(btn);
  });
}

function startVoteTimer(seconds) {
  let timeLeft = seconds;
  const timerEl = document.getElementById('voteTimer');
  if (voteTimerInterval) clearInterval(voteTimerInterval);

  voteTimerInterval = setInterval(() => {
    timerEl.textContent = timeLeft;
    if (timeLeft <= 10) timerEl.style.color = '#e74c3c';
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(voteTimerInterval);
      timerEl.textContent = "Time's up!";
    }
  }, 1000);
}

// Skip vote
document.getElementById('skipVoteBtn')?.addEventListener('click', () => {
  if (hasVoted || document.getElementById('voting').style.display === 'none') return;
  hasVoted = true;
  socket.emit('vote', { code: myRoom, targetId: null });
  document.getElementById('voteSummary').innerHTML = 
    '<span style="color:#95a5a6">You chose to skip voting</span>';
  document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('voted'));
});

// Live vote counts
socket.on('voteUpdate', votes => {
  const voteCounts = {};
  Object.values(votes).forEach(target => {
    if (target) voteCounts[target] = (voteCounts[target] || 0) + 1;
  });

  document.querySelectorAll('.vote-btn').forEach(btn => {
    const name = btn.textContent.trim().replace(/\s*\d+$/, '');
    const player = currentPlayers.find(p => p.name === name);
    if (player) {
      const count = voteCounts[player.id] || 0;
      btn.querySelector('.vote-count').textContent = count;
    }
  });
});

// Round end + waiting screen
socket.on('roundEnd', ({ spyId, spyCaught, realItem, spyItem, scores }) => {
  clearInterval(voteTimerInterval);

  const spy = currentPlayers.find(p => p.id === spyId);
  let msg = spyCaught ? '✅ Spy was CAUGHT!' : '❌ Spy ESCAPED!';
  msg += `<br><br>Spy was: <strong>${spy?.name || '???'}</strong>`;
  msg += `<br>Real item: ${realItem}`;
  msg += `<br>Spy had: ${spyItem}`;

  document.getElementById('status').innerHTML = msg;
  document.getElementById('voting').style.display = 'none';
  document.getElementById('chatArea').style.display = 'block';
  updateScores(scores);

  // Show waiting screen
  document.getElementById('waitingScreen').style.display = 'block';
  document.getElementById('waitingMessage').textContent = 
    "Round finished. Waiting for everyone to be ready...";

  if (isHost) {
    document.getElementById('forceNextBtn').style.display = 'block';
  }

  // Reset description for next round
  hasDescribed = false;
  enableDescriptionInput();
});

// Waiting mode events
socket.on('enterWaitingMode', () => {
  document.getElementById('waitingScreen').style.display = 'block';
});

socket.on('readyUpdate', ({ readyCount, totalPlayers }) => {
  document.getElementById('readyStatus').textContent = 
    `${readyCount}/${totalPlayers} players ready`;
});

socket.on('allReady', () => {
  document.getElementById('waitingMessage').textContent = 
    "Everyone is ready! Starting next round...";
});

socket.on('hostForcedStart', () => {
  document.getElementById('waitingMessage').textContent = 
    "Host started next round immediately";
});

socket.on('autoStartTriggered', () => {
  document.getElementById('waitingMessage').textContent = 
    "3 minutes passed – auto starting next round";
});

// Ready button
document.getElementById('readyBtn')?.addEventListener('click', () => {
  socket.emit('playerReady', myRoom);
  document.getElementById('readyBtn').disabled = true;
  document.getElementById('readyBtn').textContent = "✓ Ready";
});

// Host force start
document.getElementById('forceNextBtn')?.addEventListener('click', () => {
  if (confirm("Force start next round now?")) {
    socket.emit('hostForceNextRound', myRoom);
  }
});

// Player list & scores
function updatePlayers(players) {
  const container = document.getElementById('players');
  container.innerHTML = '<h3>Players:</h3>';
  players.forEach(p => {
    const div = document.createElement('div');
    div.className = 'player';
    div.textContent = p.name + (p.id === myId ? ' (You)' : '');
    container.appendChild(div);
  });
}

function updateScores(scores) {
  const container = document.getElementById('scores');
  container.innerHTML = '<h3>Scores:</h3>';
  scores.forEach(s => {
    const div = document.createElement('div');
    div.textContent = `${s.name}: ${s.score}`;
    container.appendChild(div);
  });
}