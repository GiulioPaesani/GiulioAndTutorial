const Discord = require('discord.js');

module.exports = {
    name: "test",
    description: "Comando di test",
    execute(message, args) {
        message.channel.send("TEST");
    }
}