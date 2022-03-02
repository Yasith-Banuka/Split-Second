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
    socket.on('data', function (chunk) {
        console.log(`Data received from client: ${chunk}`);
        test1={"type":"list"}
        test2={"type":"who"}
        nchunk=JSON.parse(chunk.toString())
        if (nchunk["type"]==test1["type"]){
            console.log(`list test`)
            msg={
                "type" : "roomlist",
                "rooms" : ["MainHall-s1", "MainHall-s2", "jokes"]
                };
            socket.sendMessage(msg); //not printing?
        }
        if (nchunk["type"]==test2["type"]){
            console.log(`who test`)
            msg={
                "type" : "roomcontents",
                "roomid" : "jokes",
                "identities" : ["Adel","Chenhao","Maria"],
                "owner" : "Adel"
                };
            socket.sendMessage(msg); //not printing?
        }
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

function clientServer(chunk) {

}