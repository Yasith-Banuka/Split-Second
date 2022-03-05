// Include Nodejs' net module.
const Net = require('net'),
    JsonSocket = require('json-socket');
// The port on which the server is listening.
const port = 8080;

// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
const server = new Net.Server();
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port, function () {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
});

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function (socket) {
    socket = new JsonSocket(socket);
    console.log('A new connection has been established.');

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    //socket.write('Hello, client.');

    // The server can also receive data from the client by reading from its socket.
    socket.on('message', function (json) {
        console.log(`Data received from client: ` + JSON.stringify(json));
        clientServer(socket, json);
    });

    // When the client requests to end the TCP connection with the server, the server ends the connection.
    socket.on('end', function () {
        console.log('Closing connection with the client');
    });

    // Don't forget to catch error, for your own sake.
    socket.on('error', function (err) {
        console.log(`Error: ${err}`);
    });
});

function clientServer(socket, json) {
    switch (json["type"]) {
        case "newidentity":
            newidentity(socket, json["identity"]);
            break;
        case "list":
            // code block
            break;
        case "who":
            // code block
            break;
        case "createroom":
            // code block
            break;
        case "joinroom":
            // code block
            break;
        case "message":
            // code block
            break;
        case "quit":
            // code block
            break;
        default:
            console.log(`\nERROR: Message received from client is wrong.\nPlease check and try again\n` + JSON.stringify(json));
    }
}

function newidentity(socket, identity) {
    let regEx = new RegExp('^[a-z][a-z0-9]{2,16}$', 'i');
    if (regEx.test(identity)) {
        socket.sendMessage({ "type": "newidentity", "approved": "true" });
    } else {
        socket.sendMessage({ "type": "newidentity", "approved": "false" });
    }
}

