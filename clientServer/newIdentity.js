const util = require("../util/util");

module.exports = {
    newidentity: function (socket, identity) {
        let regEx = new RegExp('^[a-z][a-z0-9]{2,16}$', 'i');

        let obj = { "type": "newidentity", "approved": "true" };
        let buf = util.jsonEncode(obj);
        console.log(JSON.stringify(buf));

        if (regEx.test(identity)) {
            socket.sendMessage(buf);
        } else {
            obj = { "type": "newidentity", "approved": "false" };
            buf = util.jsonEncode(obj);
            socket.sendMessage(buf);
        }
    }

}
