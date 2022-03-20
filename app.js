const Net = require('net');

const { serverChatRooms } = require('./chatRoomManager/chatRoomManager');
const { clientServer } = require('./clientServer/clientServerMain');
const { serverManager } = require('./serverManager/serverManager');
const { setConfigInfo, getAllInfo, setCoordinator, getClientPort, getCoordinationPort, getCoordinator } = require('./data/serverDetails');
const { setCoordinatingServersConfig, getCoordinatingPorts, getHighestPriorityServer } = require('./data/globalServerDetails');

const util = require('./util/util');
const { argv } = require('process');
const { addLocalChatRoom } = require('./data/serverChatRooms');
const { heartbeat } = require('./serverManager/heartbeat');

// Get serverId as the argument
const serverId = argv[2];

// Get servers config json path 
const configPath = argv[3];

// set server config
const serverConfig = setConfigInfo(configPath, serverId);
const port = getClientPort();
const coordinationPort = getCoordinationPort();

// set coordinating servers config
setCoordinatingServersConfig(configPath, serverId);
// const otherCoordinationPorts = getCoordinatingPorts();

//set coordinator
setCoordinator(getHighestPriorityServer());

// Create a client server
const serverForClients = new Net.Server();

// Called when server is connected
serverForClients.listen(port, function () {
    console.log(`Server listening for client connection requests on localhost:${port}`);

    // Create the main hall of the server
    addLocalChatRoom({
        chatRoomIdentity: "MainHall-" + serverId,
        owner: null,
        clients: []
    });
});

// When a client requests a connection with the server, the server creates a new socket dedicated to it.
serverForClients.on('connection', function (socket) {
    //socket = new JsonSocket(socket);
    console.log('A new connection with a client has been established.');

    // Now that a TCP connection has been established, the server can send data to the client by writing to its socket.
    // socket.write(util.jsonEncode({type: 'message', content: 'success'}));

    // The server can also receive data from the client or another server  by reading from its socket.
    socket.on('data', function (bufObj) {
        let json = util.jsonDecode(bufObj);
        console.log(`Data received from client: ` + JSON.stringify(json) + `\n`);
        clientServer(socket, json);

    });


    // When the client requests to end the TCP connection with the server, the server ends the connection.
    socket.on('end', function () {
        console.log('Closing the connection');
    });


    // Don't forget to catch error, for your own sake.
    socket.on('error', function (err) {
        console.log(`Error: ${err}`);
    });
});

// Create a server for communicating  with other server
const serverForCoordination = new Net.Server();

serverForCoordination.listen(coordinationPort, function () {
    console.log(`Server listening for server connection requests on localhost:${coordinationPort}`);
});

serverForCoordination.on('connection', function (socket) {

    console.log('A new connection with a server has been established.');

    socket.on('data', function (bufObj) {
        let json = util.jsonDecode(bufObj);
        console.log(`Data received from a server : ` + JSON.stringify(json) + `\n`);
        serverManager(socket, json);

    });

    socket.on('end', function () {
        console.log('Closing the connection');
    });

    socket.on('error', function (err) {
        console.log(`Error: ${err}`);
    });
});

//await heartbeat();

