var globalClients = {}; // Store the client id : server id

function isClientIdUsed(clientId){
    return globalClients.hasOwnProperty(clientId)
}

function addClient(serverId, clientId){
    globalClients[clientId] = serverId;
}

function removeClient(clientId){
    delete globalClients[clientId];
}


function updateClients(serverId, clientList) {
    for(let i=0;i<clientList.length;i++) {
        globalClients[clientList[i]] = serverId;
    }
}

function updateClientServer(serverId, clientId) {
    globalClients[clientId] = serverId;
}

function removeAllClientsOfAServer(serverId) {
    for ( var clientId in globalClients ) {
        if ( globalClients[clientId] === serverId ) {
            delete globalClients[clientId];
        }
    }
}

module.exports = {isClientIdUsed, addClient, removeClient, updateClients, updateClientServer, removeAllClientsOfAServer}