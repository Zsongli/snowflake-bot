import Discord from "discord.js";
import { MessageCommand, SlashCommand, SlashCommandArgumentType } from "./SnowflakeCommandHandler";

import { messageCommand as HelpM, slashCommand as HelpS } from "./features/help";
import { messageCommand as PingM, slashCommand as PingS } from "./features/ping";
import { messageCommand as CoinflipM, slashCommand as CoinflipS } from "./features/coinflip";
import { messageCommand as TeamShuffleM, slashCommand as TeamShuffleS } from "./features/teamshuffle/teamshuffle";
import { messageCommand as JokeM, slashCommand as JokeS } from "./features/joke";
import { messageCommand as RpsM, slashCommand as RpsS } from "./features/rps";
import { messageCommand as CodeM } from "./features/code";
import { messageCommand as ShitSpeedrunM, slashCommand as ShitSpeedrunS } from "./features/speedrun/shitspeedrun";
import { messageCommand as PokimaneM, slashCommand as PokimaneS } from "./features/pokimane";
import { messageCommand as MusicM, slashCommand as MusicS } from "./features/music/music";
import { messageCommand as ColorsM, slashCommand as ColorsS } from "./features/colors/colors";

const global: (MessageCommand | SlashCommand)[] = [

    CodeM,

    HelpM,
    HelpS,

    PingM,
    PingS,

    CoinflipM,
    CoinflipS,

    JokeM,
    JokeS,

    ShitSpeedrunM,
    ShitSpeedrunS,

    TeamShuffleM,
    TeamShuffleS,

    RpsM,
    RpsS,

    PokimaneM,
    PokimaneS,

    MusicM,

    ColorsM,
    ColorsS

];


import { messageCommand as CsiterM, slashCommand as CsiterS } from "./features/csiter";

const snowflake: (MessageCommand | SlashCommand)[] = [

    CsiterM,
    CsiterS

];

export { global, snowflake };
