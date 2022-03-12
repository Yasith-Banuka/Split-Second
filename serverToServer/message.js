const util = require("../util/util");
const net = require("net");
const {getServerInfo, getCoordinatingServerIds} = require("../data/fellowServerDetails");
const {getCoordinationPort} = require("../data/ownServerDetails");

module.exports = {
    message: function (serverId, message) {

        let serverCoordinationPort = getCoordinationPort();
        let receivingServerInfo = getServerInfo(serverId);
        

        const socket = net.createConnection({port:receivingServerInfo["port"], localPort:serverCoordinationPort["coordinationPort"]}, receivingServerInfo["address"], ()=>{
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
        const socket = net.createConnection({port:coordinatingServerInfo["port"], localPort:OwnServerLocalPort["coordinationPort"]}, coordinatingServerInfo["address"], ()=>{
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