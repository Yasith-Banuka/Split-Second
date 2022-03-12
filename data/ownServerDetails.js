var fs = require('fs')

/* 

inculdes server details.
[
    {   
        id :
        address: 
        port: 
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

            serverInfo["id"] = serverConf[0];
            serverInfo["address"] = serverConf[1];
            serverInfo["port"] = parseInt(serverConf[2]);
            serverInfo["coordinationPort"] = parseInt(serverConf[3]);
            break;
        }
    }
    return serverInfo;
}


function getId() {
    return serverInfo["id"];
}

function getPort() {
    return serverInfo["port"];
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

module.exports= {setConfigInfo, getId, getPort, getCoordinationPort, getAllInfo, setCoordinator, setCoordinator}


// console.log(setConfigInfo('config/serverConfig.txt','s1'));