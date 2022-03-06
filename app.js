const Net = require('net'),
    JsonSocket = require('json-socket');
const { serverClients, serverChatRooms } = require('./chatRoomManager/chatRoomManager');
const { clientServer } = require('./clientServer/clientServerMain');
const util = require('./util/util');
// The port on which the server is listening.
const port = 8080;

const server = new Net.Server();

// Called when server is connected
server.listen(port, function () {
    console.log(`Server listening for connection requests on socket localhost:${port}`);

    // creation of the main hall of the server
    serverChatRooms.push({
        chatRoomIdentity: "MainHall-" + util.SERVERID,
        owner: null,
        identities: []
    })
});

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.

server.on('connection', function (socket) {
    //socket = new JsonSocket(socket);
    console.log('A new connection has been established.');



    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    //socket.write('Hello, client.');

    // The server can also receive data from the client by reading from its socket.

    socket.on('data', function (bufObj) {
        let json = util.jsonDecode(bufObj);

        //console.log(`Data received from client: ` + JSON.stringify(json));
        console.log(`Data received from client: ` + JSON.stringify(json) + `\n`);
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
