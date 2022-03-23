
const net = require("net");
const { getServerInfo, getAllServerInfo } = require("../data/globalServerDetails");
const { getCoordinationPort } = require("../data/serverDetails");
const { jsonEncode, jsonDecode } = require("../util/util");


function unicast(serverId, message) {

    let receivingServerInfo = getServerInfo(serverId);
    if (receivingServerInfo["active"]) {
        const socket = net.connect({ port: receivingServerInfo["coordinationPort"] }, receivingServerInfo["address"], () => {
            socket.write(jsonEncode(message));
            socket.destroy();
        });
        socket.on('error', function (ex) {
            console.log(`Error: ${ex}`);
        });
    }
}

function broadcast(message) {

    let globalServerIds = getAllServerInfo();
    for (let i = 0; i < globalServerIds.length; i++) {
        unicast(globalServerIds[i]["serverId"], message);
    }
}


function multicast(serverIds, message) {

    for (let i = 0; i < serverIds.length; i++) {
        unicast(serverIds[i], message);
    }
}


function reply(serverId, message, timeout) {
    console.log(serverId);
    // let serverCoordinationPort = getCoordinationPort();
    let receivingServerInfo = getServerInfo(serverId);
    console.log(serverId, message);
    const socket = net.createConnection({ port: receivingServerInfo["coordinationPort"] }, receivingServerInfo["address"], () => {
        socket.write(jsonEncode(message));
    });
    return new Promise((resolve, reject) => {
        socket.on('data', (bufObj) => {
            let json = jsonDecode(bufObj);
            resolve(json);
            socket.end();
        });
        let timeoutVar = null;
        return new Promise((resolve, reject) => {
            timeoutVar = setTimeout(() => {
                socket.end();
                resolve({ type: "serverfailure" });
            }, timeout);

            socket.on('data', (bufObj) => {
                let json = jsonDecode(bufObj);
                resolve(json);
                clearTimeout(timeoutVar);
                socket.end();
            });

            socket.on('error', (error) => {
                socket.end();
                clearTimeout(timeoutVar);
                resolve({ type: "serverfailure" });
            });
        });
        setTimeout(() => reject(), timeout);
    });
}


module.exports = {
    unicast,
    broadcast,
    multicast,
    reply
}