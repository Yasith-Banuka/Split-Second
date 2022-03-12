const util = require("../util/util");
const net = require("net");
const {getServerInfo, getCoordinatingServerIds} = require("../data/fellowServerDetails");
const {getCoordinationPort} = require("../data/ownServerDetails");

module.exports = {
    message: function (serverId, message) {

        let OwnServerLocalPort = getCoordinationPort();
        let coordinatingServerInfo = getServerInfo(serverId);
        

        const socket = net.createConnection({port:coordinatingServerInfo["port"], localPort:OwnServerLocalPort["coordinationPort"]}, coordinatingServerInfo["address"], ()=>{
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
    }   
}