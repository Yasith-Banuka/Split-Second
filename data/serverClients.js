/* 

inculdes client details.
[
    {   
        clientIdentity : // clientIdentity
        socket : // associate socket object of the client
        chatRoom: // chat room of the client
    },
    ....
]

*/
var serverClients = [];

// add a client object to the serverClients list
function addLocalClient(clientObject) {
    serverClients.push(clientObject);
}

function getLocalClientIds() {
    return serverClients.map(client => client.clientIdentity);
}
/*

    check if the client identity already exists and 
        if do
            returns the client
        else
            returns false

*/
function checkClientIdentityExist(identity) {
    let arrayLength = serverClients.length;
    for (var i = 0; i < arrayLength; i++) {
        if (serverClients[i].clientIdentity == identity) {
            return serverClients[i];
        }
    }
    return false;
}

/*

    return the client details for the given socket

*/
function getClientForSocket(socket) {
    let arrayLength = serverClients.length;
    for (var i = 0; i < arrayLength; i++) {
        if (serverClients[i].socket == socket) {
            return serverClients[i];
        }
    }
    return false;
}

/*

    remove given client from the server

*/
function removeClientFromServer(client) {

    let clientArrayIndex = serverClients.findIndex((x) => x == client);

    serverClients.splice(clientArrayIndex, 1);

}

module.exports = { serverClients, getLocalClientIds, addLocalClient, checkClientIdentityExist, getClientForSocket, removeClientFromServer }



