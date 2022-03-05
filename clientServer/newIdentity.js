module.exports = {
    newidentity: function (socket, identity) {
        let regEx = new RegExp('^[a-z][a-z0-9]{2,16}$', 'i');

        let obj = { "type": "newidentity", "approved": "true" };
        let buf = Buffer.from(JSON.stringify(obj));
        console.log(JSON.stringify(buf.toJSON()));

        if (regEx.test(identity)) {
            socket.sendMessage({ "type": "newidentity", "approved": "true" });
        } else {
            socket.sendMessage({ "type": "newidentity", "approved": "false" });
        }
    }

}

/* function newidentity(socket, identity) {
    let regEx = new RegExp('^[a-z][a-z0-9]{2,16}$', 'i');

    let obj = { "type": "newidentity", "approved": "true" };
    let buf = Buffer.from(JSON.stringify(obj));
    console.log(JSON.stringify(buf.toJSON()));

    if (regEx.test(identity)) {
        socket.sendMessage({ "type": "newidentity", "approved": "true" });
    } else {
        socket.sendMessage({ "type": "newidentity", "approved": "false" });
    }
} */
