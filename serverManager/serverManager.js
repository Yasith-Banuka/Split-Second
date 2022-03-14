module.exports = {
    serverManager: function (socket, json) {
        switch (json["type"]) {
            case "newidentity": 
                // Check the uniqueness of the identity with coordinator
                // newidentity(socket, json["identity"]);
                break;
            case "newchatroom":
                // Check the uniqueness of the room id with coordinator
                // code block
                break;
            case "joinroom":
                // code block
                break;
            case "bully":
               // code block
                break;
            case "heartbeat":
                // code block
                break;
            case "suspectfailed":
                // code block
                break;
            default:
                console.log(`\nERROR: Message received from server is wrong.\nPlease check and try again\n` + JSON.stringify(json));
        }
    }
}
