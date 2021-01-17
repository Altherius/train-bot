require('dotenv').config();

const Discord = require('discord.js');
const trainBot = new Discord.Client();
const request = require('request');
const departs = require('./commands/departs');


const commands = [departs];

trainBot.on('ready', () => console.info('TrainBot has booted up!'));
trainBot.on('message', (message) => {
    if (message.author.id === trainBot.user.id) {
        return;
    }

    commands.some(function(command) {
        return command.parse(message);
    });
});

trainBot.login(process.env.KEY)
    .then(() => console.info('TrainBot logged in to server.'))
    .catch(console.error);