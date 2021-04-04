const Discord = require('discord.js');
const client = new Discord.Client();
const mysql = require("mysql") //npm install mysql

client.login("token");

client.on("ready", () => {
        console.log("ONLINE")
})

var con = mysql.createPool({ //Connessione database Heroku
        connectionLimit: 1000,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
        host: 'eu-cdbr-west-03.cleardb.net',
        port: 3306,
        user: 'usernmame',
        password: "password",
        database: 'database',
        charset: 'utf8mb4'
})

client.on("message", message => {
        if (message.author.bot) return
        if (message.channel.type == "dm") return

        con.query("SELECT * FROM userstats", (err, result) => {
                var userstatsList = result;

                if (message.content.startsWith("!rank")) {
                        if (message.content == "!rank") {
                                var utente = message.member;
                        }
                        else {
                                var utente = message.mentions.members.first()
                        }

                        if (!utente) {
                                message.channel.send("Utente non valido")
                                return
                        }


                        var index = userstatsList.findIndex(x => x.id == utente.id);
                        if (index < 0) {
                                message.channel.send("Questo utente non ha esperienza")
                                return
                        }
                        var userstats = userstatsList[index]

                        var progress = "";
                        var nProgress = parseInt(5 * (userstats.xp - calcoloXpNecessario(userstats.level)) / (calcoloXpNecessario(userstats.level + 1) - calcoloXpNecessario(userstats.level)))
                        for (var i = 0; i < nProgress; i++) {
                                progress += ":white_medium_small_square:";
                        }
                        for (var i = 0; i < 5 - nProgress; i++) {
                                progress += ":white_small_square:";
                        }


                        var embed = new Discord.MessageEmbed()
                                .setTitle(utente.user.tag)
                                .setDescription("Il livello di questo utente")
                                .setThumbnail(utente.user.avatarURL())
                                .addField("Level " + userstats.level, progress)

                        message.channel.send(embed)
                }

                if (message.content == "!leaderboard") {
                        var leaderboardList = userstatsList.sort((a, b) => (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0))

                        var leaderboard = ""
                        for (var i = 0; i < 10; i++) {
                                if (leaderboardList.length - 1 < i) {
                                        break
                                }
                                leaderboard += `**#${i + 1}** ${leaderboardList[i].username} - Level ${leaderboardList[i].level}\r`
                        }

                        var embed = new Discord.MessageEmbed()
                                .setTitle("Leaderboard")
                                .addField("Classifica livelli", leaderboard)

                        message.channel.send(embed)
                }

                var index = userstatsList.findIndex(x => x.id == message.author.id);
                if (index < 0) {
                        index = userstatsList.lenght;

                        userstatsList[index] = {
                                id: message.author.id,
                                username: message.member.user.tag,
                                xp: 0,
                                level: 0,
                                cooldownXp: 0
                        }

                        con.query(`INSERT INTO userstats VALUES ('${message.author.id}', '${message.member.user.tag}', 0, 0, 0)`)
                }

                var userstats = userstatsList[index]

                if (userstats.cooldownXp <= 0) {
                        userstats.cooldownXp = 60;
                        var xp = Math.floor(Math.random() * (40 - 15 + 1)) + 15;
                        userstats.xp += xp

                        if (userstats.xp >= calcoloXpNecessario(userstats.level + 1)) {
                                userstats.level++;

                                var canale = client.channels.cache.get("804688929109966848");
                                canale.send(`${message.author.toString()} hai raggiunto il livello ${userstats.level}`)
                        }

                        con.query(`UPDATE userstats SET level = ${userstats.level}, xp = ${userstats.xp}, cooldownXp = ${userstats.cooldownXp} WHERE id = ${userstats.id}`)
                }
        })
})

function calcoloXpNecessario(level) {
        var xpNecessarioFinoA10 = [0, 70, 250, 370, 550, 840, 1200, 1950, 2500, 3000, 3900]

        if (level < 10) {
                return xpNecessarioFinoA10[level]
        }
        else {
                return level * level * 50
        }
}

setInterval(function () {
        con.query("SELECT * FROM userstats", (err, result) => {
                var userstatsList = result;

                userstatsList.forEach(userstats => {
                        if (userstats.cooldownXp > 0) {
                                userstats.cooldownXp -= 5

                                con.query(`UPDATE userstats SET cooldownXp = ${userstats.cooldownXp} WHERE id = ${userstats.id}`)
                        }
                })
        })
}, 5000)