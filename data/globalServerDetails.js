var fs = require('fs')
/*
Include information only about the other servers 
*/

var globalServersInfo = [];





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
            server["clientPort"] = parseInt(serverConf[2]);
            server["coordinationPort"] = parseInt(serverConf[3]);

            globalServersInfo.push(server);
        }
    }
}

function getCoordinatingPorts () {
    coordinatingPorts = [];
    let arrayLength = globalServersInfo.length;
    for (var i = 0; i < arrayLength; i++) {
        coordinatingPorts.push(globalServersInfo[i]["coordinationPort"]) 
    }
    return coordinatingPorts;

}

function getServerInfo(serverId) {
    let arrayLength = globalServersInfo.length;
    for (var i = 0; i < arrayLength; i++) {
        if (globalServersInfo[i]["serverId"] == serverId) {
            return globalServersInfo[i];
        }
    }
}


module.exports = {setCoordinatingServersConfig: setGlobalServersConfig, getCoordinatingPorts, getServerInfo }