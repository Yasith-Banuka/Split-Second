/* 

inculdes server details.
[
    {   
        serverId : 
        port: 
        coordinationPort :
        socket : // associate socket object of the server
        priority
    },
    ....
]

*/
var otherServerDetails = [];

var serverDetails = {
    "id": "s3",
    "priority": 3
}

function getServerForSocket(socket) {
    for (var i = 0; i < coordinatingServers.length; i++) {
        if (coordinatingServers[i].socket == socket) {
            return coordinatingServers[i];
        }
    }
    return false;
}

function getSocketsForServers(serverIds){
    if (typeof serverIds === "string"){
        serverIds = [serverIds];
    }
    let results = []
    for (var i = 0; i < coordinatingServers.length; i++) {
        if (serverIds.includes(coordinatingServers[i].serverId)) {
            results.push(coordinatingServers[i].socket);
        }
    }
    return results;
    
}

function getAllSockets() {
    return coordinatingServers.map(server => server.socket);
}


module.exports = { getServerForSocket, getSocketsForServers, getAllSockets , otherServerDetails, serverDetails}
