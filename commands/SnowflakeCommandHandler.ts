import Discord from "discord.js";

export interface MessageCommand {
    type: "MessageCommand";
    name: string;
    desc?: string;
    syntax?: string;
    run: (message: Discord.Message, args: string[]) => void;
    permission?: (message: Discord.Message) => boolean;
    onNoPerm: (message: Discord.Message) => void;
    hidden?: boolean;
};


export interface SlashCommand {
    type: "SlashCommand";
    name: string;
    desc: string;
    args?: SlashCommandArgument[];
    run: (interaction: SlashCommandInteraction) => void;
    permission?: (interaction: SlashCommandInteraction) => boolean;
    onNoPerm: (interaction: SlashCommandInteraction) => void;
};

export interface SlashCommandArgument {
    name: string;
    description: string;
    type: SlashCommandArgumentType;
    required?: boolean;
    options?: SlashCommandArgument[];
    choices?: SlashCommandChoice[];
};

export enum SlashCommandArgumentType {
    "SUB_COMMAND" = 1, "SUB_COMMAND_GROUP", "STRING", "INTEGER", "BOOLEAN", "USER", "CHANNEL", "ROLE"
};

export interface SlashCommandChoice {
    name: string;
    value: string | number;
}

export class SlashCommandInteraction {

    bot: Discord.Client;
    id: Discord.Snowflake;
    command: SlashCommandResponse;
    args: Map<string, ArgResponseValue>;
    member: Discord.GuildMember;
    token: string;
    channel: any;

    constructor(bot: Discord.Client, id: Discord.Snowflake, command: SlashCommandResponse, member_small: Discord.GuildMember, token: string, channel_id: Discord.Snowflake, guild_id: Discord.Snowflake) {
        this.bot = bot;
        this.id = id;
        this.command = command;
        this.args = ArgsToMap(command.options);
        this.member = this.bot.guilds.cache.get(guild_id)?.members.cache.get(member_small.user.id)!;
        this.token = token;
        this.channel = this.bot.guilds.cache.get(guild_id)?.channels.cache.get(channel_id);
    }

    async AcknowledgeReply(message: string) {

        //@ts-ignore
        this.bot.api.interactions(this.id, this.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: message
                }
            }
        });
    }

    Acknowledge() {
        //@ts-ignore
        this.bot.api.interactions(this.id, this.token).callback.post({
            data: {
                type: 4,
                data:{
                    content: "ㅤ"
                }
            }
        });
    }
};

export interface SlashCommandResponse {
    id: Discord.Snowflake,
    name: string,
    options: SlashCommandArgumentResponse[]
};

export interface SlashCommandArgumentResponse {
    name: string,
    value: any,
    options: SlashCommandArgumentResponse[]
};

export interface ArgResponseValue {
    value: any;
    options: Map<string, ArgResponseValue>;
}


export class SnowflakeCommandHandler {

    bot: Discord.Client;
    prefix: string;
    messageCommands: MessageCommand[];
    slashCommands: SlashCommand[];
    interactWithBot: boolean;

    constructor(bot: Discord.Client, prefix: string, acceptBot: boolean) {
        this.bot = bot;
        this.messageCommands = [];
        this.slashCommands = [];
        this.prefix = prefix;
        this.interactWithBot = acceptBot;
    }

    DeclareMessageCommand(command: MessageCommand): void {
        if (!this.messageCommands.find(cmd => cmd.name === command.name.toLowerCase()))
            this.messageCommands.push(command);
        else throw "The specified message command has already been declared!";
    }

    HandleMessageCommand(msg: Discord.Message): void {
        if (!msg.content.startsWith(this.prefix) ||
            (!this.interactWithBot && msg.author.bot)
            || !msg.member)
            return;

        const args: string[] = msg.content.toLowerCase().slice(this.prefix.length).trim().split(" ");

        const command = this.messageCommands.find(cmd => cmd.name === args[0]);
        if (!command) { msg.channel.send("There is no such command :/"); return; }

        if (command.permission)
            if (!command.permission(msg))
                return command.onNoPerm(msg);

        return command.run(msg, args.slice(1));
    }

