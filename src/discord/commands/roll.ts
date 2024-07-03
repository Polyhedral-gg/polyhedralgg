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
    try {
        const notation = interaction.data.options[0] as APIApplicationCommandInteractionDataStringOption;
        const DiceRes: DiceParseResult = parse(notation.value);

        msg = `${DiceRes.msg} = **${DiceRes.val}**`;
    } catch (error) {
        if (error instanceof Error) {
            msg = error.message;
        } else {
            msg = "An error occured while parsing the command";
        }
    }

    return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: msg,
        },
    });
}
