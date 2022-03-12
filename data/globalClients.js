var globalClients = []; // Store the client id

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

function updateClients(clientIdList) {
    globalClients = globalClients.concat(clientIdList);
}

module.exports = {isClientIdUnique, addClients, removeClient, updateClients}