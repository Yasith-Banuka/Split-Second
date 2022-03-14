const util = require("../util/util");
const net = require("net");
const {getServerInfo, getCoordinatingServerIds} = require("../data/globalServerDetails");
const {getCoordinationPort} = require("../data/serverDetails");

module.exports = {
    message: function (serverId, message) {

        let serverCoordinationPort = getCoordinationPort();
        let receivingServerInfo = getServerInfo(serverId);
        console.log(receivingServerInfo);

        const socket = net.createConnection({port:receivingServerInfo["clientPort"], localPort:serverCoordinationPort["coordinationPort"]}, receivingServerInfo["address"], ()=>{
            socket.write(util.jsonEncode(message));
            socket.destroy();
        } )
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
    
    reply: function(serverId, message) {
        let serverCoordinationPort = getCoordinationPort();
        let receivingServerInfo = getServerInfo(serverId);
        console.log(serverId, message);
        const socket = net.createConnection({port:receivingServerInfo["clientPort"], localPort:serverCoordinationPort}, receivingServerInfo["address"], ()=>{
            socket.write(util.jsonEncode(message));
        });
        return new Promise((resolve, reject) => {
            socket.on('data', (bufObj) => {
                let json = util.jsonDecode(bufObj);
                resolve(json);
                socket.end();
            });

            socket.on('error', (error) => {
                reject(error)
                socket.end();
            });
        });
    }
}