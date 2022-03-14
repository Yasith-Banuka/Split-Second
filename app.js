const Net = require('net');

const { serverChatRooms } = require('./chatRoomManager/chatRoomManager');
const { clientServer } = require('./clientServer/clientServerMain');
const { serverManager } = require('./serverManager/serverManager');
const {setConfigInfo, getAllInfo, setCoordinator } = require('./data/serverDetails');
const {setCoordinatingServersConfig, getCoordinatingPorts, getHighestPriorityServer} = require('./data/globalServerDetails');

const util = require('./util/util');
const { argv } = require('process');

// Get serverId as the argument
const serverId = argv[2];

// Get servers config json path 
const configPath = argv[3];

// set server config
const serverConfig = setConfigInfo(configPath, serverId);
const port = serverConfig["clientPort"];
const coordination_port =serverConfig["coordinationPort"];

// set coordinating servers config
setCoordinatingServersConfig(configPath, serverId);
const otherCoordinationPorts = getCoordinatingPorts();

//set coordinator
setCoordinator(getHighestPriorityServer());

// Create a server
const server = new Net.Server();

// Called when server is connected
server.listen(port, function () {
    console.log(`Server listening for connection requests on socket localhost:${port}`);

    // Create the main hall of the server
    serverChatRooms.push({
        chatRoomIdentity: "MainHall-" + serverId,
        owner: null,
        clients: []
    })
});


// When a client or another server requests a connection with the server, the server creates a new socket dedicated to it.
server.on('connection', function (socket) {
    //socket = new JsonSocket(socket);
    console.log('A new connection has been established.');

    // Now that a TCP connection has been established, the server can send data to the client by writing to its socket.
    // socket.write(util.jsonEncode({type: 'message', content: 'success'}));

    // The server can also receive data from the client or another server  by reading from its socket.
    socket.on('data', function (bufObj) {
        let json = util.jsonDecode(bufObj);
        
        // Check whether the established connection is from a server or a client and redirect accordingly 
        // console.log(socket.remotePort);
        if (otherCoordinationPorts.includes(socket.remotePort)){
            console.log(`Data received from server: ` + JSON.stringify(json) + `\n`);
            serverManager(socket, json);
        }else{
            console.log(`Data received from client: ` + JSON.stringify(json) + `\n`);
            clientServer(socket, json);
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

