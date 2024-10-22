const io = require("socket.io-client");
const readline = require("readline");
const crypto = require("crypto");

const socket = io("http://localhost:3000");

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
});

let username = "";

socket.on("connect", () => {
    console.log("Connected to the server");

    r1.question("Enter your username: ", (input) => {
        username = input;
        console.log(`Welcome, ${username} to the chat`);
        r1.prompt();

        r1.on("line", (message) => {
            if (message.trim()) {
                // Buat hash SHA256 dari pesan
                const sha256Hash = crypto.createHash("sha256").update(message).digest("hex");
                
                // Tampilkan hash di terminal
                console.log(`SHA256 Hash: ${sha256Hash}`);

                // Kirim pesan bersama dengan hash-nya
                socket.emit("message", { 
                    username, 
                    message, 
                    sha256Hash 
                });
            }
            r1.prompt();
        });
    });
});

socket.on("message", (data) => {
    const { username: senderUsername, message: senderMessage } = data;

    if (senderUsername !== username) {
        console.log(`${senderUsername}: ${senderMessage}`);
        r1.prompt();
    }
});

socket.on("disconnect", () => {
    console.log("Server disconnected, Exiting...");
    r1.close();
    process.exit(0);
});

r1.on("SIGINT", () => {
    console.log("\nExiting...");
    socket.disconnect();
    r1.close();
    process.exit(0);
});
