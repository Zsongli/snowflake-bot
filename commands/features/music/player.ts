import Discord, { Guild } from "discord.js";
import ytdl from "ytdl-core";
import { bot } from "../../../index";

export interface Song {
    searchQuery: string,
    title: string,
    author: string,
    link: string,
    thumbnail: string,
    duration: number
};

export class MusicPlayer {

    private guildId;
    private queue: Song[] = [];
    connection: Discord.VoiceConnection | undefined = undefined;
    member: Discord.GuildMember;
    volume: number;
    private dispatcher: Discord.StreamDispatcher | undefined = undefined;
    loop: boolean = false;

    constructor(guildId: string, member: Discord.GuildMember, volume = 0.5) {
        this.member = member;
        this.volume = volume;
        this.guildId = guildId;
    }

    async MakeConnection(): Promise<boolean> {
        if (!this.member.voice.channel || !this.member.voice.channel.joinable) return false;

        this.connection = await this.member.voice.channel!.join();
        return true;
    }

    Disconect() {
        if (this.connection)
            this.connection?.disconnect();
        this.connection = undefined;
        this.dispatcher = undefined;
        this.queue = [];
    }

    AddToQueue(song: Song): boolean {
        if (this.queue.length >= 16) return false;
        this.queue.push(song);
        return true;
    }

    Skip(): void {
        this.queue.shift();
        if (this.queue.length <= 0) return this.Disconect();
        this.Play();
    }

    async Play(): Promise<void> {
        if (!this.connection || this.queue.length <= 0) return;

        const stream = await ytdl(this.queue[0].link, { filter: "audioonly" });
        this.dispatcher = this.connection.play(stream, { volume: this.volume, seek: 0 });

        this.dispatcher.on("finish", () => {
            if (this.loop)
                this.Play();
            this.Skip();
        });
    }

    SetVolume(value: number) {
        if (value < 0) value = 0;
        if (value > 10) value = 10;
        this.volume = value;
        if (this.dispatcher)
            this.dispatcher?.setVolume(value);
    }

    IsConnected(): boolean {
        if (this.connection && bot.guilds.cache.get(this.guildId)?.members.cache.get(bot.user!.id)?.voice.channel) return true;
        return false;
    }
};