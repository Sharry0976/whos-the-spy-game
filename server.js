// // // const express = require('express');
// // // const http = require('http');
// // // const { Server } = require('socket.io');
// // // const items = require('./items');

// // // const app = express();
// // // const server = http.createServer(app);
// // // const io = new Server(server, {
// // //   cors: { origin: "*" }
// // // });

// // // app.use(express.static('public'));

// // // const rooms = {}; // { roomCode: { players, gameState, phase, votes, timer, readyPlayers, nextRoundWaiting, waitStartTime } }

// // // function generateCode() {
// // //   return Math.random().toString(36).substring(2, 8).toUpperCase();
// // // }

// // // function pickRandomItem(exclude = null) {
// // //   let item;
// // //   do {
// // //     item = items[Math.floor(Math.random() * items.length)];
// // //   } while (exclude && item === exclude);
// // //   return item;
// // // }

// // // function startNewRound(roomCode) {
// // //   const room = rooms[roomCode];
// // //   if (!room || room.players.length < 3) return;

// // //   room.phase = 'describing';
// // //   room.votes = {};
// // //   room.currentItem = pickRandomItem();
// // //   room.spyItem = pickRandomItem(room.currentItem);

// // //   // Reset ready states for next waiting phase
// // //   room.readyPlayers = new Set();
// // //   room.nextRoundWaiting = false;

// // //   const spyIndex = Math.floor(Math.random() * room.players.length);
// // //   room.spyId = room.players[spyIndex].id;

// // //   console.log(`NEW ROUND → Real item: ${room.currentItem} | Spy item: ${room.spyItem}`);
// // //   console.log(`Spy selected: ${room.players[spyIndex].name} (${room.spyId})`);

// // //   room.players.forEach(p => p.isSpy = false);
// // //   room.players[spyIndex].isSpy = true;

// // //   room.players.forEach(p => {
// // //     const isSpy = p.isSpy;
// // //     const itemForPlayer = isSpy ? room.spyItem : room.currentItem;

// // //     io.to(p.id).emit('yourRole', {
// // //       isSpy,
// // //       item: itemForPlayer
// // //     });
// // //   });

// // //   io.to(roomCode).emit('gameStarted');

// // //   room.timer = setTimeout(() => {
// // //     if (rooms[roomCode]?.phase === 'describing') {
// // //       room.phase = 'voting';
// // //       io.to(roomCode).emit('phaseChange', 'voting');
// // //       setTimeout(() => endRound(roomCode), 60000);
// // //     }
// // //   }, 240000);
// // // }

// // // function endRound(roomCode) {
// // //   const room = rooms[roomCode];
// // //   if (!room) return;

// // //   clearTimeout(room.timer);

// // //   let spyCaught = false;
// // //   const votesForSpy = Object.values(room.votes).filter(v => v === room.spyId).length;

// // //   if (votesForSpy > room.players.length / 2) {
// // //     spyCaught = true;
// // //   }

// // //   room.players.forEach(p => {
// // //     if (p.isSpy) {
// // //       p.score = (p.score || 0) + (spyCaught ? 0 : 150);
// // //     } else {
// // //       p.score = (p.score || 0) + (spyCaught ? 100 : 0);
// // //     }
// // //   });

// // //   const winner = room.players.find(p => p.score >= 500);
// // //   if (winner) {
// // //     io.to(roomCode).emit('gameOver', { winner: winner.name });
// // //     delete rooms[roomCode];
// // //     return;
// // //   }

// // //   io.to(roomCode).emit('roundEnd', {
// // //     spyId: room.spyId,
// // //     spyCaught,
// // //     realItem: room.currentItem,
// // //     spyItem: room.spyItem,
// // //     scores: room.players.map(p => ({ name: p.name, score: p.score }))
// // //   });

// // //   // Enter waiting mode
// // //   room.nextRoundWaiting = true;
// // //   room.readyPlayers = new Set();
// // //   room.waitStartTime = Date.now();

// // //   io.to(roomCode).emit('enterWaitingMode');

// // //   // Auto-start after 3 minutes
// // //   setTimeout(() => {
// // //     if (rooms[roomCode]?.nextRoundWaiting) {
// // //       startNewRound(roomCode);
// // //       io.to(roomCode).emit('autoStartTriggered');
// // //     }
// // //   }, 180000); // 3 minutes
// // // }

