const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer();
const io = socketIo(server);

const users = new Map();

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  // Send the list of public keys to the new client
  socket.emit("init", Array.from(users.entries()));

  socket.on("registerPublicKey", (data) => {
    const { username, publicKey } = data;
    users.set(username, publicKey);
    console.log(`${username} registered with a public key.`);

    // Notify other users about the new user
    io.emit("newUser", { username, publicKey });
  });

  socket.on("message", (data) => {
    const { username, message, signature } = data;

    // Broadcast the message along with the signature
    io.emit("message", { username, message, signature });
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
