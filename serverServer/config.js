function getOtherServersConfig(path, serverId){
    let config = require('../'+ path);
    var otherServersConfig = {}

    for (var key of Object.keys(config)) {
        if (key == serverId){
            continue;
        }
        otherServersConfig[key]= config[key]
    }
    return otherServersConfig;
}

function getServerConfig(path, serverId){
    let config = require('../'+ path);
    return config[serverId];
}

function getOtherCoordinationPorts (path, serverId){
    let config = require('../'+ path);
    var otherCoordinationPorts = []

    for (var key of Object.keys(config)) {
        if (key == serverId){
            continue;
        }
        otherCoordinationPorts.push(config[key]["coordinationPort"]) 
    }
    return otherCoordinationPorts;
}

module.exports = {getServerConfig, getOtherServersConfig, getOtherCoordinationPorts}