// // // io.on('connection', (socket) => {
// // //   console.log('User connected:', socket.id);

// // //   socket.on('createRoom', (name) => {
// // //     const code = generateCode();
// // //     rooms[code] = {
// // //       players: [{ id: socket.id, name, score: 0 }],
// // //       gameState: 'lobby',
// // //       phase: 'lobby',
// // //       votes: {},
// // //       readyPlayers: new Set()
// // //     };
// // //     socket.join(code);
// // //     socket.emit('roomCreated', { code, players: rooms[code].players });
// // //   });

// // //   socket.on('joinRoom', ({ code, name }) => {
// // //     if (!rooms[code]) return socket.emit('error', 'Room not found');
// // //     if (rooms[code].gameState !== 'lobby') return socket.emit('error', 'Game already started');

// // //     rooms[code].players.push({ id: socket.id, name, score: 0 });
// // //     socket.join(code);
// // //     io.to(code).emit('playerList', rooms[code].players);
// // //     socket.emit('joined', { code, players: rooms[code].players });
// // //   });

// // //   socket.on('startGame', (code) => {
// // //     if (!rooms[code] || rooms[code].players[0]?.id !== socket.id) return;
// // //     rooms[code].gameState = 'playing';
// // //     startNewRound(code);
// // //   });

// // //   socket.on('chat', ({ code, message, senderName }) => {
// // //     if (rooms[code]?.phase !== 'describing') return;
// // //     io.to(code).emit('chat', { senderName, message });
// // //   });

// // //   socket.on('vote', ({ code, targetId }) => {
// // //     const room = rooms[code];
// // //     if (!room || room.phase !== 'voting') return;

// // //     room.votes[socket.id] = targetId;
// // //     io.to(code).emit('voteUpdate', room.votes);

// // //     if (Object.keys(room.votes).length === room.players.length) {
// // //       endRound(code);
// // //     }
// // //   });

// // //   socket.on('playerReady', (code) => {
// // //     const room = rooms[code];
// // //     if (!room || !room.nextRoundWaiting) return;

// // //     room.readyPlayers.add(socket.id);
// // //     io.to(code).emit('readyUpdate', {
// // //       readyCount: room.readyPlayers.size,
// // //       totalPlayers: room.players.length
// // //     });

// // //     if (room.readyPlayers.size === room.players.length) {
// // //       startNewRound(code);
// // //       io.to(code).emit('allReady');
// // //     }
// // //   });

// // //   socket.on('hostForceNextRound', (code) => {
// // //     const room = rooms[code];
// // //     if (!room || room.players[0]?.id !== socket.id) return socket.emit('error', 'Only host can force next round');

// // //     startNewRound(code);
// // //     io.to(code).emit('hostForcedStart');
// // //   });

// // //   socket.on('disconnect', () => {
// // //     for (const code in rooms) {
// // //       const idx = rooms[code].players.findIndex(p => p.id === socket.id);
// // //       if (idx !== -1) {
// // //         rooms[code].players.splice(idx, 1);
// // //         io.to(code).emit('playerList', rooms[code].players);
// // //         if (rooms[code].players.length === 0) delete rooms[code];
// // //       }
// // //     }
// // //     console.log('User disconnected:', socket.id);
// // //   });
// // // });

// // // const PORT = process.env.PORT || 3000;
// // // server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// // const express = require('express');
// // const http = require('http');
// // const { Server } = require('socket.io');
// // const items = require('./items');

// // const app = express();
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: { origin: "*" }
// // });

// // app.use(express.static('public'));

// // const rooms = {}; // { roomCode: { players, gameState, phase, votes, timer, describedPlayers, readyPlayers, nextRoundWaiting, waitStartTime } }

// // function generateCode() {
// //   return Math.random().toString(36).substring(2, 8).toUpperCase();
// // }

// // function pickRandomItem(exclude = null) {
// //   let item;
// //   do {
// //     item = items[Math.floor(Math.random() * items.length)];
// //   } while (exclude && item === exclude);
// //   return item;
// // }

