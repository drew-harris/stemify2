import * as ytdl from "ytdl-core";
import * as spotify from "./spotify";

export async function getInfo(url: string, limit: number = 1) {
  if (!ytdl.validateURL(url)) {
    throw new Error("Invalid URL");
  }

  const info = await (await ytdl.getInfo(url)).videoDetails;
  let songs = [];
  if (info?.media?.song) {
    const queryTitle = info.media.song;
    const queryArtist = info.media.artist || "";
    songs = await spotify.getSongData(
      queryTitle + " " + queryArtist,
      false,
      limit
    );
  } else {
    const channelName = info.author.name.substring(
      0,
      info.author.name.indexOf(" - ")
    );
    console.log(channelName);
    songs = await spotify.getSongData(
      info.title + " " + channelName || "",
      false,
      limit
    );
  }
  return songs;
}
