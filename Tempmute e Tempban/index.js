const Discord = require('discord.js');
const client = new Discord.Client();

const mysql = require("mysql")
const ms = require("ms")

client.login("token");

var con = mysql.createPool({ //Connessione database Heroku
        connectionLimit: 1000,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
        host: 'eu-cdbr-west-03.cleardb.net',
        port: 3306,
        user: 'username',
        password: "password",
        database: 'database',
        charset: 'utf8mb4'
})


client.on("message", message => {
        con.query("SELECT * FROM serverstats", async (err, result) => {
                var tempmute = JSON.parse(result[0].tempmute)
                var tempban = JSON.parse(result[0].tempban)

                if (message.content.startsWith("!tempmute")) {
                        if (!message.member.hasPermission("MUTE_MEMBERS")) {
                                message.channel.send("Non hai il permesso");
                                return
                        }

                        var utente = message.mentions.members.first();
                        if (!utente) {
                                message.channel.send("Utente non valido");
                                return
                        }

                        var ruolo = message.guild.roles.cache.find(role => role.name == "Muted");
                        if (!ruolo) {
                                ruolo = await message.guild.roles.create({
                                        data: {
                                                name: "Muted",
                                                position: 1
                                        }
                                })
                        }
                        ruolo = message.guild.roles.cache.find(role => role.name == "Muted");

                        message.guild.channels.cache.forEach((canale) => {
                                canale.updateOverwrite(ruolo, {
                                        SEND_MESSAGES: false,
                                        ADD_REACTIONS: false,
                                        SPEAK: false 
                                })

                        })

                        if (tempmute.hasOwnProperty(utente.user.id) || utente.roles.cache.has(ruolo)) {
                                message.channel.send("Questo utente è gia mutato")
                                return
                        }

                        var args = message.content.split(/\s+/);
                        var time = args[2];
                        if (!time) {
                                message.channel.send("Inserire un tempo")
                                return
                        }

                        time = ms(time);

                        if (!time) {
                                message.channel.send("Inserire un tempo valido")
                                return
                        }

                        var reason = args.splice(3).join(" ");
                        if (!reason) {
                                reason = "Nessun motivo"
                        }

                        if (utente.hasPermission("ADMINISTRATOR")) {
                                message.channel.send("Non puoi mutare questo utente")
                                return
                        }

                        utente.roles.add(ruolo)

                        tempmute[utente.user.id] = {
                                "time": time / 1000,
                                "reason": reason
                        }

                        message.channel.send(utente.toString() + " è stato mutato\rTime: " + ms(time, { long: true }) + "\rReason: " + reason)

                        con.query("UPDATE serverstats SET tempmute = '" + JSON.stringify(tempmute) + "'")
                }

                if (message.content.startsWith("!tempban")) {
                        if (!message.member.hasPermission("BAN_MEMBERS")) {
                                message.channel.send("Non hai il permesso");
                                return
                        }

                        var utente = message.mentions.members.first();
                        if (!utente) {
                                message.channel.send("Utente non valido");
                                return
                        }

                        if (tempban.hasOwnProperty(utente.user.id)) {
                                message.channel.send("Questo utente è già bannato")
                                return
                        }

                        var args = message.content.split(/\s+/);
                        var time = args[2];
                        if (!time) {
                                message.channel.send("Inserire un tempo")
                                return
                        }

                        time = ms(time);

                        if (!time) {
                                message.channel.send("Inserire un tempo valido")
                                return
                        }

                        var reason = args.splice(3).join(" ");
                        if (!reason) {
                                reason = "Nessun motivo"
                        }

                        if (utente.hasPermission("ADMINISTRATOR")) {
                                message.channel.send("Non puoi bannare questo utente")
                                return
                        }

                        utente.ban({ reason: reason })

                        tempban[utente.user.id] = {
                                "time": time / 1000,
                                "reason": reason
                        }

                        message.channel.send(utente.toString() + " è stato bannato\rTime: " + ms(time, { long: true }) + "\rReason: " + reason)

                        con.query("UPDATE serverstats SET tempban = '" + JSON.stringify(tempban) + "'")
                }
        })
})

setInterval(function () {
        con.query("SELECT * FROM serverstats", (err, result) => {
                var tempmute = JSON.parse(result[0].tempmute)
                var tempban = JSON.parse(result[0].tempban)

                for (var i = 0; i < Object.keys(tempmute).length; i++) {

                        tempmute[Object.keys(tempmute)[i]].time = tempmute[Object.keys(tempmute)[i]].time - 5;

                        if (tempmute[Object.keys(tempmute)[i]].time <= 0) {
                                var server = client.guilds.cache.get("idServer") //<--- INSERIRE ID DEL SERVER

                                try {
                                        var utente = server.members.cache.find(x => x.id = Object.keys(tempmute)[i]);
                                        var ruolo = server.roles.cache.find(role => role.name == "Muted");
                                        utente.roles.remove(ruolo)
                                        delete tempmute[Object.keys(tempmute)[i]]
                                }
                                catch {
                                        delete tempmute[Object.keys(tempmute)[i]]
                                }

                        }
                }

                for (var i = 0; i < Object.keys(tempban).length; i++) {

                        tempban[Object.keys(tempban)[i]].time = tempban[Object.keys(tempban)[i]].time - 5;

                        if (tempban[Object.keys(tempban)[i]].time <= 0) {
                                var server = client.guilds.cache.get("idServer") //<--- INSERIRE ID DEL SERVER

                                server.members.unban(Object.keys(tempban)[i])

                                delete tempban[Object.keys(tempban)[i]]

                        }
                }

                con.query("UPDATE serverstats SET tempmute = '" + JSON.stringify(tempmute) + "', tempban = '" + JSON.stringify(tempban) + "'");
        })
}, 5000)
