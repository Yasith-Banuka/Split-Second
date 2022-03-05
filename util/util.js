module.exports = {
    // Encode json to utf8
    jsonEncode: function (json) {
        let buf = Buffer.from(JSON.stringify(json));
        return buf.toJSON();
    },

    // Decode json from utf8
    jsonDecode: function (bufObj) {
        let json = JSON.parse(bufObj.toString('utf8'));
        return json;
    }
}