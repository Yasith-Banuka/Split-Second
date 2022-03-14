var fs = require('fs')
/*
Include information only about the other servers 
*/

var globalServerDetails = [];





function setGlobalServersConfig(path, serverId){
    // read servers config from file 
    const data =  fs.readFileSync(path, 'utf8');

    serversConf = data.split('\r\n');

    for (var i = 0; i < serversConf.length; i++) {

        serverConf = serversConf[i].split(' ');

        if (serverConf[0] != serverId){

            server= {}
            server["serverId"] = serverConf[0];
            server["address"] = serverConf[1];
            server["ClientPort"] = parseInt(serverConf[2]);
            server["coordinationPort"] = parseInt(serverConf[3]);

            globalServerDetails.push(server);
        }
    }
}

function getCoordinatingPorts () {
    coordinatingPorts = [];
    let arrayLength = globalServerDetails.length;
    for (var i = 0; i < arrayLength; i++) {
        coordinatingPorts.push(globalServerDetails[i]["coordinationPort"]) 
    }
    return coordinatingPorts;

}

function getServerInfo(serverId) {
    let arrayLength = coordinatingServersInfo.length;
    for (var i = 0; i < arrayLength; i++) {
        if (coordinatingServersInfo[i]["serverId"] == serverId) {
            return coordinatingServersInfo[i];
        }
    }
}


module.exports = {setCoordinatingServersConfig: setGlobalServersConfig, getCoordinatingPorts, getServerInfo }