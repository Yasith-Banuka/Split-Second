const {beginElection} = require("./leaderElection");
const {getServerId, getCoordinator} = require('../data/serverDetails');
const {isChatroomIdUsed,addChatroom} = require('../data/globalChatRooms');
const {isClientIdUsed, addClient} = require('../data/globalClients');
const {reply} = require('./serverMessage');
const constants = require('../util/constants')
function getCoordinatorRoomIdApproval(roomId) {
    if(getServerId()===getCoordinator()) {
        let isRoomApproved = !isChatroomIdUsed(roomId);
        if(isRoomApproved) {
            addChatroom(roomId);
        }
        let roomApprovalMsg = {"type" : "roomconfirm", "roomid" : roomId, "roomApproved" : isRoomApproved}
        return roomApprovalMsg;
    }
    let roomRequestMsg = {"type" : "roomrequest", "roomid" : roomId, "serverid" : getServerId()}
    reply(getCoordinator(), roomRequestMsg, constants.T1)
        .then(json => {
            if(json.type === "roomconfirm" && json.roomid === roomId) {
                return json;
            }
            return false;
        })
        .catch(error => beginElection())
};

function getCoordinatorIdentityApproval(identity) {
    if(getServerId() === getCoordinator() ) {
        let isClientApproved = !isClientIdUsed(identity);
        if(isClientApproved) {
            addClient(identity);
        }
        let identityApprovalMsg = {"type" : "clientconfirm", "clientid" : identity, "idapproved" : isClientApproved}
        return identityApprovalMsg;
    }
    let identityRequestMsg = {"type" : "clientrequest", "clientid" : identity, "serverid" : getServerId() }
    reply(getCoordinator() , identityRequestMsg, constants.T1)
        .then(json => {
            if(json.clientid === identity) {
                return json.idApproved;
            }
            return false;
        })
        .catch(error => beginElection())
};

module.exports = {getCoordinatorIdentityApproval, getCoordinatorRoomIdApproval}