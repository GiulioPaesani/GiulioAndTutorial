const Discord = require('discord.js');
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]
})

client.login("token");

client.on("ready", () => {
    console.log("ONLINE");
})

const { createCanvas, loadImage, registerFont } = require("canvas")
registerFont("./font/roboto.ttf", { family: "roboto" })
registerFont("./font/robotoBold.ttf", { family: "robotoBold" })

client.on("guildMemberAdd", async member => {
    //Creare un canvas
    let canvas = await createCanvas(1700, 600) //createCanvas(larghezza, altezza)
    let ctx = await canvas.getContext("2d")

    //Caricare un immagine
    let img = await loadImage("./img/background.png")
    ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2) //drawImage(immagine, posizioneX, posizioneY, larghezza, altezza)


    //Riempire di un colore
    ctx.fillStyle = "rgba(0,0,0,0.30)"
    ctx.fillRect(70, 70, canvas.width - 70 - 70, canvas.height - 70 - 70) //fillReact(posizioneX, posizioneY, larghezza, altezza)

    //Caricare un immagine rotonda
    ctx.save()
    ctx.beginPath()
    ctx.arc(150 + 300 / 2, canvas.height / 2, 150, 0, 2 * Math.PI, false) //arc(centroX, centroY, raggio, startAngolo, endAngolo, sensoOrario/Antiorario)
    ctx.clip()
    img = await loadImage(member.displayAvatarURL({ format: "png" }))
    ctx.drawImage(img, 150, canvas.height / 2 - 300 / 2, 300, 300)
    ctx.restore()

    //Creare le scritte
    ctx.fillStyle = "#fff"
    ctx.textBaseline = "middle"

    ctx.font = "80px roboto" //potete anche inserire sans-serif
    ctx.fillText("Benvenuto/a", 500, 200) //Testo, posizioneX, posizioneY

    ctx.font = "100px robotoBold"
    ctx.fillText(member.user.username.slice(0, 25), 500, canvas.height / 2)

    ctx.font = "50px roboto"
    ctx.fillText(`${member.guild.memberCount}° membro`, 500, 400)

    //Mandare un canvas
    let channel = client.channels.cache.get("idCanale")

    let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "canvas.png")

    channel.send({ files: [attachment] })

    let embed = new Discord.MessageEmbed()
        .setTitle("Benvenuto")
        .setThumbnail("attachment://canvas.png")

    channel.send({ embeds: [embed], files: [attachment] })
})