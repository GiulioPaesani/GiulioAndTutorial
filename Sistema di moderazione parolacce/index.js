const Discord = require('discord.js');
const client = new Discord.Client(
    { intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"] }
)

client.login("token");

client.on("ready", () => {
    console.log("Bot ONLINE");
})

client.on("messageCreate", message => {
    if (message.member.roles.cache.has("idRuolo1") || message.member.roles.cache.has("idRuolo2")) return

    var parolacce = ["sedia", "lampada", "ciao come va"]
    var trovata = false;
    var testo = message.content;

    parolacce.forEach(parola => {
        if (message.content.includes(parola)) {
            trovata = true;
            testo = testo.replace(eval(`/${parola}/g`), "###");
        }
    })

    if (trovata) {
        message.delete();
        var embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setDescription("Hai scritto un messaggio con parole bloccate\rIl tuo messaggio: " + testo)

        message.channel.send({ embeds: [embed] })
    }
})