/* 

inculdes server details.
[
    {   
        serverId : 
        port: 
        coordinationPort :
        socket : // associate socket object of the server
    },
    ....
]

*/
var coordinatingServers = [];


function getServerForSocket(socket) {
    let arrayLength = coordinatingServers.length;
    for (var i = 0; i < arrayLength; i++) {
        if (coordinatingServers[i].socket == socket) {
            return coordinatingServers[i];
        }
    }
    return false;
}

function getSocketForServer( serverId){
    return coordinatingServers["socket"];
}

module.exports = { getServerForSocket, getSocketForServer}
