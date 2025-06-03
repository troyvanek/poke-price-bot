# PokePriceBotBeta

PokePriceBot is a Discord bot designed to fetch and analyze Pokémon card prices from eBay, using slash commands with smart filters and interactive options.

## Features

* Discord Slash Commands
* eBay API integration (OAuth & Browse API)
* Price analytics from last 4 sold items
* PSA grading filter (1-10)
* Autocomplete for top-selling cards
* Dockerized for easy deployment

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/poke-price-bot.git
cd poke-price-bot
```

### 2. Create `.env` File

Create a `.env` file with the following:

```env
DISCORD_TOKEN=your_discord_token
CLIENT_ID=your_discord_client_id
EBAY_APP_ID=your_ebay_app_id
EBAY_OAUTH_TOKEN=your_ebay_oauth_token
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Bot (Locally)

```bash
node bot.js
```

### 5. Docker Usage

Build and run the container:

```bash
docker build -t poke-price-bot .
docker run -d --restart always --name poke-price-bot --env-file .env poke-price-bot
```

## Slash Commands

* `/price` - Starts interaction to filter card prices by set, PSA grade, and card name

## Notes

* Make sure you register slash commands using `register-commands.js`
* Tokens should never be committed to source control

---

Developed by: [troyvanek](https://github.com/troyvanek)
