// Discord js bot singleton

import { Client } from "discord.js";

let _client: any = new Client();
let clientReady = false;

export async function getClient(): Promise<Client> {
  if (!clientReady) {
    init();
    // Return client when ready
    return new Promise((resolve, reject) => {
      _client.on("ready", () => {
        clientReady = true;
        resolve(_client);
      });
    });
  } else {
    return _client;
  }
}

function init() {
  _client.login(process.env.DISCORD_BOT_TOKEN);
}

export async function sendDiscordDM(userId: string, embed: object) {
  try {
    const client = await getClient();
    const user = await client.users.fetch(userId);
    const dm = await user.createDM();
    // Create embed
    await dm.send({ embed });
  } catch (error) {
    console.log(error);
    return;
  }
}
