import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "../../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../../index";

import fs from "fs";
import Speedrun from "./speedrun";

interface UserObject {
    id: string,
    guildId: string,
    score: number
};

const path = "./commands/features/speedrun/shitleaderboard.json";
var leaderboard: UserObject[] = JSON.parse(fs.readFileSync(path, "utf-8"));
var speedruns: Speedrun[] = [];
function formatTime(d: number) {

    if (!d) return "N/A";
    var ms = d % 1000;
    d = Number(d) / 1000;
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ` hour ` : ` hours `) : "";
    var mDisplay = m > 0 ? m + (m == 1 ? ` minute ` : ` minutes `) : "";
    var sDisplay = s > 0 ? s + (s == 1 ? ` second ` : ` seconds `) : "";

    return hDisplay + mDisplay + sDisplay + ms + "ms";

}

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "speedrun",
    desc: "Manages the shitting speedruns.",
    syntax: "speedrun <start | stop | leaderboard>",
    run: (msg: Discord.Message, args: string[]) => {

        switch (args[0]) {
            case "start":
                if (!speedruns.find(speedrun => speedrun.userId === msg.author.id)) {
                    const speedrun = new Speedrun(msg.member!);
                    speedruns.push(speedrun);
                    speedrun.Start();
                    msg.react("💩");
                }
                else msg.channel.send("You have already started a speedrun!");
                break;

            case "stop":
                const speedrun = speedruns.find(speedrun => speedrun.userId === msg.author.id);
                if (!speedrun) return msg.channel.send("You haven't started a speedrun yet!");
                speedrun.End();
                speedruns = speedruns.filter(run => run !== speedrun); //delete speedrun from active speedruns

                const user = leaderboard.find(user => user.id === speedrun!.userId);
                if (!user) {
                    leaderboard.push({ id: speedrun.userId, guildId: speedrun.guild.id, score: speedrun.score! }); //add to leaderboard if not present yet
                    msg.channel.send("New record!");
                    fs.writeFile(path, JSON.stringify(leaderboard), "utf-8", () => { });
                }
                else if (user.score > speedrun.score!) { //overwrite the previous score if the new one is better
                    leaderboard[leaderboard.indexOf(user)].score = speedrun.score!;
                    msg.channel.send("New record!");
                    fs.writeFile(path, JSON.stringify(leaderboard), "utf-8", () => { });
                }

                msg.channel.send(`Took you this long: ${formatTime(speedrun!.score!)}`);
                break;

            case "leaderboard":

                leaderboard.forEach(element => {
                    if (!bot.guilds.cache.has(element.guildId))
                        leaderboard = leaderboard.filter(run => run.guildId !== element.guildId);
                    if (!bot.guilds.cache.get(element.guildId)?.members.cache.has(element.id))
                        leaderboard = leaderboard.filter(run => run.id !== element.id);
                }); //check and remove people who left a server or remove servers that kicked the bot

                const sort = leaderboard.sort((a, b) => a.score - b.score);

                const embed = {
                    "title": `Shitting speedrun leaderboard`,
                    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "color": 6460499,
                    "footer": {
                        "text": leaderboard.length > 10 ? `${leaderboard.length - 10} more contestants` : "-"
                    },
                    "thumbnail": {
                        "url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/pile-of-poo_1f4a9.png"
                    },
                    "fields": [
                        {
                            "name": `1. ${bot.guilds.cache.get(sort[0]?.guildId)?.members.cache.get(sort[0].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[0]?.guildId)?.name ?? ""})`,
                            "value": formatTime(sort[0]?.score)
                        },
                        {
                            "name": `2. ${bot.guilds.cache.get(sort[1]?.guildId)?.members.cache.get(sort[1].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[1]?.guildId)?.name ?? ""})`,
                            "value": formatTime(sort[1]?.score)
                        },
                        {
                            "name": `3. ${bot.guilds.cache.get(sort[2]?.guildId)?.members.cache.get(sort[2].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[2]?.guildId)?.name ?? ""})`,
                            "value": formatTime(sort[2]?.score)
                        },
                        {
                            "name": `4. ${bot.guilds.cache.get(sort[3]?.guildId)?.members.cache.get(sort[3].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[3]?.guildId)?.name ?? ""})`,
                            "value": formatTime(sort[3]?.score)
                        },
                        {
                            "name": `5. ${bot.guilds.cache.get(sort[4]?.guildId)?.members.cache.get(sort[4].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[4]?.guildId)?.name ?? ""})`,
                            "value": formatTime(sort[4]?.score)
                        },
                        {
                            "name": `6. ${bot.guilds.cache.get(sort[5]?.guildId)?.members.cache.get(sort[5].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[5]?.guildId)?.name ?? ""})`,
                            "value": formatTime(sort[5]?.score)
                        },
                        {
                            "name": `7. ${bot.guilds.cache.get(sort[6]?.guildId)?.members.cache.get(sort[6].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[6]?.guildId)?.name ?? ""})`,
                            "value": formatTime(sort[6]?.score)
                        },
                        {
                            "name": `8. ${bot.guilds.cache.get(sort[7]?.guildId)?.members.cache.get(sort[7].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[7]?.guildId)?.name ?? ""})`,
                            "value": formatTime(sort[7]?.score)
                        },
                        {
                            "name": `9. ${bot.guilds.cache.get(sort[8]?.guildId)?.members.cache.get(sort[8].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[8]?.guildId)?.name ?? ""})`,
                            "value": formatTime(sort[8]?.score)
                        },
                        {
                            "name": `10. ${bot.guilds.cache.get(sort[9]?.guildId)?.members.cache.get(sort[9].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[9]?.guildId)?.name ?? ""})`,
                            "value": formatTime(sort[9]?.score)
                        }
                    ]
                };
                msg.channel.send({ embed });
                break;

            default:
                return msg.channel.send("Please provide one of the arguments! (start, stop, leaderboard)");
                break;
        }

    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "speedrun",
    desc: "Manages the shitting speedruns.",
    args: [
        { name: "start", description: "Stars a shitting speedrun.", type: SlashCommandArgumentType.SUB_COMMAND },
        { name: "stop", description: "Stops the shitting speedrun.", type: SlashCommandArgumentType.SUB_COMMAND },
        { name: "leaderboard", description: "Shows a leaderboard of the best shitters around.", type: SlashCommandArgumentType.SUB_COMMAND }
    ],
    run: (interaction: SlashCommandInteraction) => {

        if (interaction.args.has("start")) {

            if (speedruns.find(speedrun => speedrun.userId === interaction.member.user.id)) return interaction.channel.send(interaction.member.toString() + " You have already started a speedrun!");

            const speedrun = new Speedrun(interaction.member!);
            speedruns.push(speedrun);
            speedrun.Start();
            interaction.channel.send(interaction.member.toString() + " Started the run!");
            interaction.Acknowledge();
        }
        else if (interaction.args.has("stop")) {

            const speedrun = speedruns.find(speedrun => speedrun.userId === interaction.member.user.id);
            if (!speedrun) return interaction.channel.send(interaction.member.toString() + " You haven't started a speedrun yet!");
            speedrun.End();
            speedruns = speedruns.filter(run => run !== speedrun); //delete speedrun from active speedruns

            const user = leaderboard.find(user => user.id === speedrun!.userId);
            if (!user) {
                leaderboard.push({ id: speedrun.userId, guildId: speedrun.guild.id, score: speedrun.score! }); //add to leaderboard if not present yet
                interaction.channel.send("New record!");
                fs.writeFile(path, JSON.stringify(leaderboard), "utf-8", () => { });
            }
            else if (user.score > speedrun.score!) { //overwrite the previous score if the new one is better
                leaderboard[leaderboard.indexOf(user)].score = speedrun.score!;
                interaction.channel.send("New record!");
                fs.writeFile(path, JSON.stringify(leaderboard), "utf-8", () => { });
            }

            interaction.channel.send(`${interaction.member.toString()} Took you this long: ${formatTime(speedrun!.score!)}`);
            interaction.Acknowledge();

        }
        else if (interaction.args.has("leaderboard")) {

            leaderboard.forEach(element => {
                if (!bot.guilds.cache.has(element.guildId))
                    leaderboard = leaderboard.filter(run => run.guildId !== element.guildId);
                if (!bot.guilds.cache.get(element.guildId)?.members.cache.has(element.id))
                    leaderboard = leaderboard.filter(run => run.id !== element.id);
            }); //check and remove people who left a server or remove servers that kicked the bot

            const sort = leaderboard.sort((a, b) => a.score - b.score);

            const embed = {
                "title": `Shitting speedrun leaderboard`,
                "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "color": 6460499,
                "footer": {
                    "text": leaderboard.length > 10 ? `${leaderboard.length - 10} more contestants` : "-"
                },
                "thumbnail": {
                    "url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/pile-of-poo_1f4a9.png"
                },
                "fields": [
                    {
                        "name": `1. ${bot.guilds.cache.get(sort[0]?.guildId)?.members.cache.get(sort[0].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[0]?.guildId)?.name ?? ""})`,
                        "value": formatTime(sort[0]?.score)
                    },
                    {
                        "name": `2. ${bot.guilds.cache.get(sort[1]?.guildId)?.members.cache.get(sort[1].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[1]?.guildId)?.name ?? ""})`,
                        "value": formatTime(sort[1]?.score)
                    },
                    {
                        "name": `3. ${bot.guilds.cache.get(sort[2]?.guildId)?.members.cache.get(sort[2].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[2]?.guildId)?.name ?? ""})`,
                        "value": formatTime(sort[2]?.score)
                    },
                    {
                        "name": `4. ${bot.guilds.cache.get(sort[3]?.guildId)?.members.cache.get(sort[3].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[3]?.guildId)?.name ?? ""})`,
                        "value": formatTime(sort[3]?.score)
                    },
                    {
                        "name": `5. ${bot.guilds.cache.get(sort[4]?.guildId)?.members.cache.get(sort[4].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[4]?.guildId)?.name ?? ""})`,
                        "value": formatTime(sort[4]?.score)
                    },
                    {
                        "name": `6. ${bot.guilds.cache.get(sort[5]?.guildId)?.members.cache.get(sort[5].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[5]?.guildId)?.name ?? ""})`,
                        "value": formatTime(sort[5]?.score)
                    },
                    {
                        "name": `7. ${bot.guilds.cache.get(sort[6]?.guildId)?.members.cache.get(sort[6].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[6]?.guildId)?.name ?? ""})`,
                        "value": formatTime(sort[6]?.score)
                    },
                    {
                        "name": `8. ${bot.guilds.cache.get(sort[7]?.guildId)?.members.cache.get(sort[7].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[7]?.guildId)?.name ?? ""})`,
                        "value": formatTime(sort[7]?.score)
                    },
                    {
                        "name": `9. ${bot.guilds.cache.get(sort[8]?.guildId)?.members.cache.get(sort[8].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[8]?.guildId)?.name ?? ""})`,
                        "value": formatTime(sort[8]?.score)
                    },
                    {
                        "name": `10. ${bot.guilds.cache.get(sort[9]?.guildId)?.members.cache.get(sort[9].id)?.user.username ?? "free"} (${bot.guilds.cache.get(sort[9]?.guildId)?.name ?? ""})`,
                        "value": formatTime(sort[9]?.score)
                    }
                ]
            };
            interaction.channel.send({ embed });
            interaction.Acknowledge();
        }
        //a tribute to yandere dev with the else if's
    },
    onNoPerm: (interaction: SlashCommandInteraction) => {
        interaction.channel.send(interaction.member.toString() + " You don't have the permission to use this command!");
    }
};