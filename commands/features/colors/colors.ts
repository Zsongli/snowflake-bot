import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "../../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../../index";
import Color from "color";
import { Parse, DrawColor } from "./colorHelper";

const help = new Discord.MessageEmbed()
    .setColor(7506394)
    .setTitle("Supported color formats")
    .setFooter("Specifying invalid values will usually result in a fully white or black color. | * Transparency can't be specified this way.")
    .addField("Hexadecimal *", "A number in base 8 that is prefixed with either a '#' or '0x' and needs to be 6 digits. E.g. #FFBC12 / 0xffbc12")
    .addField("RGBA", "3 or 4 integers ranging from 0 to 255, separated by commas. E.g. 128, 51, 234, 128")
    .addField("Normalized RGBA", "3 or 4 non-whole numbers ranging from 0 to 1, separated by commas and using '.' as the decimal point. E.g. 0.43, 0.43, 0.7, 0.5")
    .addField("Decimal *", "A base 10 number from 0 to 16777215. E.g 7506394")
    .addField("HSLA", "Hue, saturation and lightness (and alpha) separated by commas. At least one of the 3 suffixes has to be included. E.g. 50deg, 30%, 70%, 0.9 / 50, 30, 70%, 0.9")
    .addField("Hue", "An integer ranging from 0 to 360, optionally suffixed with 'deg'.", true)
    .addField("Saturation and lightness", "Integers from 0 to 100, optionally suffixed with a '%'.", true)
    .addField("Alpha", "Ranging from 0 to 1, using '.' as the decimal point.", true)
    .addField("Other", "Other formats such as rgb(255, 255, 0) may work, though not fully guaranteed.");

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "color",
    desc: "Shows info about the specified color.",
    syntax: "color info <color> | color formats",
    permission: (msg: Discord.Message) => true,
    run: async (msg: Discord.Message, args: string[]) => {
        switch(args[0]){
            case "formats":
                return msg.channel.send(help);
            case "info":
                break;
            default:
                return msg.channel.send("Color who? Run */help color* for options.");
        }

        const color = Parse(msg.content.slice(commandHandler.prefix.length + messageCommand.name.length+6));

        if (!color) return msg.channel.send("Cannot read this format! Run */color formats* to see the possibilities.");

        const attachment = new Discord.MessageAttachment(await DrawColor(color), "color.png");
        const rgb = color.rgb().object();
        const hsl = color.hsl().object();
        const decimal = color.rgbNumber();
        const cmyk = color.cmyk().object();

        const embed = new Discord.MessageEmbed()
            .setColor(decimal)
            .setTitle("Info about the color")
            .setFooter(msg.author.username + " | * does not include transparency", msg.author.avatarURL() ?? undefined)
            .attachFiles([attachment])
            .setThumbnail("attachment://color.png")
            .addField("Hexadecimal *", color.hex())
            .addField("RGBA", `${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${Math.round((rgb.alpha ?? 1) * 255)}`)
            .addField("Normalized RGBA", `${(rgb.r / 255).toFixed(3)}, ${(rgb.g / 255).toFixed(3)}, ${(rgb.b / 255).toFixed(3)}, ${(rgb.alpha ?? 1).toFixed(3)}`)
            .addField("Decimal *", decimal)
            .addField("HSLA", `${+(hsl.h).toFixed(2)} deg, ${+(hsl.s).toFixed(2)}%, ${+(hsl.l).toFixed(2)}%, ${(hsl.alpha ?? 1).toFixed(3)}`)
            .addField("CMYK", `${+(cmyk.c).toFixed(2)}%, ${+(cmyk.m).toFixed()}%, ${+(cmyk.y).toFixed(2)}%, ${+(cmyk.k).toFixed(2)}%, ${(cmyk.alpha ?? 1).toFixed(3)}`);

        msg.channel.send({ embed });
    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "color",
    desc: "Shows info about the specified color.",
    args: [{ name: "info", description: "Show info about a color that you specify.", type: SlashCommandArgumentType.SUB_COMMAND, options: [{ name: "color", description: "The color to get info about.", type: SlashCommandArgumentType.STRING, required: true }] }, { name: "formats", description: "Help on how to make the bot understand you.", type: SlashCommandArgumentType.SUB_COMMAND }],
    permission: (interaction: SlashCommandInteraction) => true,
    run: async (interaction: SlashCommandInteraction) => {
        if (interaction.args.has("formats")) {
            await interaction.AcknowledgeReply("⮯");
            return interaction.channel.send(help);
        }

        const color = Parse(interaction.args.get("info")?.options.get("color")?.value);

        if (!color) return interaction.channel.send(interaction.member.toString()+" Cannot read this format! Run */color formats* to see the possibilities.");

        const attachment = new Discord.MessageAttachment(await DrawColor(color), "color.png");
        const rgb = color.rgb().object();
        const hsl = color.hsl().object();
        const decimal = color.rgbNumber();
        const cmyk = color.cmyk().object();

        const embed = new Discord.MessageEmbed()
            .setColor(decimal)
            .setTitle("Info about the color")
            .setFooter(interaction.member.user.username + " | * does not include transparency", interaction.member.user.avatarURL() ?? undefined)
            .attachFiles([attachment])
            .setThumbnail("attachment://color.png")
            .addField("Hexadecimal *", color.hex())
            .addField("RGBA", `${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${Math.round((rgb.alpha ?? 1) * 255)}`)
            .addField("Normalized RGBA", `${(rgb.r / 255).toFixed(3)}, ${(rgb.g / 255).toFixed(3)}, ${(rgb.b / 255).toFixed(3)}, ${(rgb.alpha ?? 1).toFixed(3)}`)
            .addField("Decimal *", decimal)
            .addField("HSLA", `${+(hsl.h).toFixed(2)} deg, ${+(hsl.s).toFixed(2)}%, ${+(hsl.l).toFixed(2)}%, ${(hsl.alpha ?? 1).toFixed(3)}`)
            .addField("CMYK", `${+(cmyk.c).toFixed(2)}%, ${+(cmyk.m).toFixed()}%, ${+(cmyk.y).toFixed(2)}%, ${+(cmyk.k).toFixed(2)}%, ${(cmyk.alpha ?? 1).toFixed(3)}`);

        await interaction.AcknowledgeReply("⮯");
        interaction.channel.send({ embed });
    },
    onNoPerm: (interaction: SlashCommandInteraction) => {
        interaction.channel.send(interaction.member.toString() + " You don't have the permission to use this command!");
    }
};