    GetMessageCommandInfo(commandName: string): MessageCommand {
        return this.messageCommands.find(cmd => cmd.name === commandName && !cmd.hidden)!;
    }

    async GetAppCommands(guildId?: string): Promise<any> {
        if (guildId)
            //@ts-ignore
            return await this.bot.api.applications(this.bot.user!.id).guilds(guildId).commands.get();
        else
            //@ts-ignore
            return await this.bot.api.applications(this.bot.user!.id).commands.get();
    }

    async DeclareSlashCommand(command: SlashCommand, guildId?: string): Promise<void> {
        if (this.slashCommands.find(cmd => cmd.name === command.name.toLowerCase())) throw "The specified slash command has already been declared!";

        var appCommands;
        if (guildId)
            appCommands = await this.GetAppCommands(guildId);
        else appCommands = await this.GetAppCommands()
        //@ts-ignore
        if (!appCommands.find(cmd => cmd.name === command.name)) {

            if (guildId) {
                //@ts-ignore
                this.bot.api.applications(this.bot.user!.id).guilds(guildId).commands.post({
                    data: {
                        name: command.name,
                        description: command.desc,
                        options: command.args
                    }
                });
                console.log(`- Posted slash command to guild ${this.bot.guilds.cache.get(guildId)?.name} with name ${command.name}`);
            }
            else {
                //@ts-ignore
                this.bot.api.applications(this.bot.user!.id).commands.post({
                    data: {
                        name: command.name,
                        description: command.desc,
                        options: command.args
                    }
                });
                console.log(`- Posted slash command globally with name ${command.name}`);
            }
        }

        this.slashCommands.push({ type: "SlashCommand", name: command.name, desc: command.desc, run: command.run, onNoPerm: command.onNoPerm, args: command.args, permission: command.permission });
    }

    async DeleteSlashCommand(commandName: string, guildId?: string): Promise<void> {
        var appCommands;
        if (guildId)
            appCommands = await this.GetAppCommands(guildId);
        else appCommands = await this.GetAppCommands();

        //@ts-ignore
        const cmd = appCommands.find(cmd => cmd.name === commandName);
        if (!cmd) throw "The specified slash command doesn't exist!";

        if (guildId) {
            //@ts-ignore
            await this.bot.api.applications(this.bot.user!.id).guilds(guildId).commands(cmd.id).delete();
            console.log(`- Deleted slash command ${commandName} from guild ${this.bot.guilds.cache.get(guildId)?.name}`);
        }
        else {
            //@ts-ignore
            await this.bot.api.applications(this.bot.user!.id).commands(cmd.id).delete();
            console.log(`- Deleted global slash command ${commandName}`);
        }



    }

    HandleSlashCommand(interaction: any): void {
        const commandInteraction = new SlashCommandInteraction(this.bot, interaction.id, { id: interaction.data.id, name: interaction.data.name, options: interaction.data.options }, interaction.member, interaction.token, interaction.channel_id, interaction.guild_id);
        const command = this.slashCommands.find(cmd => cmd.name === commandInteraction.command.name);

        if (!command) return console.log(`! An error has occured while trying to execute slash command ${commandInteraction.command.name}: The command hasn't been declared.`);

        if (command.permission)
            if (!command.permission(commandInteraction))
                return command.onNoPerm(commandInteraction);

        return command.run(commandInteraction);
    }

};

function ArgsToMap(options: SlashCommandArgumentResponse[]): Map<string, ArgResponseValue> {

    if (!options) return new Map();

    var map = new Map<string, ArgResponseValue>();
    for (const option of options)
        map.set(option.name, { value: option.value, options: ArgsToMap(option.options) })

    return map;

}