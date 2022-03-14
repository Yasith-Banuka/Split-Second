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
    for (var i = 0; i < otherServerDetails.length; i++) {
        if (otherServerDetails[i].socket == socket) {
            return otherServerDetails[i];
        }
    }
    return false;
}

function getSocketsForServers(serverIds){
    if (typeof serverIds === "string"){
        serverIds = [serverIds];
    }
    let results = [];
    for (var i = 0; i < otherServerDetails.length; i++) {
        if (serverIds.includes(otherServerDetails[i].serverId)) {
            results.push(otherServerDetails[i].socket);
        }
    }
    return results;
    
}

function getAllSockets() {
    return otherServerDetails.map(server => server.socket);
}



module.exports = { getServerForSocket, getSocketsForServers, getAllSockets , getLowerPriorityServers, getHigherPriorityServers, serverDetails}
