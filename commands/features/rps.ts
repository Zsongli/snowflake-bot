import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../index";

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "rps",
    desc: "Play rock-paper-scissors with the bot!",
    run: (msg: Discord.Message, args: string[]) => {

        msg.react("🪨").then(() => msg.react("🧻").then(() => msg.react("✂️"))).then(() => {

            const random = Math.floor(Math.random() * 100);
            msg.awaitReactions(
                (reaction: Discord.MessageReaction, user: Discord.User) => user.id === msg.author.id && ["🪨", "🧻", "✂️"].includes(reaction.emoji.name),
                { max: 1, errors: ["time"], time: 10000 }
            ).then((collected: Discord.Collection<string, Discord.MessageReaction>) => {

                if (!collected.first()) {
                    msg.delete({ timeout: 1 });
                    return;
                }

                const choice = collected.first()!.emoji.name;

                if (random === 0) {
                    switch (choice) {
                        case "🪨":
                            msg.channel.send("My choice: ✂️ You win! (1%)");
                            break;
                        case "🧻":
                            msg.channel.send("My choice: 🪨 You win! (1%)");
                            break;
                        case "✂️":
                            msg.channel.send("My choice: 🧻 You win! (1%)");
                            break;
                    }
                    return;
                }
                switch (choice) {
                    case "🪨":
                        msg.channel.send("My choice: 🧻 I win!");
                        break;
                    case "🧻":
                        msg.channel.send("My choice: ✂️ I win!");
                        break;
                    case "✂️":
                        msg.channel.send("My choice: 🪨 I win!");
                        break;
                }
                return;


            }).catch(() => { msg.delete({ timeout: 1 }) });
        });
    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "rps",
    desc: "Play rock-paper-scissors with the bot!",
    run: async (interaction: SlashCommandInteraction) => {
        
        interaction.Acknowledge();

        const msg: Discord.Message = await interaction.channel.send("Please wait, I'm placing the reactions.");
        msg.react("🪨").then(() => msg.react("🧻").then(() => msg.react("✂️"))).then(() => {

            msg.edit("Make your choice!");
            const random = Math.floor(Math.random() * 100);
            msg.awaitReactions(
                (reaction: Discord.MessageReaction, user: Discord.User) => user.id === interaction.member.user.id && ["🪨", "🧻", "✂️"].includes(reaction.emoji.name),
                { max: 1, errors: ["time"], time: 10000 }
            ).then((collected: Discord.Collection<string, Discord.MessageReaction>) => {

                if (!collected.first()) {
                    msg.delete({ timeout: 1 });
                    return;
                }

                const choice = collected.first()!.emoji.name;
                const uid = collected.first()!.users.cache.get(interaction.member.user.id)!.id;

                if (random === 0) {
                    switch (choice) {
                        case "🪨":
                            msg.edit(`<@${uid}>, My choice: ✂️ You win! (1%)`);
                            break;
                        case "🧻":
                            msg.edit(`<@${uid}>, My choice: 🪨 You win! (1%)`);
                            break;
                        case "✂️":
                            msg.edit(`<@${uid}>, My choice: 🧻 You win! (1%)`);
                            break;
                    }
                    return;
                }
                switch (choice) {
                    case "🪨":
                        msg.edit(`<@${uid}>, My choice: 🧻 I win!`);
                        break;
                    case "🧻":
                        msg.edit(`<@${uid}>, My choice: ✂️ I win!`);
                        break;
                    case "✂️":
                        msg.edit(`<@${uid}>, My choice: 🪨 I win!`);
                        break;
                }
                return;


            }).catch(() => { msg.delete({ timeout: 1 }) });
        });
    },
    onNoPerm: (interaction: SlashCommandInteraction) => {
        interaction.channel.send(interaction.member.toString() + " You don't have the permission to use this command!");
    }
};