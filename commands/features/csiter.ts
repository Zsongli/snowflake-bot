import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../index";

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "cs\u00edtertahelyére",
    desc: "A csítert a helyére küldi (azaz Zsoltit), ezt csak adminok tehetik meg vele. Exkluzív a The Snowflake Team szerveréhez.",
    permission: (msg: Discord.Message) => msg.guild!.id === "701483086994735264",
    run: (msg: Discord.Message) => {
        if (!msg.member?.hasPermission("ADMINISTRATOR")) return msg.channel.send("Ezt csak adminok használhatják! Kinek képzeled magad, hm?");
        if (!bot.guilds.cache.get("701483086994735264")?.members.cache.get("569153209927729176")?.voice.channel) return msg.channel.send(msg.member.toString() + ", Nincs bent egyik hangcsatornában sem :(");
        bot.guilds.cache.get("701483086994735264")?.members.cache.get("569153209927729176")?.voice.setChannel("793149257455501312");
    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("That command exclusive to another server.");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "cs\u00edtertahelyére",
    desc: "A csítert a helyére küldi (azaz Zsoltit), ezt csak adminok tehetik meg vele.",
    permission: (interaction) => interaction.member.hasPermission("ADMINISTRATOR"),
    run: (interaction) => {
        if (!bot.guilds.cache.get("701483086994735264")?.members.cache.get("569153209927729176")?.voice.channel) return interaction.channel.send(interaction.member.toString() + ", Nincs bent egyik hangcsatornában sem :(");

        interaction.AcknowledgeReply("Kapta.");
        bot.guilds.cache.get("701483086994735264")?.members.cache.get("569153209927729176")?.voice.setChannel("793149257455501312");
    },
    onNoPerm: (interaction) => {
        interaction.channel.send(interaction.member.toString() + " Ezt csak adminok használhatják! Kinek képzeled magad, hm?");
    }
};