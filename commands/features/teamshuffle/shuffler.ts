import Discord, { IntegrationApplication } from "discord.js";

export default class Shuffler {
    private msg: Discord.Message | undefined;
    private teamCount: number;
    private members: string[];
    private teams: string[][];
    private channel: Discord.TextChannel;

    constructor(channel: Discord.TextChannel, teamCount: number) {
        this.members = [];
        this.teamCount = teamCount;
        this.teams = [];
        this.channel = channel;
    }

    async Gather() {
        const embed = {
            "title": "Shuffling teams in 15 seconds",
            "description": "Click the check mark below to enter!",
            "color": 7506394,
            "footer": {
                "text": `${this.teamCount} teams`
            },
            "thumbnail": {
                "url": "https://cdn2.iconfinder.com/data/icons/rpg-basic-set-2/512/dice-512.png"
            },
            "fields": []
        };
        this.msg = await this.channel.send({ embed });
        this.msg!.react("✅");
        const filter = (reaction: Discord.MessageReaction) => { return reaction.emoji.name === "✅"; };
        this.msg!.awaitReactions(filter, { max: this.msg!.guild!.memberCount, time: 15000, errors: ['time'] })
            .then(collected => {
                //Everyone on the server reacted (not gonna handle cause it's very unlikely)
            })
            .catch((collected: Discord.Collection<string, Discord.MessageReaction>) => {
                if (collected.first()?.count === 1) {
                    const embed = {
                        "title": "Team shuffle",
                        "description": "The randomization failed, because nobody joined.",
                        "color": 12386304,
                        "thumbnail": {
                            "url": "https://1001freedownloads.s3.amazonaws.com/vector/thumb/133250/milker_X_icon.png"
                        },
                        "fields": []
                    };
                    this.msg!.reactions.removeAll();
                    return this.msg!.edit({ embed });
                }
                const users: Discord.User[] = collected.first()!.users.cache.array();
                for (var i = 0; i < users.length; i++) {
                    if (!users[i].bot)
                        this.members.push(users[i].username);
                }
                const embed = {
                    "title": "Team shuffle",
                    "description": "Randomizing in progress...",
                    "color": 0,
                    "footer": {
                        "text": `${this.teamCount} teams - total people: ${this.members.length} - ${Math.ceil(this.members.length / this.teamCount)} per team at most`
                    },
                    "thumbnail": {
                        "url": "https://upload.wikimedia.org/wikipedia/commons/a/ad/YouTube_loading_symbol_3_%28transparent%29.gif"
                    },
                    "fields": []
                };
                this.msg!.edit({ embed })
                setTimeout(() => { this.Randomize(); }, 1000);

            });
    }

    Randomize() {

        for (var i = 0; i < this.teamCount; i++)
            this.teams.push([]);

        shuffle(this.members);

        for (var i = 0; i < this.members.length; i++) {
            this.teams[i % this.teams.length].push(this.members[i]);
        }
        this.WriteTeams();
    }

    WriteTeams() {
        const embed = {
            "title": "Team shuffle",
            "description": "Done, here are the teams:",
            "color": 7844437,
            "footer": {
                "text": `${this.teamCount} teams - total people: ${this.members.length} - ${Math.ceil(this.members.length / this.teamCount)} per team at most`
            },
            "thumbnail": {
                "url": "https://hotemoji.com/images/dl/7/white-heavy-check-mark-emoji-by-twitter.png"
            },
            "fields": []
        };

        for (var i = 0; i < this.teams.length; i++) {
            const list = this.teams[i].length == 0 ? "[empty]" : this.teams[i].join(", ");
            //@ts-expect-error
            embed.fields.push({ name: `${i + 1}. team`, value: list });
        }

        try {
            this.msg!.edit({ embed }).catch(() => { this.msg!.edit("Couldn't fit all the teams into the message, sorry :("); });
            this.msg!.reactions.removeAll();
        }
        catch {
            this.msg!.edit("Couldn't fit all the teams into the message, sorry :(");
        }
    }

};

//Knuth shuffle
function shuffle(array: Array<any>) {
    if (!Array.isArray(array))
        return;

    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}