import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "./../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../index";

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "pokimane",
    desc: "pokimane fart compilation 4K HDR Dolby Digital",
    run: (msg: Discord.Message, args: string[]) => {
        msg.channel.send({files: [new Discord.MessageAttachment("./assets/sound/pokimane fart compilation 4K HDR Dolby Digital.mp3")]});
    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "pokimane",
    desc: "pokimane fart compilation 4K HDR Dolby Digital",
    args: [],
    run: (interaction: SlashCommandInteraction) => {
        interaction.AcknowledgeReply("⮯");
        interaction.channel.send({files: [new Discord.MessageAttachment("./assets/sound/pokimane fart compilation 4K HDR Dolby Digital.mp3")]});
    },
    onNoPerm: (interaction: SlashCommandInteraction) => {
        interaction.channel.send(interaction.member.toString() + " You don't have the permission to use this command!");
    }
};