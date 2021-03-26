import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../index";

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "code",
    desc: "Runs code lol",
    syntax: "code <code block>",
    permission: (msg: Discord.Message) => {
        return msg.author.id === "140145735709622282";
    },
    run: (msg: Discord.Message, args: string[]) => {
        const code = args.join(" ");

        if (code.startsWith("```ts") && code.endsWith("```")) {

            const sliced = code.slice(5, code.length - 3);
            try {
                return eval(sliced).catch((exception:any)=>{msg.channel.send("Promise rejection unhandled: "+exception.message);});
            } catch (exception) {
                return msg.channel.send("Exception unhandled: " + exception.message);
            }

        }

        return msg.channel.send("Code block isn't complete or isn't TypeScript.");

    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    },
    hidden: true
};