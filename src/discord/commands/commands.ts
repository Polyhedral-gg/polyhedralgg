import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

const ROLL_COMMAND = {
    name: "roll",
    description: "Roll some dice!",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "notation",
            description: "Whatcha wanna roll?",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
} as const;

export const commands = {
    roll: ROLL_COMMAND,
} as const;
