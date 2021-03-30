import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "../../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../../index";

import Shuffler from "./shuffler";

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "teamshuffle",
    desc: "Shuffles people who enter into a specified number of teams.",
    syntax: "teamshuffle <number of teams>",
    run: (msg: Discord.Message, args: string[]) => {
        const teamnum: number = parseInt(args[0]);
        if (!args[0] || Number.isNaN(teamnum) || teamnum < 2 || teamnum > 16)
            msg.channel.send("Invalid team number! Please provide a number from 2 to 16.");
        else {
            msg.delete({ timeout: 1 });
            //@ts-ignore
            new Shuffler(msg.channel, teamnum).Gather();
        }
    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "teamshuffle",
    desc: "Shuffles people who enter into a specified number of teams.",
    args: [
        { name: "teams", description: "The number of teams to shuffle people into, from 2 to 25.", required: true, type: SlashCommandArgumentType.INTEGER }
    ],
    run: (interaction: SlashCommandInteraction) => {
        const teamnum: number = parseInt(interaction.args.get("teams")!.value);
        if (teamnum < 2 || teamnum > 25)
            return interaction.channel.send(interaction.member.toString() + " Invalid team number! Please provide a number from 2 to 25.");

        interaction.AcknowledgeReply("⮯");
        new Shuffler(interaction.channel, teamnum).Gather();
    },
    onNoPerm: (interaction: SlashCommandInteraction) => {
        interaction.channel.send(interaction.member.toString() + " You don't have the permission to use this command!");
    }
};