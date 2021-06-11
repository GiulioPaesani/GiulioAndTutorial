const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] }); //<-- IMPORTANTISSIMO!!

client.login("Token");

client.on("ready", () => {
    console.log("ONLINE");
})


//---- 1° METODO ----
client.on("message", message => {
    if (message.content == "!comando") {
        var embed = new Discord.MessageEmbed() //Crea il tuo embed o messaggio normale
            .setTitle("Reaction roles")
            .setDescription("Clicca sulle reazioni per ottenere i ruoli")

        message.channel.send(embed)
            .then(msg => {
                //Inserire tutte le reazioni che si vogliono
                msg.react("🤟")
                msg.react("🖐️")
            })
    }
})
//Quando viene cliccata una reazione
client.on("messageReactionAdd", async function (messageReaction, user) {
    if (user.bot) return //Le reaction dei bot verranno escluse

    if (messageReaction.message.partial) await messageReaction.message.fetch();

    if (messageReaction.message.id == "idMessaggio") { //Settare id messaggio
        if (messageReaction._emoji.name == "🤟") {
            var utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
            utente.roles.add("idRuolo1"); //Settare ruolo
        }
        if (messageReaction._emoji.name == "🖐️") {
            var utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
            utente.roles.add("idRuolo2");
        }
    }
})
//Quando viene rimossa una reazione
client.on("messageReactionRemove", async function (messageReaction, user) {
    if (user.bot) return

    if (messageReaction.message.partial) await messageReaction.message.fetch();

    if (messageReaction.message.id == "idMessaggio") {
        if (messageReaction._emoji.name == "🤟") {
            var utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
            utente.roles.remove("idRuolo1");
        }
        if (messageReaction._emoji.name == "🖐️") {
            var utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
            utente.roles.remove("idRuolo2");
        }
    }
})

//---- 1° METODO ----
client.on("message", message => {
    if (message.content == "!ruoli") {
        var embed = new Discord.MessageEmbed() //Crea il tuo embed o messaggio normale
            .setTitle("Reaction roles")
            .setDescription("Clicca sulle reazione per ottenere i ruoli")

        message.channel.send(embed)
            .then(msg => {
                //Inserire tutte le reazioni che si vogliono
                msg.react("🤟")
                msg.react("🖐️")
                    .then(r => {
                        //Filtri
                        const filter1 = (reaction, user) => reaction.emoji.name == "🤟" && user.id == message.author.id; // user.id == message.author.id; è opzionale
                        const filter2 = (reaction, user) => reaction.emoji.name == "🖐️" && user.id == message.author.id;

                        const reaction1 = msg.createReactionCollector(filter1, { dispose: true, time: 20000 }) // time: 20000 è opzionale
                        const reaction2 = msg.createReactionCollector(filter2, { dispose: true, time: 20000 })

                        //Quando viene cliccata una reazione
                        reaction1.on("collect", (r, u) => {
                            var utente = message.guild.members.cache.find(x => x.id == u.id);
                            utente.roles.add("idRuolo1")
                        })
                        reaction2.on("collect", (r, u) => {
                            var utente = message.guild.members.cache.find(x => x.id == u.id);
                            utente.roles.add("idRuolo2")
                        })

                        //Quando viene rimossa una reazione
                        reaction1.on("remove", (r, u) => {
                            var utente = message.guild.members.cache.find(x => x.id == u.id);
                            utente.roles.remove("idRuolo1")
                        })
                        reaction2.on("remove", (r, u) => {
                            var utente = message.guild.members.cache.find(x => x.id == u.id);
                            utente.roles.remove("idRuolo2")
                        })

                        //Quando termina il tempo (basta metterlo a una sola reazione e non a tutte)
                        reaction2.on("end", (r, u) => {
                            message.channel.send("Tempo scaduto!!")
                        })
                    })
            })
    }
})