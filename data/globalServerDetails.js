var fs = require('fs')
const { getPriority } = require("./serverDetails");
/*
    Include information only about the other servers 
    [
        {
            "serverId" : s2,
            "address" : localhost,
            "clientPort" : 4447,
            "coordinationPort" : 5557,
            "priority" : x,
            "active" : true
        }
    ]
*/

var globalServersInfo = [];

/*

    add server details to the globalServerInfo list

*/
function setGlobalServersConfig(path, serverId) {
    // read servers config from file 
    const data = fs.readFileSync(path, 'utf8');

    serversConf = data.split('\r\n');

    for (var i = 0; i < serversConf.length; i++) {

        serverConf = serversConf[i].split(' ');

        if (serverConf[0] != serverId) {

            server = {}
            server["serverId"] = serverConf[0];
            server["address"] = serverConf[1];
            server["clientPort"] = parseInt(serverConf[2]);
            server["coordinationPort"] = parseInt(serverConf[3]);
            server["priority"] = parseInt(serverConf[0].slice(1));
            server["active"] = true;
            globalServersInfo.push(server);
        }
    }
}

function getCoordinatingPorts() {
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

/*

    get server details of all active servers

*/
function getAllServerInfo() {
    let globalServersList = [];

    let arrayLength = globalServersInfo.length;
    for (var i = 0; i < arrayLength; i++) {
        if (globalServersInfo[i]["active"] == true) {
            return globalServersList.push(globalServersInfo[i]);
        }
    }

    return globalServersList;
}

function getHighestPriorityServer() {
    let highestPriority = getPriority();
    for (var i = 0; i < globalServersInfo.length; i++) {
        highestPriority = Math.min(highestPriority, globalServersInfo[i].priority);
    }
    return "s" + highestPriority;
}

/*

    mark the given server as failed

*/
function markFailedServer(failedServerID) {
    let arrayLength = globalServersInfo.length;
    for (var i = 0; i < arrayLength; i++) {
        if (globalServersInfo[i]["serverId"] == failedServerID) {
            globalServersInfo[i]["active"] = false;
            break;
        }
    }
}

/*

    mark the given server as active again

*/
function markActiveServer(serverID) {
    let arrayLength = globalServersInfo.length;
    for (var i = 0; i < arrayLength; i++) {
        if (globalServersInfo[i]["serverId"] == serverID) {
            globalServersInfo[i]["active"] = true;
            break;
        }
    }
}

module.exports = { setCoordinatingServersConfig: setGlobalServersConfig, getCoordinatingPorts, getServerInfo, getHighestPriorityServer, getAllServerInfo, markFailedServer, markActiveServer }