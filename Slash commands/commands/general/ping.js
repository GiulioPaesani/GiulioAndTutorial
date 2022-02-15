module.exports = {
    name: "ping",
    data: {
        name: "ping",
        description: "Comando di test"
    },
    execute(interaction) {
        var embed = new Discord.MessageEmbed()
            .setTitle("Pong")
        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}