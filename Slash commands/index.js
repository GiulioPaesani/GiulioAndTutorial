global.Discord = require('discord.js');
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_INTEGRATIONS"] //Importante - Inserire "GUILD_INTEGRATIONS" tra gli intents
})

client.login("token");

client.on("ready", () => {
    console.log("ONLINE");

    client.guilds.cache.forEach(guild => {
        guild.commands.create({
            name: "ping",
            description: "Comando di test"
        })

        guild.commands.create({
            name: "kick",
            description: "Espellere un utente",
            options: [
                {
                    name: "user",
                    description: "L'utente da espellere",
                    type: "USER",
                    required: true
                },
                {
                    name: "reason",
                    description: "Motivazione",
                    type: "STRING",
                    required: false
                }
            ]
        })
    })
})

client.on("interactionCreate", interaction => {
    if (!interaction.isCommand()) return

    if (interaction.commandName == "ping") {
        var embed = new Discord.MessageEmbed()
            .setTitle("Pong")
        interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if (interaction.commandName == "kick") {
        if (!interaction.member.permissions.has("KICK_MEMBERS")) {
            return interaction.reply({ content: "Non hai il permesso", ephemeral: true })
        }

        var utente = interaction.options.getUser("user")
        var reason = interaction.options.getString("reason") || "Nessun motivo"

        var member = interaction.guild.members.cache.get(utente.id)
        if (!member?.kickable) {
            return interaction.reply({ content: "Non posso kickare questo utente", ephemeral: true })
        }

        member.kick()

        var embed = new Discord.MessageEmbed()
            .setTitle("Utente kickato")
            .setThumbnail(utente.displayAvatarURL())
            .addField("User", utente.toString())
            .addField("Reason", reason)

        interaction.reply({ embeds: [embed] })
    }
})


//Module export
const fs = require("fs")
client.commands = new Discord.Collection()

const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandsFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

client.on("ready", () => {
    client.guilds.cache.forEach(guild => {
        client.commands.forEach(command => {
            guild.commands.create(command.data)
        })
    })
})

client.on("interactionCreate", interaction => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    command.execute(interaction)
})
