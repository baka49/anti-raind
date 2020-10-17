const Discord = require('discord.js');
const Token = require("./Token.json");
const fs = require("fs");
const bdd = require("./bdd.json");
const { fstat } = require('fs');

const bot = new Discord.Client();

// Conection
bot.on("ready", async () => {
    console.log("Le bot est connectez")
    bot.user.setStatus("dnd");
    setTimeout(() => {
        bot.user.setActivity("?help")
    }, 100)
});

// bienvenu/donnez le role member
bot.on("guildMemberAdd", member => {
    if (bdd["message-bienvenue"]) {
        bot.channels.cache.get('767055526533136404').send(bdd["message-bienvenue"]);
    }
    else {
        bot.channels.cache.get('767055526533136404').send(`Bienvenue sur le serveur!`);
    }
    member.roles.add('766788312933335041');

})

bot.on('message', message => {
    // clear command
    if (message.content.startsWith("?clear")) {
        message.delete();
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            let args = message.content.trim().split(/ +/g);

            if (args[1]) {
                if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99) {

                    message.channel.bulkDelete(args[1])
                    message.channel.send(`Vous avez supperié ${args[1]} message(s)`)
                }
            }
            else {
                message.channel.send(`Vous devez indiquez une valeur entre 1 et 99 !`)
            }
        }
        else {
            message.channel.send(`Vous devez avoir la permision Pour suprimé les message !`)
        }

    }
    //motifié le message de bienveneu command
    if (message.content.startsWith("?mb")) {
        message.delete()
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            if (message.content.length > 5) {
                message_bienvenue = message.content.slice(4)
                console.log(message_bienvenue)
                bdd["message-bienvenue"] = message_bienvenue
                Savebdd()

            }
        }
    }


    // warn command
    if (message.content.startsWith("?warn")) {
        if (message.member.hasPermission('BAN_MEMBERS')) {

            if (!message.mentions.users.first()) return;

            utilisateur = message.mentions.users.first().id

            if (bdd["warn"][utilisateur] == 2) {

                delete bdd["warn"][utilisateur]
                message.guild.members.ban(utilisateur)

            }
            else {
                if (!bdd["warn"][utilisateur]) {
                    bdd["warn"][utilisateur] = 1
                    Savebdd();
                    message.channel.send("Tu es a présent  " + bdd["warn"][utilisateur] + " avertissements");

                }
                else {
                    bdd["warn"][utilisateur]++
                    Savebdd();
                    message.channel.send("Tu es a présent  " + bdd["warn"][utilisateur] + " avertissements");

                }
            }


        }

    }
    //stats command
    if (message.content.startsWith("?stats")) {
        let onlines = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
        let totalmembers = message.guild.members.cache.size;
        let totalservers = bot.guilds.cache.size;
        let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;
        let totalrole = message.guild.roles.cache.get('766788312933335041').members.map(member => member.user.tag).length;



        const statsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Stats')
            .setAuthor('Anti-Raid#0361')
            .setDescription('voici les statistiques du serveur')
            .setThumbnail('https://i.imgur.com/tEf5upW.jpg')
            .addFields(
                { name: 'Nombre de membres total', value: totalmembers, inline: true },
                { name: 'Membres connéctés', value: onlines, inline: true },
                { name: 'Nombre de serveur auquel le bot a rejoin', value: totalservers, inline: true },
                { name: 'Nombre de bot sur le serveur', value: totalbots, inline: true },
                { name: 'Nombre de Membre(role)', value: totalrole, inline: true },
            )
            .setImage('https://i.imgur.com/tEf5upW.jpg')
            .setTimestamp()
            .setFooter('The bot made by baka49#0989');

        message.channel.send(statsEmbed);

    }
    if (message.content.startsWith("?help")) {

        const helpEmbed = new Discord.MessageEmbed()
            .setColor(0x32a834)
            .setTitle('Help')
            .setDescription('```?warn(Mod)```                                                                                                                                                                                                                                ```?clear(mod)```                                                                                                                                                                                                                                ```?stats```                                                                                                                                                                                                                               ```?mb(MOD, modifier le message de bivenue)```')
            .setThumbnail('https://i.imgur.com/dJVip1T.jpg')
            .setImage('https://i.imgur.com/dJVip1T.jpg')
            .setAuthor(message.author.username)
            .setThumbnail(message.author.avatarURL)
            .setFooter('The bot made by baka49#0989')
            .setTimestamp()

        message.reply(helpEmbed);

    }
})


function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
}

bot.login(Token.token);