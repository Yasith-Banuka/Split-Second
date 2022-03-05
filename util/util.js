module.exports = {

    // todo: this var should change according to the console i/p
    SERVERID: "s1",

    // todo: this var should change according to the console i/p
    SERVERS_CONF: "",

    // Encode json to utf8
    jsonEncode: function (json) {
        let buf = Buffer.from(JSON.stringify(json));
        return buf.toJSON();
    },

    // Decode json from utf8
    jsonDecode: function (bufObj) {
        /*  let json = JSON.parse(bufObj.toString('utf8'));
         return json; */
        let json = JSON.parse(bufObj);
        return json;

    }
}