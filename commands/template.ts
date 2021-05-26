//                                       //
//      TEMPLATE FILE FOR FEATURES       //
//                                       // 

import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "./SnowflakeCommandHandler";
import { bot, commandHandler } from "../index";

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "commandName",
    desc: "Command Description.",               //optional, only for help
    syntax: "commandName <arg1> [arg2]",        //this too
    permission: (msg: Discord.Message) => true, //optional, command will always run if not specified, otherwise only if function returns true
    run: (msg: Discord.Message, args: string[]) => {
        //code here
    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "commandName",
    desc: "Command Description.",
    args: [],
    permission: (interaction: SlashCommandInteraction) => true,
    run: (interaction: SlashCommandInteraction) => {
        //code here
    },
    onNoPerm: (interaction: SlashCommandInteraction) => {
        interaction.channel.send(interaction.member.toString() + " You don't have the permission to use this command!");
    }
};