// // function startNewRound(roomCode) {
// //   const room = rooms[roomCode];
// //   if (!room || room.players.length < 3) return;

// //   room.phase = 'describing';
// //   room.votes = {};
// //   room.currentItem = pickRandomItem();
// //   room.spyItem = pickRandomItem(room.currentItem);

// //   // NEW: Track who has sent at least one message this round
// //   room.describedPlayers = new Set();

// //   // Reset waiting states for after the round
// //   room.readyPlayers = new Set();
// //   room.nextRoundWaiting = false;

// //   const spyIndex = Math.floor(Math.random() * room.players.length);
// //   room.spyId = room.players[spyIndex].id;

// //   console.log(`NEW ROUND → Real item: ${room.currentItem} | Spy item: ${room.spyItem}`);
// //   console.log(`Spy selected: ${room.players[spyIndex].name} (${room.spyId})`);

// //   room.players.forEach(p => p.isSpy = false);
// //   room.players[spyIndex].isSpy = true;

// //   room.players.forEach(p => {
// //     const isSpy = p.isSpy;
// //     const itemForPlayer = isSpy ? room.spyItem : room.currentItem;

// //     io.to(p.id).emit('yourRole', {
// //       isSpy,
// //       item: itemForPlayer
// //     });
// //   });

// //   io.to(roomCode).emit('gameStarted');

// //   // Fallback timer: 4 minutes maximum
// //   room.timer = setTimeout(() => {
// //     if (rooms[roomCode]?.phase === 'describing') {
// //       endDescribingPhase(roomCode, 'Time up - everyone moves to voting!');
// //     }
// //   }, 240000);
// // }

// // // Helper to end describing phase (used both by timer and by all described)
// // function endDescribingPhase(roomCode, reasonMessage = 'All players have described!') {
// //   const room = rooms[roomCode];
// //   if (!room || room.phase !== 'describing') return;

// //   clearTimeout(room.timer);
// //   room.phase = 'voting';

// //   io.to(roomCode).emit('phaseChange', 'voting');
// //   io.to(roomCode).emit('chat', {
// //     senderName: 'System',
// //     message: `${reasonMessage} → Voting phase begins now!`
// //   });

// //   // Start 60-second voting timer
// //   setTimeout(() => endRound(roomCode), 60000);
// // }

// // function endRound(roomCode) {
// //   const room = rooms[roomCode];
// //   if (!room) return;

// //   clearTimeout(room.timer);

// //   let spyCaught = false;
// //   const votesForSpy = Object.values(room.votes).filter(v => v === room.spyId).length;

// //   if (votesForSpy > room.players.length / 2) {
// //     spyCaught = true;
// //   }

// //   room.players.forEach(p => {
// //     if (p.isSpy) {
// //       p.score = (p.score || 0) + (spyCaught ? 0 : 150);
// //     } else {
// //       p.score = (p.score || 0) + (spyCaught ? 100 : 0);
// //     }
// //   });

// //   const winner = room.players.find(p => p.score >= 500);
// //   if (winner) {
// //     io.to(roomCode).emit('gameOver', { winner: winner.name });
// //     delete rooms[roomCode];
// //     return;
// //   }

// //   io.to(roomCode).emit('roundEnd', {
// //     spyId: room.spyId,
// //     spyCaught,
// //     realItem: room.currentItem,
// //     spyItem: room.spyItem,
// //     scores: room.players.map(p => ({ name: p.name, score: p.score }))
// //   });

// //   // Enter waiting mode
// //   room.nextRoundWaiting = true;
// //   room.readyPlayers = new Set();
// //   room.waitStartTime = Date.now();

// //   io.to(roomCode).emit('enterWaitingMode');

// //   // Auto-start after 3 minutes if not everyone ready
// //   setTimeout(() => {
// //     if (rooms[roomCode]?.nextRoundWaiting) {
// //       startNewRound(roomCode);
// //       io.to(roomCode).emit('autoStartTriggered');
// //     }
// //   }, 180000); // 3 minutes
// // }

// // io.on('connection', (socket) => {
// //   console.log('User connected:', socket.id);

