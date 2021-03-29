import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../index";

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "ping",
    desc: "Responds with the latency.",
    run: (msg: Discord.Message) => {
        msg.channel.send(`Pong! ${bot.ws.ping}ms`);
    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "ping",
    desc: "Responds with the latency.",
    run: (interaction) => {
        interaction.AcknowledgeReply(`Pong! ${bot.ws.ping}ms`);
    },
    onNoPerm: (interaction) => {
        interaction.channel.send(interaction.member.toString() + "You don't have the permission to use this command!");
    }
};