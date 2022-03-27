var fs = require('fs')

/* 

inculdes server details.
[
    {   
        serverId :
        address: 
        clientPort: 
        coordinationPort :
    },
    ....
]

*/

var configPath = null;

var serverInfo = {};

var coordinatorId = null;

function setConfigInfo(path, serverId) {
    // set config path
    configPath = path;

    // read servers config from file 
    const data = fs.readFileSync(path, 'utf8');
    //check the OS type
    var isWin = process.platform === "win32";
    if (isWin){
        serversConf = data.split('\r\n');
    }
    else{
        serversConf = data.split('\n');
    }
    for (var i = 0; i < serversConf.length; i++) {

        serverConf = serversConf[i].split(' ');

        if (serverConf[0] == serverId) {

            serverInfo["serverId"] = serverConf[0];
            serverInfo["address"] = serverConf[1];
            serverInfo["clientPort"] = parseInt(serverConf[2]);
            serverInfo["coordinationPort"] = parseInt(serverConf[3]);
            serverInfo["priority"] = parseInt(serverConf[0].slice(1));
            break;
        }
    }
    return serverInfo;
}

function getPriority() {
    return serverInfo["priority"];
}
function getServerId() {
    return serverInfo["serverId"];
}

function getClientPort() {
    return serverInfo["clientPort"];
}

function getCoordinationPort() {
    return serverInfo["coordinationPort"];
}

function getAllInfo() {
    return serverInfo;
}

function setCoordinator(serverId) {// Set the leader
    coordinatorId = serverId;
}

function getCoordinator() {
    return coordinatorId;
}

function isCoordinator() {
    return serverInfo["serverId"]===coordinatorId;
}

function isCoordinatorAvailable() {
    return coordinatorId == null;
}

module.exports = { setConfigInfo, getServerId, getClientPort, getCoordinationPort, getPriority, getAllInfo, setCoordinator, setCoordinator, getCoordinator, isCoordinator, isCoordinatorAvailable }


// console.log(setConfigInfo('config/serverConfig.txt','s1'));