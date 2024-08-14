const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const token = '7252569512:AAHTqOgPLqgvcoigvTY8qz8i8PXZFgMsHJw';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `I'll guess a number from 0 to 10, you have to guess`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Let's guess", gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Initial congratulation'},
        {command: '/info', description: 'Get info about user'},
        {command: '/game', description: 'game - guess a number'},
    ])

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, `https://tlgrm.eu/_/stickers/91c/7e8/91c7e8ba-71bf-4dcb-95ff-6c4f434ec4c7/1.jpg`);
            return bot.sendMessage(chatId, `You are welcom to telegram bot`);
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `You name is ${msg.from.first_name}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, "I don't understand you, try again")

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Congratulation, you guessed`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Sorry, you guessed wrong`)
        }

    })
}

start();