require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const snipes = new Map();

client.on('messageDelete', (message) => {
    if (!message.partial) {
        snipes.set(message.channel.id, {
            content: message.content,
            author: message.author.tag,
            timestamp: message.createdAt
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'snipe') {
        const snipe = snipes.get(interaction.channelId);

        if (!snipe) {
            return interaction.reply({ content: '❌ No deleted messages found!', ephemeral: true });
        }

        await interaction.reply({
            content: `🕵️ **Snipe Result:**  
            **Message:** ${snipe.content}  
            **Author:** ${snipe.author}  
            **Time:** <t:${Math.floor(snipe.timestamp / 1000)}:R>`,
            ephemeral: false
        });
    }
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);
