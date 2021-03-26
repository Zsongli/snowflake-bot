import Discord from "discord.js";

export default class Speedrun {

    userId: Discord.Snowflake;
    guild: Discord.Guild;
    score: number | undefined;

    private start: number | undefined;

    constructor(member: Discord.GuildMember) {
        this.userId = member.user.id;
        this.guild = member.guild;
    }

    Start():void {

        this.start = Date.now();
    }

    End() {

        if(!this.start) return;
        return this.score = Date.now()-this.start;

    }

};