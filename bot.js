// File: src/bot.js
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();
const { getAverageEbayPrice } = require('./ebay');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'price') {
    await interaction.deferReply();
    const query = interaction.options.getString('query');
    const avg = await getAverageEbayPrice(query);
    await interaction.editReply(`Average price for **${query}**: $${avg}`);
  }
});

client.login(process.env.DISCORD_TOKEN);

// Register the slash command
const commands = [
  new SlashCommandBuilder()
    .setName('price')
    .setDescription('Get average eBay price for a Pokémon card')
    .addStringOption(opt =>
      opt.setName('query').setDescription('Card keywords').setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
