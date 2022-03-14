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
            server["priority"] = parseInt(serverConf[0].slice(1));
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
    let arrayLength = globalServerDetails.length;
    for (var i = 0; i < arrayLength; i++) {
        if (globalServerDetails[i]["serverId"] == serverId) {
            return globalServerDetails[i];
        }
    }
}

function getHighestPriorityServer() {
    let highestPriority = globalServerDetails[0].priority;
    for (var i = 1; i < globalServerDetails.length; i++) {
        highestPriority = Math.min(highestPriority,globalServerDetails[i].priority);
    }   
    return "s"+highestPriority; 
}

module.exports = {setCoordinatingServersConfig: setGlobalServersConfig, getCoordinatingPorts, getServerInfo, getHighestPriorityServer }