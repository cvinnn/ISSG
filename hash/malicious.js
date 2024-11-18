const http = require("http");
const socketIo = require("socket.io");
const crypto = require("crypto"); // For hashing

const server = http.createServer();
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on("message", (data) => {
    let { username, message } = data;

    // Modify the message maliciously
    message += " (sus?)";

    // Create hash of the *original* message (this mismatch will be detected by the client)
    const hash = crypto.createHash("sha256").update(data.message).digest("hex");

    // Broadcast the tampered message with the original hash
    io.emit("message", { username, message, hash });
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Malicious server running on port ${port}`);
});
