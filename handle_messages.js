var {mesaj_log} = require("./log_messages")
var {clientId} = require("./config.json")
const fs = require("fs")



async function handle_message(message, client, debug){
    var msg = message.content
    /*
    TODO
    */
    mesaj_log(message, client)
}

module.exports = {handle_message}