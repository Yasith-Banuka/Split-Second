const { newidentity } = require("./newIdentity");

module.exports = {
    clientServer: function (socket, json) {
        switch (json["type"]) {
            case "newidentity":
                newidentity(socket, json["identity"]);
                break;
            case "list":
                // code block
                break;
            case "who":
                // code block
                break;
            case "createroom":
                // code block
                break;
            case "joinroom":
                // code block
                break;
            case "message":
                // code block
                break;
            case "quit":
                // code block
                break;
            default:
                console.log(`\nERROR: Message received from client is wrong.\nPlease check and try again\n` + JSON.stringify(json));
        }
    }
}

/* function clientServer(socket, json) {
    switch (json["type"]) {
        case "newidentity":
            newidentity(socket, json["identity"]);
            break;
        case "list":
            // code block
            break;
        case "who":
            // code block
            break;
        case "createroom":
            // code block
            break;
        case "joinroom":
            // code block
            break;
        case "message":
            // code block
            break;
        case "quit":
            // code block
            break;
        default:
            console.log(`\nERROR: Message received from client is wrong.\nPlease check and try again\n` + JSON.stringify(json));
    }
} */