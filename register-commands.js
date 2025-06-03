require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
  {
    name: 'price',
    description: 'Get Pokémon card price data',
    options: [
      {
        name: 'series',
        description: 'Card series',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Base Set', value: 'Base Set' },
          { name: 'Jungle', value: 'Jungle' },
          { name: 'Fossil', value: 'Fossil' },
          { name: 'Team Rocket', value: 'Team Rocket' },
          { name: 'Neo Genesis', value: 'Neo Genesis' },
        ]
      },
      {
        name: 'psa',
        description: 'Is it PSA graded?',
        type: ApplicationCommandOptionType.Boolean,
        required: true
      },
      {
        name: 'psa_grade',
        description: 'PSA grade (1-10)',
        type: ApplicationCommandOptionType.Integer,
        required: false,
        choices: Array.from({ length: 10 }, (_, i) => ({ name: `${i + 1}`, value: i + 1 }))
      },
      {
        name: 'name',
        description: 'Pokémon card name',
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering commands...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
})();