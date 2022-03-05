/* import Heap from 'heap-js';

var constants = require('./constants');


const answers = new Heap();
const begin_election_timeout;
var begin_election = () => {
    //send election msgs to all servers with higher priority
    begin_election_timeout = setTimeout(() => {
         
        if(answers.length()>0) {  //if answer array not empty, pick highest priority and send nomination msg and wait for coordinator for T3
            send_nomination();
        } else {  //else, send coordinator msgs to all procersses wih lower priority
            send_coordinator();
        }

    }, constants.T2);
}

var send_election = () => {
    
}

var receive_election = () => {
    //if the priority of server that sent the msg is lower, send answer msg
    
}

var send_answer = () => {

}

var receive_answer = () => {
    //add to answer array
}

var send_coordinator = () => {
    //to all servers with lower priority

    
    

}

var receive_coordinator = () => {
    // if sender has higher priority, set sender as new coordinator
}
const send_nomination_timeout;
var send_nomination = () => {
    if(answers.length()>0) { //if answer array not empty, pick highest priority and send nomination msg and wait for coordinator for T3
        const coordinator = answers.pop();
        send_nomination_timeout = setTimeout(send_nomination, constants.T3)  //repeat every T3 until coordinator msg received
    } else { //else restart election
        begin_election();
    }
    
}

var receive_nomination = () => {
    //send_coordinator
}

var send_iamup = () => {

}

var receive_iamup = () => {
    //send_view
}

var send_view = () => {

}

var receive_view = () => {
    //compare with current and update
}
 */