// //   socket.on('createRoom', (name) => {
// //     const code = generateCode();
// //     rooms[code] = {
// //       players: [{ id: socket.id, name, score: 0 }],
// //       gameState: 'lobby',
// //       phase: 'lobby',
// //       votes: {},
// //       readyPlayers: new Set()
// //     };
// //     socket.join(code);
// //     socket.emit('roomCreated', { code, players: rooms[code].players });
// //   });

// //   socket.on('joinRoom', ({ code, name }) => {
// //     if (!rooms[code]) return socket.emit('error', 'Room not found');
// //     if (rooms[code].gameState !== 'lobby') return socket.emit('error', 'Game already started');

// //     rooms[code].players.push({ id: socket.id, name, score: 0 });
// //     socket.join(code);
// //     io.to(code).emit('playerList', rooms[code].players);
// //     socket.emit('joined', { code, players: rooms[code].players });
// //   });

// //   socket.on('startGame', (code) => {
// //     if (!rooms[code] || rooms[code].players[0]?.id !== socket.id) return;
// //     rooms[code].gameState = 'playing';
// //     startNewRound(code);
// //   });

// //   // ── Chat message ── (this is where we check if everyone has described)
// //   socket.on('chat', ({ code, message, senderName }) => {
// //     const room = rooms[code];
// //     if (!room || room.phase !== 'describing') return;

// //     // Record that this player has sent a message
// //     room.describedPlayers.add(socket.id);

// //     // Broadcast the message
// //     io.to(code).emit('chat', { senderName, message });

// //     // Check if EVERY player has described at least once
// //     const allHaveDescribed = room.players.every(player => 
// //       room.describedPlayers.has(player.id)
// //     );

// //     if (allHaveDescribed) {
// //       endDescribingPhase(code, 'Everyone has described their item');
// //     }
// //   });

// //   socket.on('vote', ({ code, targetId }) => {
// //     const room = rooms[code];
// //     if (!room || room.phase !== 'voting') return;

// //     room.votes[socket.id] = targetId;
// //     io.to(code).emit('voteUpdate', room.votes);

// //     if (Object.keys(room.votes).length === room.players.length) {
// //       endRound(code);
// //     }
// //   });

// //   socket.on('playerReady', (code) => {
// //     const room = rooms[code];
// //     if (!room || !room.nextRoundWaiting) return;

// //     room.readyPlayers.add(socket.id);
// //     io.to(code).emit('readyUpdate', {
// //       readyCount: room.readyPlayers.size,
// //       totalPlayers: room.players.length
// //     });

// //     if (room.readyPlayers.size === room.players.length) {
// //       startNewRound(code);
// //       io.to(code).emit('allReady');
// //     }
// //   });

// //   socket.on('hostForceNextRound', (code) => {
// //     const room = rooms[code];
// //     if (!room || room.players[0]?.id !== socket.id) return socket.emit('error', 'Only host can force next round');

// //     startNewRound(code);
// //     io.to(code).emit('hostForcedStart');
// //   });

// //   socket.on('disconnect', () => {
// //     for (const code in rooms) {
// //       const idx = rooms[code].players.findIndex(p => p.id === socket.id);
// //       if (idx !== -1) {
// //         rooms[code].players.splice(idx, 1);
// //         io.to(code).emit('playerList', rooms[code].players);
// //         if (rooms[code].players.length === 0) delete rooms[code];
// //       }
// //     }
// //     console.log('User disconnected:', socket.id);
// //   });
// // });

// // const PORT = process.env.PORT || 3000;
// // server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const items = require('./items');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" }
// });

// app.use(express.static('public'));

// const rooms = {}; // { roomCode: { players, gameState, phase, votes, timer, describedPlayers, readyPlayers, nextRoundWaiting, waitStartTime } }

// function generateCode() {
//   return Math.random().toString(36).substring(2, 8).toUpperCase();
// }

// function pickRandomItem(exclude = null) {
//   let item;
//   do {
//     item = items[Math.floor(Math.random() * items.length)];
//   } while (exclude && item === exclude);
//   return item;
// }

// function startNewRound(roomCode) {
//   const room = rooms[roomCode];
//   if (!room || room.players.length < 3) return;

//   room.phase = 'describing';
//   room.votes = {};
//   room.currentItem = pickRandomItem();
//   room.spyItem = pickRandomItem(room.currentItem);

