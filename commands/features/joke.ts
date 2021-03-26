import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../index";

const funi = require("one-liner-joke");

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "joke",
    desc: "Does the funny and sends one of many jokes, which can sometimes be very low-quality and unfunny. There's your warning.",
    syntax: "joke [tag]",
    run: (msg: Discord.Message, args: string[]) => {
        if(!args[0])
            return msg.channel.send("Here's your funny: "+funi.getRandomJoke({"exclude_tags":[]}).body);

        const joke = funi.getRandomJokeWithTag(args[0], {"exclude_tags":[]});
        if(!joke.body.length)
            return msg.channel.send("No jokes can be found with the tag "+args[0]);
        return msg.channel.send("Here's your funny: "+joke.body);
    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "joke",
    desc: "Does the funny and sends some low-quality, unfunny jokes.",
    args: [
        {name: "tag", description: "Search for jokes with this tag", type: SlashCommandArgumentType.STRING, required:false}
    ],
    run: (interaction: SlashCommandInteraction) => {
        if(!interaction.args.has("tag"))
        {
            interaction.channel.send(interaction.member.toString()+" Here's your funny: "+funi.getRandomJoke({"exclude_tags":[]}).body);
            return interaction.Acknowledge();
        }

        const joke = funi.getRandomJokeWithTag(interaction.args.get("tag")!.value, {"exclude_tags":[]});
        if(!joke.body.length)
            return interaction.channel.send(interaction.member.toString()+" No jokes can be found with the tag "+interaction.args.get("tag")!.value);
        interaction.channel.send(interaction.member.toString()+" Here's your funny: "+joke.body);
        interaction.Acknowledge();
    },
    onNoPerm: (interaction: SlashCommandInteraction) => {
        interaction.channel.send(interaction.member.toString() + " You don't have the permission to use this command!");
    }
};