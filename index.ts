require("dotenv").config();

import Discord from "discord.js";
export const bot = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) } });

import { SnowflakeCommandHandler } from "./commands/SnowflakeCommandHandler";
export const commandHandler = new SnowflakeCommandHandler(bot, "sf!", false);
import { global, snowflake } from "./commands/commands";
import react from "./react";

process.on('unhandledRejection', up => { throw up; }); //Crash on unhandled promise rejection

bot.on("ready", () => {
    console.log("Bot is online");

    bot.user?.setPresence({
        activity: {
            "type": "PLAYING",
            "name": "sf!help or check the slash commands"
        }
    });

    //Declare global commands
    for (const command of global)
        if (command.type === "MessageCommand")
            commandHandler.DeclareMessageCommand(command);

        else if (command.type === "SlashCommand")
            commandHandler.DeclareSlashCommand(command);

    //Declare server-exclusive commands
    for (const command of snowflake)
        if (command.type === "MessageCommand")
            commandHandler.DeclareMessageCommand(command);

        else if (command.type === "SlashCommand")
            commandHandler.DeclareSlashCommand(command, "701483086994735264");
});

bot.on("message", (message) => {
    commandHandler.HandleMessageCommand(message);
    react(message);
});

//@ts-ignore :)
bot.ws.on("INTERACTION_CREATE", async (interaction) => {
    commandHandler.HandleSlashCommand(interaction);
});

bot.login(process.env.DISCORD_TOKEN);