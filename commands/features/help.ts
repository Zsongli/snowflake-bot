import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../index";

import { global, snowflake } from "../commands";

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "help",
    desc: "Shows a list of all commands or info about a specified command.",
    syntax: "help [command name]",
    run: (msg: Discord.Message, args: string[]) => {
        const command = commandHandler.GetMessageCommandInfo(args[0]);
        if (args.length != 0) {
            if (!command) return msg.channel.send("The specified command doesn't exist.");
            const embed = {
                "title": `About the command ${command.name}`,
                "description": command.desc ?? "no description",
                "color": 7506394,
                "footer": {
                    "icon_url": msg.author.avatarURL(),
                    "text": msg.author.username
                },
                "author": {
                    "name": "Snowflake BOT",
                    "icon_url": "https://cdn.discordapp.com/app-icons/759152855499800607/b002efeafa413b5d56f4acd19093d5be.png"
                },
                "fields": [
                    {
                        "name": "Usage",
                        "value": command.syntax ?? "simple"
                    }
                ]
            };
            //@ts-ignore
            msg.channel.send({ embed });
        }
        else {
            const embed = {
                "title": "List of commands",
                "description": "Feel free to share your ideas :)",
                "color": 7506394,
                "footer": {
                    "icon_url": msg.author.avatarURL(),
                    "text": msg.author.username
                },
                "author": {
                    "name": "Snowflake BOT",
                    "icon_url": "https://cdn.discordapp.com/app-icons/759152855499800607/b002efeafa413b5d56f4acd19093d5be.png"
                },
                "fields": [

                ]
            };

            for (const command of global.filter((cmd) => cmd.type === "MessageCommand" && !cmd.hidden))
                //@ts-ignore
                embed.fields.push({ name: command.name, value: command.desc });

            //@ts-ignore
            msg.channel.send({ embed });
        }
    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "help",
    desc: "Shows a list of all commands or info about a specified command.",
    args: [
        { name: "command", description: "The name of the command to get help about", type: SlashCommandArgumentType.STRING, required: false }
    ],
    run: (interaction: SlashCommandInteraction) => {
        if (interaction.args.has("command")) {
            const command = commandHandler.GetMessageCommandInfo(interaction.args.get("command")!.value);
            if (!command) return interaction.channel.send(interaction.member.toString() + " The specified command doesn't exist.")
            const embed = {
                "title": `About the command ${command.name}`,
                "description": command.desc,
                "color": 7506394,
                "footer": {
                    "icon_url": interaction.member.user.avatarURL(),
                    "text": interaction.member.user.username
                },
                "author": {
                    "name": "Snowflake BOT",
                    "icon_url": "https://cdn.discordapp.com/app-icons/759152855499800607/b002efeafa413b5d56f4acd19093d5be.png"
                },
                "fields": [
                    {
                        "name": "Usage",
                        "value": command.syntax ?? "simple"
                    }
                ]
            };
            interaction.channel.send({ embed });
            interaction.Acknowledge();
        }
        else {
            const embed = {
                "title": "List of commands",
                "description": "Feel free to share your ideas :)",
                "color": 7506394,
                "footer": {
                    "icon_url": interaction.member.user.avatarURL(),
                    "text": interaction.member.user.username
                },
                "author": {
                    "name": "Snowflake BOT",
                    "icon_url": "https://cdn.discordapp.com/app-icons/759152855499800607/b002efeafa413b5d56f4acd19093d5be.png"
                },
                "fields": [

                ]
            };

            for (const command of global.filter((cmd) => cmd.type === "MessageCommand"))
                //@ts-ignore
                embed.fields.push({ name: command.name, value: command.desc });

            interaction.channel.send({ embed });
            interaction.Acknowledge();
        }
    },
    onNoPerm: (interaction: SlashCommandInteraction) => {
        interaction.channel.send(interaction.member.toString() + "You don't have the permission to use this command!");
    }
};