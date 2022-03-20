module.exports = {

    // Encode json to utf8 string
    jsonEncode: function (json) {
        let encodedJsonString = JSON.stringify(json) + "\n";
        return encodedJsonString;
    },

    // Decode json from utf8
    jsonDecode: function (bufObj) {
        let json = JSON.parse(bufObj);
        return json;
    },

    // broadcast the given json to the given client list
    broadcast: function (clientList, json) {
        let arrayLength = clientList.length;
        for (var i = 0; i < arrayLength; i++) {
            clientList[i].socket.write(this.jsonEncode(json));
        }
    },

    // check the string alphanumeric string starting with an upper or lower case character and 
    // the length is least 3 characters and no more than 16 characters long.
    checkAlphaNumeric: function (string) {
        let regEx = new RegExp('^[a-z][a-z0-9]{2,16}$', 'i');
        return regEx.test(string);
    }
}