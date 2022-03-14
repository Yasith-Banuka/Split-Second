var fs = require('fs')
const {getPriority} = require("./serverDetails");
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
            server["priority"] = parseInt(serverConf[0].slice(1));
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

function getAllServerInfo() {
    return globalServersInfo;
}

function getHighestPriorityServer() {
    let highestPriority = getPriority();
    for (var i = 0; i < globalServersInfo.length; i++) {
        highestPriority = Math.min(highestPriority , globalServersInfo[i].priority);
    }   
    return "s" + highestPriority; 
}

module.exports = {setCoordinatingServersConfig: setGlobalServersConfig, getCoordinatingPorts, getServerInfo, getHighestPriorityServer, getAllServerInfo}