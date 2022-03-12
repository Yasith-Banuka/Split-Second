var fs = require('fs')
/*
Include information only about the other servers 
*/

var coordinatingServers = [];

var globalClients = []; // Store the client id

var serverChatrooms = {}; // Store the chatroom id // {'s1': ['room1']}

function setCoordinatingServersConfig(path, serverId){
    // read servers config from file 
    const data =  fs.readFileSync(path, 'utf8');

    serversConf = data.split('\r\n');

    for (var i = 0; i < serversConf.length; i++) {

        serverConf = serversConf[i].split(' ');

        if (serverConf[0] != serverId){

            server= {}
            server["id"] = serverConf[0];
            server["address"] = serverConf[1];
            server["port"] = parseInt(serverConf[2]);
            server["coordinationPort"] = parseInt(serverConf[3]);

            coordinatingServers.push(server);
            serverChatrooms[server["id"]] = [];
        }
    }
}

function getCoordinatingPorts () {
    coordinatingPorts = [];
    let arrayLength = coordinatingServers.length;
    for (var i = 0; i < arrayLength; i++) {
        coordinatingPorts.push(coordinatingServers[i]["coordinationPort"]) 
    }
    return coordinatingPorts;

}

function isClientIdUnique(clientId){
    return globalClients.includes(clientId)
}
function addClients(clientId){
    globalClients.push(clientId);
}

function removeClient(clientId){
    const index = globalClients.indexOf(clientId);
    if (index > -1) {
        globalClients.splice(index, 1); // 2nd parameter means remove one item only
    }
}

function isChatroomIdUnique(roomId){
    for (var key of Object.keys(serverChatrooms)) {

        let chatrooms = serverChatrooms[key];
        return chatrooms.includes(roomId);
    }
}

function addChatroom(serverId, roomId){
    let chatrooms = serverChatrooms[serverId];
    chatrooms.push(roomId);
    serverChatrooms[serverId] = chatrooms;
}
    
function removeChatroom(roomId){
    let chatrooms = serverChatrooms[serverId];
    let chatroomArrayIndex = chatrooms.findIndex((x) => x == roomId);
    chatrooms.splice(chatroomArrayIndex, 1);
    serverChatrooms[serverId] = chatrooms;
}


function getServerInfo(serverId) {
    let arrayLength = coordinatingServersInfo.length;
    for (var i = 0; i < arrayLength; i++) {
        if (coordinatingServersInfo[i]["id"] == serverId) {
            return coordinatingServersInfo[i];
        }
    }
}


module.exports = {setCoordinatingServersConfig, getCoordinatingPorts, isClientIdUnique, addClients, removeClient, isChatroomIdUnique, addChatroom, removeChatroom,  getServerInfo }