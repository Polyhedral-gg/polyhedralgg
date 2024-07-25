import {
    type APIApplicationCommandInteractionDataStringOption,
    InteractionResponseType,
    MessageFlags,
    type APIChatInputApplicationCommandInteraction,
} from "discord-api-types/v10";
import { NextResponse } from "next/server";
import parse, { type DiceParseResult } from "~/dice/parser";

export default function roll(interaction: APIChatInputApplicationCommandInteraction): NextResponse {
    if (!interaction.data.options || interaction.data.options.length < 1) {
        return NextResponse.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: "Please enter the notation to run!",
                flags: MessageFlags.Ephemeral,
            },
        });
    }

    let msg = "";
    let didError = false;
    try {
        const notation = interaction.data.options[0] as APIApplicationCommandInteractionDataStringOption;
        const DiceRes: DiceParseResult = parse(notation.value);

        msg = `${DiceRes.msg} = **${DiceRes.val}**`;
    } catch (error) {
        didError = true;
        if (error instanceof Error) {
            msg = "Error: " + error.message;
        } else {
            msg = "An error occured while parsing the command";
        }
    }

    if (msg.length >= 2000) {
        msg = "Error: Response was longer than discord's max message length";
        didError = true;
    }

    let msgFlags = 0;
    if (didError) msgFlags |= MessageFlags.Ephemeral;

    return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: msg,
            flags: msgFlags,
            allowedMentions: {
                parse: [],
            },
        },
    });
}
