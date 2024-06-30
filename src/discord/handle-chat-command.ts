import { InteractionResponseType, type APIChatInputApplicationCommandInteraction } from "discord-api-types/v10";
import { NextResponse } from "next/server";
import { commands } from "./commands/commands";
import roll from "./commands/roll";

export default function handleChatCommand(interaction: APIChatInputApplicationCommandInteraction): NextResponse {
    const { name } = interaction.data;
    switch (name) {
        case commands.roll.name:
            return roll(interaction);
        default:
            console.error("Recieved an unknown chat command");
            return NextResponse.json({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content:
                        "An error occurred. No known command. Please report this error and what you did to discover it.",
                },
            });
    }

    return NextResponse.json({});
}
