const io = require("socket.io-client");
const readline = require("readline");

const socket = io("http://localhost:3000")

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prinot: "> "
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
                socket.emit("message", { username, message});
            }
            r1.prompt();
        });
    });
});

socket.on("message", (data) => {
    
    const { username: senderUsername, message: senderMessage} = data;

    if (senderUsername != username){
        console.log(`${senderUsername}: ${senderMessage}`);
        r1.prompt();
    }
});

socket.on("disconnect", () => {
    console.log("Server disconnected, Exiting...");
    r1.close();
    process.exit(0);
});

r1.on("SIGINT", ()=> {
    console.log("\nExiting...");
    socket.disconnect();
    r1.close();
    process.exit(0);
});

