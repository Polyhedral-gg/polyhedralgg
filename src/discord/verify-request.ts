import type { APIChatInputApplicationCommandInteraction, APIPingInteraction } from "discord-api-types/v10";
import nacl from "tweetnacl";

function verifyWithNacl(appPublicKey: string, signature: string, rawBody: string, timestamp: string) {
    return nacl.sign.detached.verify(
        Buffer.from(timestamp + rawBody),
        Buffer.from(signature, "hex"),
        Buffer.from(appPublicKey, "hex"),
    );
}

export type VerifyRequestResult =
    | { isValid: false }
    | { isValid: true; interaction: APIPingInteraction | APIChatInputApplicationCommandInteraction };

export async function verifyInteraction(request: Request, appPublicKey: string): Promise<VerifyRequestResult> {
    const signature = request.headers.get("x-signature-ed25519");
    const timestamp = request.headers.get("x-signature-timestamp");

    if (typeof signature !== "string" || typeof timestamp !== "string") {
        return { isValid: false };
    }

    const rawBody = await request.text();
    const isValidRequest = signature && timestamp && verifyWithNacl(appPublicKey, signature, rawBody, timestamp);
    if (!isValidRequest) {
        return { isValid: false };
    }

    return {
        interaction: JSON.parse(rawBody) as APIPingInteraction | APIChatInputApplicationCommandInteraction,
        isValid: true,
    };
}
