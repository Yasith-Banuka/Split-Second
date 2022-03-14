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

var serverInfo = {} ;

var coordinatorId = null;

function setConfigInfo(path, serverId) {
    // set config path
    configPath = path;

    // read servers config from file 
    const data =  fs.readFileSync(path, 'utf8');

    serversConf = data.split('\r\n');

    for (var i = 0; i < serversConf.length; i++) {

        serverConf = serversConf[i].split(' ');

        if (serverConf[0] == serverId){

            serverInfo["serverId"] = serverConf[0];
            serverInfo["address"] = serverConf[1];
            serverInfo["clientPort"] = parseInt(serverConf[2]);
            serverInfo["coordinationPort"] = parseInt(serverConf[3]);
            break;
        }
    }
    return serverInfo;
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

function setCoordinator (serverId) {// Set the leader
    coordinatorId = serverId;
} 

function getCoordinator () {
    return coordinatorId;
} 

module.exports= {setConfigInfo, getServerId, getClientPort, getCoordinationPort, getAllInfo, setCoordinator, setCoordinator, getCoordinator}


// console.log(setConfigInfo('config/serverConfig.txt','s1'));