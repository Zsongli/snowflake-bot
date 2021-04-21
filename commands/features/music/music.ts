import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType, SlashCommandInteraction, SnowflakeCommandHandler } from "./../../SnowflakeCommandHandler";
import { bot, commandHandler } from "../../../index";
import yts, { search } from "yt-search";
import { MusicPlayer, Song } from "./player";

var guilds: Discord.Collection<string, MusicPlayer> = new Discord.Collection<string, MusicPlayer>();

async function FindVideo(query: string): Promise<Song | null> {
    const videos: yts.SearchResult = await search(query);
    if (videos.videos.length > 0)
        return {
            searchQuery: query,
            title: videos.videos[0].title,
            author: videos.videos[0].author.name,
            link: videos.videos[0].url,
            thumbnail: videos.videos[0].thumbnail,
            duration: videos.videos[0].duration.seconds
        };
    return null;
}

export const messageCommand: MessageCommand = {
    type: "MessageCommand",
    name: "music",
    desc: "Music-bot features.",
    syntax: "music <queue | leave | skip | volume>",
    run: async (msg: Discord.Message, args: string[]) => {

        switch (args[0]) {
            case "play":
            case "queue":
                if (!args[1]) return msg.channel.send("Please provide a search query!");

                if (!msg.member?.voice.channel || !msg.member.voice.channel.permissionsFor(bot.user!)?.has("CONNECT") || !msg.member.voice.channel.permissionsFor(bot.user!)?.has("SPEAK")) return msg.channel.send("Cannot join the voice channel. Please go in one that I can join!");

                if (!guilds.has(msg.guild!.id))
                    guilds.set(msg.guild!.id, new MusicPlayer(msg.guild!.id, msg.member!));

                if (guilds.get(msg.guild!.id)?.member != msg.member)
                    guilds.get(msg.guild!.id)!.member = msg.member;

                const player = guilds.get(msg.guild!.id);

                if (!player?.IsConnected()) {
                    player?.Disconect();
                    const query = msg.content.split(" ").slice(2).join(" ");
                    var song: Song | null;
                    if (new RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/).test(query)) {
                        song = {
                            link: query,
                            duration: 0,
                            searchQuery: "",
                            thumbnail: "",
                            title: "",
                            author: ""
                        };
                    }
                    else {
                        song = await FindVideo(query);
                        if (!song) return msg.channel.send("No results for that search query.");
                        const embed = {
                            "color": 16711680,
                            "title": "Queued",
                            "url": song?.link,
                            "thumbnail": {
                                "url": song?.thumbnail
                            },
                            "fields": [
                                {
                                    "name": song?.title,
                                    "value": song?.author
                                }
                            ],
                            "footer": {
                                "text": "YouTube"
                            }
                        };
                        msg.channel.send({ embed });
                    }
                    if (!player?.AddToQueue(song)) return msg.channel.send("The song couldn't be added, because the queue has reached its limit of 16 songs.");
                    await player?.MakeConnection();
                    await player?.Play();
                    return msg.react("✅");
                }
                else if (player.IsConnected() && player.connection?.channel != msg.member.voice.channel) {
                    return msg.channel.send("The bot is already connected to another channel.");
                }
                else {
                    const query = msg.content.split(" ").slice(2).join(" ");
                    var song: Song | null;
                    if (new RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/).test(query)) {
                        song = {
                            link: query,
                            duration: 0,
                            searchQuery: "",
                            thumbnail: "",
                            title: "",
                            author: ""
                        };
                    }
                    else {
                        song = await FindVideo(args.slice(1).join(" "));
                        if (!song) return msg.channel.send("No results for that search query.");
                        const embed = {
                            "color": 16711680,
                            "title": "Queued",
                            "url": song?.link,
                            "thumbnail": {
                                "url": song?.thumbnail
                            },
                            "fields": [
                                {
                                    "name": song?.title,
                                    "value": song?.author
                                }
                            ],
                            "footer": {
                                "text": "YouTube"
                            }
                        };
                        msg.channel.send({ embed });
                    }
                    if (!player.AddToQueue(song)) return msg.channel.send("The song couldn't be added, because the queue has reached its limit of 16 songs.");
                    return msg.react("✅");
                }
                break;
            case "skip":
                if (!guilds.has(msg.guild!.id) || !guilds.get(msg.guild!.id)?.IsConnected()) {
                    guilds.get(msg.guild!.id)?.Disconect();
                    return msg.channel.send("I'm not playing music right now.");
                }
                if (!msg.member?.permissions.has("ADMINISTRATOR")) return msg.channel.send("Only administrators are allowed to skip songs!");
                if (guilds.get(msg.guild!.id)?.connection?.channel != msg.member?.voice.channel) return msg.channel.send("I'm playing music in another channel.");

                guilds.get(msg.guild!.id)?.Skip();
                return msg.react("✅");

                break;
            case "disconnect":
            case "leave":
                if (!guilds.has(msg.guild!.id) || !guilds.get(msg.guild!.id)?.IsConnected()) return msg.channel.send("I'm not even connected.");

                guilds.get(msg.guild!.id)?.Disconect();
                return msg.react("✅");
                break;
            case "volume":
                if (!guilds.has(msg.guild!.id))
                    guilds.set(msg.guild!.id, new MusicPlayer(msg.guild!.id, msg.member!));

                const mp = guilds.get(msg.guild!.id);
                if (mp?.member != msg.member)
                    mp!.member = msg.member!;

                var value = parseFloat(args[1]);
                if (value) {
                    msg.channel.send("Volume set to " + value + "%");
                    value /= 100;
                    return mp?.SetVolume(value);
                }
                return msg.channel.send("That's not a valid percentage!");

                break;
            default:
                return msg.channel.send("Music what? (see /help music)");
                break;

        }
    },
    onNoPerm: (msg: Discord.Message) => {
        msg.channel.send("You don't have the permission to use this command!");
    }
};

export const slashCommand: SlashCommand = {
    type: "SlashCommand",
    name: "music",
    desc: "Music-bot features.",
    args: [],
    permission: (interaction: SlashCommandInteraction) => {
        return true;
    },
    run: (interaction: SlashCommandInteraction) => {

    },
    onNoPerm: (interaction: SlashCommandInteraction) => {
        interaction.channel.send(interaction.member.toString() + " You don't have the permission to use this command!");
    }
};