import Discord from "discord.js";

export default function react(msg: Discord.Message): void {
    if (msg.content.toLowerCase().includes("mivan") || msg.content.toLowerCase().includes("mi van"))
        msg.channel.send("Segged kivan!");
    if (msg.content.toLowerCase().includes("buzi") || msg.content.toLowerCase().includes("gay"))
        msg.react("🏳️‍🌈");
    if (msg.content.toLowerCase().includes("oof"))
        msg.react("725365274760577034");
    if (msg.content.toLowerCase().includes("no u") || msg.content.toLowerCase().includes("nou"))
        msg.react("778676827958280213");
    if (msg.content.toLowerCase().includes("nigga") || msg.content.toLowerCase().includes("nigger") || msg.content.toLowerCase().includes("nibba"))
        msg.react("805831762004803594");
}