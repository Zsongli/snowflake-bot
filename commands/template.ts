//                                       //
//      TEMPLATE FILE FOR FEATURES       //
//                                       // 

import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "./SnowflakeCommandHandler";
import { bot, commandHandler } from "../index";

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "commandName",
    desc: "Command Description.",           //optional, only for help
    syntax: "commandName <arg1> [arg2]",    //optional, only for help
    permission: (msg: Discord.Message) => { //optional, command will always run if not specified, otherwise only if function returns true
        return true;
    },
    run: (msg: Discord.Message, args: string[]) => {

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
    permission: (interaction: SlashCommandInteraction) =>{
        return true;
    },
    run: (interaction: SlashCommandInteraction) => {
        
    },
    onNoPerm: (interaction: SlashCommandInteraction) => {
        interaction.channel.send(interaction.member.toString() + " You don't have the permission to use this command!");
    }
};