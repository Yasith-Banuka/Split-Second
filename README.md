This is a distributed chat server system built using Node js. The chat client and the fucntionality to be expected from the server is given at https://github.com/GayashanNA/CS4262_ChatClient

## Running the server

```node app.js "<server id>" "config/serverConfig.txt"```

where server ids can be found in the serverConfig file located under the config directory. Currently, 4 servers are configured. 

## Additional Servers

The format of the serverConfig file is as follows.

```serverid	server_address	clients_port	coordination_port```

Server id uniquely identifies the server, and follows the format "s\<positive integer\>". Clients_port and coordination_port are the ports which clients and other servers connect to, respectively. To configure a new server, simply add a line in the serverConfig file and fill in the details, making sure to follow the naming conventions and that the serverid & ports are unique.
