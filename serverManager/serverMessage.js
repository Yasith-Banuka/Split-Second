
const net = require("net");
const { getServerInfo, getAllServerInfo } = require("../data/globalServerDetails");
const { getCoordinationPort } = require("../data/serverDetails");
const { jsonEncode, jsonDecode } = require("../util/util");


function unicast(serverId, message) {

    let receivingServerInfo = getServerInfo(serverId);
    if (receivingServerInfo["active"]) {
        const socket = net.createConnection(receivingServerInfo["coordinationPort"] , receivingServerInfo["address"], () => {
//             if(message.type !== "heartbeat" && message.type !== "heartbeat_ack") {
                console.log("Sending message to server ", serverId, " : ", message);
//             }
            socket.write(jsonEncode(message));
            socket.destroy();
        });
        socket.on('error', error => {
            console.log(`Error: ${error}`);
            socket.destroy();
        });
    }
}

function broadcast(message) {

    let globalServerIds = getAllServerInfo();
    for (let i = 0; i < globalServerIds.length; i++) {
        unicast(globalServerIds[i]["serverId"], message);
    }
    console.log("\n");
}


function multicast(serverIds, message) {

    for (let i = 0; i < serverIds.length; i++) {
        unicast(serverIds[i], message);
    }
    console.log("\n");
}


function reply(serverId, message, timeout) {
    // let serverCoordinationPort = getCoordinationPort();
    let receivingServerInfo = getServerInfo(serverId);
    const socket = net.createConnection(receivingServerInfo["coordinationPort"], receivingServerInfo["address"], () => {
        socket.write(jsonEncode(message));
        console.log("Sending message to server ", serverId, " : ", message);
    });
    let timeoutVar = null;
    return new Promise((resolve) => {
        timeoutVar = setTimeout(() => {
            socket.end();
            resolve({ type: "serverfailure" });
        }, timeout);

        socket.on('data', (bufObj) => {
            let json = jsonDecode(bufObj);
            resolve(json);
            socket.end();
        });

        socket.on('error', () => {
            socket.end();
            clearTimeout(timeoutVar);
            resolve({ type: "serverfailure" });
        });
    });
}


module.exports = {
    unicast,
    broadcast,
    multicast,
    reply
}
