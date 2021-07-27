
const Discord = require('discord.js');
const client = new Discord.Client();

const disbut = require("discord-buttons")
disbut(client);

const { MessageButton, MessageActionRow } = require("discord-buttons")
const { MessageMenuOption, MessageMenu } = require("discord-buttons")

client.login("token");

client.on("message", message => {
    if (message.content == "!bottoni") {
        var button1 = new MessageButton()
            .setLabel("Cliccami")
            .setStyle("url")
            .setURL("https://www.google.it")
        var button2 = new MessageButton()
            .setLabel("Ciao")
            .setStyle("green")
            .setID("ciao")

        var row = new MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)

        var embed = new Discord.MessageEmbed()
            .setTitle("Bottoni")
            .setDescription("Clicca sul bottone")

        message.channel.send(embed, row)
    }

    if (message.content == "!menu") {
        var option1 = new MessageMenuOption()
            .setLabel("Opzione 1")
            .setDescription("Questa è la prima opzione")
            .setValue("opzione1")
            .setEmoji("😀")

        var option2 = new MessageMenuOption()
            .setLabel("Opzione 2")
            .setDescription("Questa è la seconda opzione")
            .setValue("opzione2")
            .setEmoji("🤑")

        var menu = new MessageMenu()
            .setPlaceholder("Seleziona un elemento")
            .setID("menu")
            .setMinValues(1)
            .setMaxValues(2)
            .addOption(option1)
            .addOption(option2)


        message.channel.send("Clicca sul menu", menu)
    }
})

client.on("clickButton", (button) => {
    if (button.id == "ciao") {
        button.reply.send("Ciao anche a te!", true)
    }
})

client.on("clickMenu", (menu) => {
    if (menu.id == "menu") {
        menu.reply.defer()
        //Se si ha solo un opzione da selezionare
        if (menu.values[0] == "opzione1")
            menu.message.channel.send("Opzione 1")
        if (menu.values[0] == "opzione2")
            menu.message.channel.send("Opzione 2")
        //Se si hanno piu opzioni da selezionare
        if (menu.values.includes("opzione1"))
            menu.message.channel.send("opzione 1")
        if (menu.values.includes("opzione2"))
            menu.message.channel.send("opzione 2")
    }
})