//   // NEW: Track who has sent at least one message this round
//   room.describedPlayers = new Set();

//   // Reset waiting states for after the round
//   room.readyPlayers = new Set();
//   room.nextRoundWaiting = false;

//   const spyIndex = Math.floor(Math.random() * room.players.length);
//   room.spyId = room.players[spyIndex].id;

//   console.log(`NEW ROUND → Real item: ${room.currentItem} | Spy item: ${room.spyItem}`);
//   console.log(`Spy selected: ${room.players[spyIndex].name} (${room.spyId})`);

//   room.players.forEach(p => p.isSpy = false);
//   room.players[spyIndex].isSpy = true;

//   room.players.forEach(p => {
//     const isSpy = p.isSpy;
//     const itemForPlayer = isSpy ? room.spyItem : room.currentItem;

//     io.to(p.id).emit('yourRole', {
//       isSpy,
//       item: itemForPlayer
//     });
//   });

//   io.to(roomCode).emit('gameStarted');

//   // Fallback timer: 4 minutes maximum
//   room.timer = setTimeout(() => {
//     if (rooms[roomCode]?.phase === 'describing') {
//       endDescribingPhase(roomCode, 'Time up - everyone moves to voting!');
//     }
//   }, 240000);
// }

// // Helper to end describing phase (used both by timer and by all described)
// function endDescribingPhase(roomCode, reasonMessage = 'All players have described!') {
//   const room = rooms[roomCode];
//   if (!room || room.phase !== 'describing') return;

//   clearTimeout(room.timer);
//   room.phase = 'voting';

//   io.to(roomCode).emit('phaseChange', 'voting');
//   io.to(roomCode).emit('chat', {
//     senderName: 'System',
//     message: `${reasonMessage} → Voting phase begins now!`
//   });

//   // Start 60-second voting timer
//   setTimeout(() => endRound(roomCode), 60000);
// }

// function endRound(roomCode) {
//   const room = rooms[roomCode];
//   if (!room) return;

//   clearTimeout(room.timer);

//   let spyCaught = false;
//   const votesForSpy = Object.values(room.votes).filter(v => v === room.spyId).length;

//   if (votesForSpy > room.players.length / 2) {
//     spyCaught = true;
//   }

//   room.players.forEach(p => {
//     if (p.isSpy) {
//       p.score = (p.score || 0) + (spyCaught ? 0 : 150);
//     } else {
//       p.score = (p.score || 0) + (spyCaught ? 100 : 0);
//     }
//   });

//   const winner = room.players.find(p => p.score >= 500);
//   if (winner) {
//     io.to(roomCode).emit('gameOver', { winner: winner.name });
//     delete rooms[roomCode];
//     return;
//   }

//   io.to(roomCode).emit('roundEnd', {
//     spyId: room.spyId,
//     spyCaught,
//     realItem: room.currentItem,
//     spyItem: room.spyItem,
//     scores: room.players.map(p => ({ name: p.name, score: p.score }))
//   });

//   // Enter waiting mode
//   room.nextRoundWaiting = true;
//   room.readyPlayers = new Set();
//   room.waitStartTime = Date.now();

//   io.to(roomCode).emit('enterWaitingMode');

