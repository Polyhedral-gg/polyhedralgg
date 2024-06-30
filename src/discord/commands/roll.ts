import { InteractionResponseType, type APIChatInputApplicationCommandInteraction } from "discord-api-types/v10";
import { NextResponse } from "next/server";

export default function roll(interaction: APIChatInputApplicationCommandInteraction): NextResponse {
    return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: "Result: 2",
        },
    });
}
