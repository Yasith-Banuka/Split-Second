const {beginElection} = require("./leaderElection");

function getCoordinatorRoomIdApproval(roomId) {
    if(getServerId===getCoordinator) {
        let roomApprovalMsg = {"type" : "roomconfirm", "roomid" : roomId, "roomApproved" : !isChatroomIdUsed(roomId)}
        return roomApprovalMsg;
    }
    let roomRequestMsg = {"type" : "roomrequest", "roomid" : roomId, "serverid" : getServerId}
    reply(getCoordinator, roomRequestMsg)
        .then(json => {
            if(json.type === "roomconfirm" && json.roomid === roomId) {
                return json;
            }
            return false;
        })
        .catch(error => beginElection())
};

function getCoordinatorIdentityApproval(identity) {
    if(getServerId===getCoordinator) {
        let identityApprovalMsg = {"type" : "clientconfirm", "clientid" : identity, "idapproved" : !isClientIdUsed(identity)}
        return identityApprovalMsg;
    }
    let identityRequestMsg = {"type" : "clientrequest", "clientid" : identity, "serverid" : getServerId}
    reply(getCoordinator, identityRequestMsg)
        .then(json => {
            if(json.clientid === identity) {
                return json.idApproved;
            }
            return false;
        })
        .catch(error => beginElection())
};

module.exports = {getCoordinatorIdentityApproval, getCoordinatorRoomIdApproval}