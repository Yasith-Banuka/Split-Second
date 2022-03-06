module.exports = {

    // todo: this var should change according to the console i/p
    SERVERID: "s1",

    // todo: this var should change according to the console i/p
    SERVERS_CONF: "",

    // Encode json to utf8 string
    jsonEncode: function (json) {
        let encodedJsonString = JSON.stringify(json) + "\n";
        return encodedJsonString;
    },

    // Decode json from utf8
    jsonDecode: function (bufObj) {
        let json = JSON.parse(bufObj);
        return json;

    }
}