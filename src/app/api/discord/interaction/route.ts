// ./pages/api/interaction.js

import { InteractionResponseType, InteractionType } from "discord-api-types/v10";
import { env } from "~/env";
import { verifyInteraction, type VerifyRequestResult } from "~/discord/verify-request";
import { NextResponse } from "next/server";
import handleCommand from "~/discord/handle-chat-command";

export async function POST(req: Request) {
    const verifyResult: VerifyRequestResult = await verifyInteraction(req, env.DISCORD_CLIENT_PUBLIC_KEY);
    if (!verifyResult.isValid || !verifyResult.interaction) return new NextResponse("Invalid request", { status: 401 });

    const { interaction } = verifyResult;

    if (interaction.type === InteractionType.Ping) {
        return NextResponse.json({
            type: InteractionResponseType.Pong,
        });
    } else if (interaction.type === InteractionType.ApplicationCommand) {
        return handleCommand(interaction);
    }
}
