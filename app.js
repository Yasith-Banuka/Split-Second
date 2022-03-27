const Net = require('net');

const { serverChatRooms } = require('./chatRoomManager/chatRoomManager');
const { clientServer } = require('./clientServer/clientServerMain');
const { serverManager } = require('./serverManager/serverManager');
const { setConfigInfo, getAllInfo, setCoordinator, getClientPort, getCoordinationPort, getCoordinator } = require('./data/serverDetails');
const { setGlobalServersConfig, getCoordinatingPorts, getHighestPriorityServer } = require('./data/globalServerDetails');

const util = require('./util/util');
const { argv } = require('process');
const { addLocalChatRoom } = require('./data/serverChatRooms');
const { addChatroom } = require('./data/globalChatRooms');

const { heartbeat, initHeartbeat } = require('./serverManager/heartbeat');
const { broadcastNewChatroom } = require('./serverManager/broadcastCommunication');

const constants = require('./util/constants');
const { sendIamup } = require('./serverManager/leaderElection');
const { quit } = require('./clientServer/quit');


// Get serverId as the argument
const serverId = argv[2];

// Get servers config json path 
const configPath = argv[3];

// set server config
const serverConfig = setConfigInfo(configPath, serverId);
const port = getClientPort();
const coordinationPort = getCoordinationPort();
constants.T4 = 2000 * serverConfig.priority;

// set coordinating servers config
setGlobalServersConfig(configPath, serverId);
// const otherCoordinationPorts = getCoordinatingPorts();


//send iamup
sendIamup();

var heartbeatCheck = false;

initHeartbeat();

// Create a client server
const serverForClients = new Net.Server();

// Called when server is connected
serverForClients.listen(port, function () {
    console.log(`Server listening for client connection requests on ${serverForClients.address().address}:${port}`);

    // Create the main hall of the server
    addLocalChatRoom({
        chatRoomIdentity: "MainHall-" + serverId,
        owner: null,
        clients: []
    });
    addChatroom(serverId, "MainHall-" + serverId);
    broadcastNewChatroom(serverId, "MainHall-" + serverId)

});

// When a client requests a connection with the server, the server creates a new socket dedicated to it.
serverForClients.on('connection', function (socket) {

    if (heartbeatCheck == false) {
        setInterval(heartbeat, 2000);
        heartbeatCheck = true;
    }

    //socket = new JsonSocket(socket);
    console.log('A new connection with a client has been established.');

    // Now that a TCP connection has been established, the server can send data to the client by writing to its socket.
    // socket.write(util.jsonEncode({type: 'message', content: 'success'}));

    // The server can also receive data from the client or another server  by reading from its socket.
    socket.on('data', function (bufObj) {
        try {
            let json = util.jsonDecode(bufObj);
            console.log(`Data received from client: ` + JSON.stringify(json) + `\n`);
            clientServer(socket, json);
        } catch (error) { }


    });


    // When the client requests to end the TCP connection with the server, the server ends the connection.
    socket.on('end', function () {
        //quit(socket);
        console.log('Closing the connection');
    });


    // Don't forget to catch error, for your own sake.
    socket.on('error', function (err) {
        setImmediate(quit,socket);
        console.log(err);
        console.log('Closing the connection');
    });
});

// Create a server for communicating  with other server
const serverForCoordination = new Net.Server();

serverForCoordination.listen(coordinationPort, function () {
    console.log(`Server listening for server connection requests on ${serverForClients.address().address}:${coordinationPort}`);
});

serverForCoordination.on('connection', function (socket) {

    if (heartbeatCheck == false) {
        setInterval(heartbeat, 2000);
        heartbeatCheck = true;
    }

    socket.on('data', function (bufObj) {
        try {
            let json = util.jsonDecode(bufObj);
            if (json.type !== "heartbeat" && json.type !== "heartbeat_ack") {
                console.log(`Data received from a server : ` + JSON.stringify(json) + `\n`);
            }

            serverManager(socket, json);
        } catch (error) { }



    });

    socket.on('end', function () {
    });

    socket.on('error', function (err) {
        console.log(`Error: ${err}`);
    });
});

/* serverForCoordination.on('clientError', (err, socket) => {
    //if (err.code === 'ECONNRESET' || !socket.writable) socket.end('HTTP/2 400 Bad Request\n');
    console.log('client error\n', err);
}); */

serverForCoordination.on('error', (err, socket) => {
    //if (err.code === 'ECONNRESET' || !socket.writable) socket.end('HTTP/2 400 Bad Request\n');
    console.log('client error\n', err);
});

/* if (heartbeatCheck == 1) {
    setInterval(heartbeat, 2000);
} */