//   // Auto-start after 3 minutes if not everyone ready
//   setTimeout(() => {
//     if (rooms[roomCode]?.nextRoundWaiting) {
//       startNewRound(roomCode);
//       io.to(roomCode).emit('autoStartTriggered');
//     }
//   }, 180000); // 3 minutes
// }

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('createRoom', (name) => {
//     const code = generateCode();
//     rooms[code] = {
//       players: [{ id: socket.id, name, score: 0 }],
//       gameState: 'lobby',
//       phase: 'lobby',
//       votes: {},
//       readyPlayers: new Set()
//     };
//     socket.join(code);
//     socket.emit('roomCreated', { code, players: rooms[code].players });
//   });

//   socket.on('joinRoom', ({ code, name }) => {
//     if (!rooms[code]) return socket.emit('error', 'Room not found');
//     if (rooms[code].gameState !== 'lobby') return socket.emit('error', 'Game already started');

//     rooms[code].players.push({ id: socket.id, name, score: 0 });
//     socket.join(code);
//     io.to(code).emit('playerList', rooms[code].players);
//     socket.emit('joined', { code, players: rooms[code].players });
//   });

//   socket.on('startGame', (code) => {
//     if (!rooms[code] || rooms[code].players[0]?.id !== socket.id) return;
//     rooms[code].gameState = 'playing';
//     startNewRound(code);
//   });

//   // ── Chat message ── (this is where we check if everyone has described)
//   socket.on('chat', ({ code, message, senderName }) => {
//     const room = rooms[code];
//     if (!room || room.phase !== 'describing') return;

//     // Record that this player has sent a message
//     room.describedPlayers.add(socket.id);

//     // Broadcast the message
//     io.to(code).emit('chat', { senderName, message });

//     // Check if EVERY player has described at least once
//     const allHaveDescribed = room.players.every(player => 
//       room.describedPlayers.has(player.id)
//     );

//     if (allHaveDescribed) {
//       endDescribingPhase(code, 'Everyone has described their item');
//     }
//   });

//   socket.on('vote', ({ code, targetId }) => {
//     const room = rooms[code];
//     if (!room || room.phase !== 'voting') return;

//     room.votes[socket.id] = targetId;
//     io.to(code).emit('voteUpdate', room.votes);

//     if (Object.keys(room.votes).length === room.players.length) {
//       endRound(code);
//     }
//   });

//   socket.on('playerReady', (code) => {
//     const room = rooms[code];
//     if (!room || !room.nextRoundWaiting) return;

//     room.readyPlayers.add(socket.id);
//     io.to(code).emit('readyUpdate', {
//       readyCount: room.readyPlayers.size,
//       totalPlayers: room.players.length
//     });

//     if (room.readyPlayers.size === room.players.length) {
//       startNewRound(code);
//       io.to(code).emit('allReady');
//     }
//   });

//   socket.on('hostForceNextRound', (code) => {
//     const room = rooms[code];
//     if (!room || room.players[0]?.id !== socket.id) return socket.emit('error', 'Only host can force next round');

//     startNewRound(code);
//     io.to(code).emit('hostForcedStart');
//   });

//   socket.on('disconnect', () => {
//     for (const code in rooms) {
//       const idx = rooms[code].players.findIndex(p => p.id === socket.id);
//       if (idx !== -1) {
//         rooms[code].players.splice(idx, 1);
//         io.to(code).emit('playerList', rooms[code].players);
//         if (rooms[code].players.length === 0) delete rooms[code];
//       }
//     }
//     console.log('User disconnected:', socket.id);
//   });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const items = require('./items');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static('public'));

// Serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const rooms = {};

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function pickRandomItem(exclude = null) {
  let item;
  do {
    item = items[Math.floor(Math.random() * items.length)];
  } while (exclude && item === exclude);
  return item;
}

function startNewRound(roomCode) {
  const room = rooms[roomCode];
  if (!room || room.players.length < 3) return;

  room.phase = 'describing';
  room.votes = {};
  room.currentItem = pickRandomItem();
  room.spyItem = pickRandomItem(room.currentItem);

  // Reset for this round
  room.describedPlayers = new Set();
  room.readyPlayers = new Set();
  room.nextRoundWaiting = false;

  const spyIndex = Math.floor(Math.random() * room.players.length);
  room.spyId = room.players[spyIndex].id;

  console.log(`NEW ROUND → Real: ${room.currentItem} | Spy: ${room.spyItem}`);
  console.log(`Spy: ${room.players[spyIndex].name} (${room.spyId})`);

  room.players.forEach(p => p.isSpy = false);
  room.players[spyIndex].isSpy = true;

  room.players.forEach(p => {
    io.to(p.id).emit('yourRole', {
      isSpy: p.isSpy,
      item: p.isSpy ? room.spyItem : room.currentItem
    });
  });

  io.to(roomCode).emit('gameStarted');

  // Maximum 4 minutes describing time
  room.timer = setTimeout(() => {
    if (rooms[roomCode]?.phase === 'describing') {
      endDescribingPhase(roomCode, 'Time\'s up! Moving to voting.');
    }
  }, 240000);
}

function endDescribingPhase(roomCode, reason = 'All players have spoken') {
  const room = rooms[roomCode];
  if (!room || room.phase !== 'describing') return;

  clearTimeout(room.timer);
  room.phase = 'voting';

  io.to(roomCode).emit('phaseChange', 'voting');
  io.to(roomCode).emit('chat', {
    senderName: 'System',
    message: `${reason} → Voting phase starts now!`
  });

  setTimeout(() => endRound(roomCode), 60000); // 60s voting
}

function endRound(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;

  clearTimeout(room.timer);

  let spyCaught = false;
  const votesForSpy = Object.values(room.votes).filter(v => v === room.spyId).length;

  if (votesForSpy > room.players.length / 2) {
    spyCaught = true;
  }

  room.players.forEach(p => {
    p.score = (p.score || 0) + (p.isSpy ? (spyCaught ? 0 : 150) : (spyCaught ? 100 : 0));
  });

  const winner = room.players.find(p => p.score >= 500);
  if (winner) {
    io.to(roomCode).emit('gameOver', { winner: winner.name });
    delete rooms[roomCode];
    return;
  }

  io.to(roomCode).emit('roundEnd', {
    spyId: room.spyId,
    spyCaught,
    realItem: room.currentItem,
    spyItem: room.spyItem,
    scores: room.players.map(p => ({ name: p.name, score: p.score }))
  });

  // Waiting mode - next round ONLY when all ready
  room.nextRoundWaiting = true;
  room.readyPlayers = new Set();

  io.to(roomCode).emit('enterWaitingMode');
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', (name) => {
    const code = generateCode();
    rooms[code] = {
      players: [{ id: socket.id, name, score: 0 }],
      gameState: 'lobby',
      phase: 'lobby',
      votes: {},
      readyPlayers: new Set()
    };
    socket.join(code);
    socket.emit('roomCreated', { code, players: rooms[code].players });
  });

  socket.on('joinRoom', ({ code, name }) => {
    if (!rooms[code]) return socket.emit('error', 'Room not found');
    if (rooms[code].gameState !== 'lobby') return socket.emit('error', 'Game already started');

    rooms[code].players.push({ id: socket.id, name, score: 0 });
    socket.join(code);
    io.to(code).emit('playerList', rooms[code].players);
    socket.emit('joined', { code, players: rooms[code].players });
  });

  socket.on('startGame', (code) => {
    if (!rooms[code] || rooms[code].players[0]?.id !== socket.id) return;
    rooms[code].gameState = 'playing';
    startNewRound(code);
  });

  socket.on('chat', ({ code, message, senderName }) => {
    const room = rooms[code];
    if (!room || room.phase !== 'describing') return;

    room.describedPlayers.add(socket.id);
    io.to(code).emit('chat', { senderName, message });

    // Check if everyone has spoken
    if (room.players.every(p => room.describedPlayers.has(p.id))) {
      endDescribingPhase(code, 'Everyone has described their item!');
    }
  });

  socket.on('vote', ({ code, targetId }) => {
    const room = rooms[code];
    if (!room || room.phase !== 'voting') return;

    room.votes[socket.id] = targetId;
    io.to(code).emit('voteUpdate', room.votes);

    if (Object.keys(room.votes).length === room.players.length) {
      endRound(code);
    }
  });

  socket.on('playerReady', (code) => {
    const room = rooms[code];
    if (!room || !room.nextRoundWaiting) return;

    room.readyPlayers.add(socket.id);
    io.to(code).emit('readyUpdate', {
      readyCount: room.readyPlayers.size,
      totalPlayers: room.players.length
    });

    if (room.readyPlayers.size === room.players.length) {
      startNewRound(code);
      io.to(code).emit('allReady');
    }
  });

  socket.on('hostForceNextRound', (code) => {
    const room = rooms[code];
    if (!room || room.players[0]?.id !== socket.id) return socket.emit('error', 'Only host can force start');

    startNewRound(code);
    io.to(code).emit('hostForcedStart');
  });

  socket.on('disconnect', () => {
    for (const code in rooms) {
      const idx = rooms[code].players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        rooms[code].players.splice(idx, 1);
        io.to(code).emit('playerList', rooms[code].players);
        if (rooms[code].players.length === 0) delete rooms[code];
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));