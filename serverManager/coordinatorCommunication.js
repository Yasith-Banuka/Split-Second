const {beginElection} = require("./leaderElection");
const {isCoordinator} = require('../data/serverDetails');
const {isChatroomIdUsed,addChatroom} = require('../data/globalChatRooms');
const {isClientIdUsed, addClient} = require('../data/globalClients');
const {reply} = require('./serverMessage');
const constants = require('../util/constants')
function getCoordinatorRoomIdApproval(roomId, serverId) {
    if(isCoordinator) {
        let isRoomApproved = !isChatroomIdUsed(roomId);
        if(isRoomApproved) {
            addChatroom(serverId, roomId);
        }
        let roomApprovalMsg = {"type" : "roomconfirm", "roomid" : roomId, "roomapproved" : isRoomApproved}
        return roomApprovalMsg;
    }
    let roomRequestMsg = {"type" : "roomrequest", "roomid" : roomId, "serverid" : serverId}
    reply(getCoordinator(), roomRequestMsg, constants.T1)
        .then(json => {
            if(json.type === "roomconfirm" && json.roomid === roomId) {
                return json.roomapproved;
            }
            return false;
        })
        .catch(error => {
            beginElection();
            return false;
        })
};

function getCoordinatorIdentityApproval(identity, serverId) {
    if(isCoordinator) {
        let isClientApproved = !isClientIdUsed(identity);
        if(isClientApproved) {
            addClient(identity);
        }
        let identityApprovalMsg = {"type" : "clientconfirm", "clientid" : identity, "idapproved" : isClientApproved}
        return identityApprovalMsg;
    }
    let identityRequestMsg = {"type" : "clientrequest", "clientid" : identity, "serverid" : serverId }
    reply(getCoordinator() , identityRequestMsg, constants.T1)
        .then(json => {
            if(json.type === "clientconfirm" && json.clientid === identity) {
                return json.idapproved;
            }
            return false;
        })
        .catch(error => {
            beginElection();
            return false;
        })
};

module.exports = {getCoordinatorIdentityApproval, getCoordinatorRoomIdApproval}