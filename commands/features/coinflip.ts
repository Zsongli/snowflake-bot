import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../index";

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "coinflip",
    desc: "Flips a coin and sends the result.",
    run: (msg: Discord.Message, args: string[]) => {
        msg.channel.send(Math.floor(Math.random() * 2) === 1 ? "Heads!" : "Tails!");
    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "coinflip",
    desc: "Flips a coin and sends the result.",
    run: (interaction) => {
        interaction.channel.send(interaction.member.toString() + (Math.floor(Math.random() * 2) === 1 ? " Heads!" : " Tails!"));
        interaction.Acknowledge();
    },
    onNoPerm: (interaction) => {
        interaction.channel.send(interaction.member.toString() + "You don't have the permission to use this command!");
    }
};