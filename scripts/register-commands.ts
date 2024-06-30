import { commands } from "~/discord/commands/commands";
import { env } from "./env";

const URL = `https://discord.com/api/v10/applications/${env.DISCORD_CLIENT_ID}/commands`;

async function main() {
    console.log(JSON.stringify(Object.values(commands)));
    const response = await fetch(URL, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
        },
        method: "PUT",
        body: JSON.stringify(Object.values(commands)),
    });

    if (response.ok) {
        console.log("Registered commands");
        console.log(JSON.stringify(await response.json(), null, 2));
    } else {
        console.error("Error registering commands");
        let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
        try {
            const error = await response.text();
            if (error) {
                errorText = `${errorText} \n\n ${error}`;
            }
        } catch (err) {
            console.error("Error reading body from request:", err);
        }
        console.error(errorText);
    }
}

await main();
