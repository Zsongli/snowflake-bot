import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../index";

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "cs\u00edtertahelyére",
    desc: "A csítert a helyére küldi (azaz Zsoltit), ezt csak adminok tehetik meg vele. Exkluzív a The Snowflake Team szerveréhez.",
    permission: (msg: Discord.Message) => msg.guild!.id === "701483086994735264",
    run: (msg: Discord.Message) => {
        if (msg.member?.permissions.has("ADMINISTRATOR"))
            return bot.guilds.cache.get("701483086994735264")?.members.cache.get("569153209927729176")?.voice.setChannel("793149257455501312").catch(() => { msg.channel.send("Nincs bent egyik hangcsatornában sem :(") });

        msg.channel.send("Ezt csak adminok használhatják! Kinek képzeled magad, hm?");

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
        interaction.Acknowledge();
        bot.guilds.cache.get("701483086994735264")?.members.cache.get("569153209927729176")?.voice.setChannel("793149257455501312").catch(() => { interaction.channel.send(interaction.member.toString() + " Nincs bent egyik hangcsatornában sem :(") });
    },
    onNoPerm: (interaction) => {
        interaction.channel.send(interaction.member.toString() + " Ezt csak adminok használhatják! Kinek képzeled magad, hm?");
    }
};