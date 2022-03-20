
const net = require("net");
const {getServerInfo, getCoordinatingServerIds} = require("../data/globalServerDetails");
const {getCoordinationPort} = require("../data/serverDetails");
const { jsonEncode, jsonDecode } = require("../util/util");

module.exports = {
    message: function (serverId, message) {

        let serverCoordinationPort = getCoordinationPort();
        let receivingServerInfo = getServerInfo(serverId);
        console.log(receivingServerInfo);
        if(receivingServerInfo.active) {
            const socket = net.createConnection({port:receivingServerInfo["clientPort"], localPort:serverCoordinationPort["coordinationPort"]}, receivingServerInfo["address"], ()=>{
                socket.write(jsonEncode(message));
                socket.destroy();
            } )
        }
    },

    broadcast: function(message) {

        let coordinatingServerIds = getCoordinatingServerIds();
        for (let i=0;i<coordinatingServerIds.length;i++) {
            message(coordinatingServerIds[i], message);
        }
     },

    multicast: function(serverIds, message) {

        for (let i=0;i<serverIds.length;i++) {
            message(serverIds[i], message);
        }
    },
    
    reply: function(serverId, message, timeout) {
        console.log(serverId);
        let serverCoordinationPort = getCoordinationPort();
        let receivingServerInfo = getServerInfo(serverId);
        console.log(serverId, message);
        const socket = net.createConnection({port:receivingServerInfo["clientPort"], localPort:serverCoordinationPort}, receivingServerInfo["address"], ()=>{
            socket.write(jsonEncode(message));
        });
        let timeoutVar = null;
        return new Promise((resolve, reject) => {
            timeoutVar = setTimeout(() => {
                socket.end();
                resolve({type: "serverfailure"});
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
                resolve({type: "serverfailure"});   
            });


        });
    }
}