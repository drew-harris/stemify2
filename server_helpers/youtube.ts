import * as ytdl from "ytdl-core";
import * as spotify from "./spotify";

export async function getInfo(url: string, limit: number = 1) {
  if (!ytdl.validateURL(url)) {
    throw new Error("Invalid URL");
  }

  const info = await (await ytdl.getInfo(url)).videoDetails;
  let songs: any[] = [];
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

    console.log(songs);

    // Filter out the non explict songs if there is a matching explicit song
    if (songs.length > 1) {
      for (let i = 0; i < songs.length; i++) {
        if (!songs[i].explicit) {
          for (let j = 0; j < songs.length; j++) {
            if (songs[j].explicit && songs[j].title == songs[i].title) {
              songs = songs.filter((song) => song.id !== songs[i].id);
              break;
            }
          }
        }
      }
    }
  }
  return songs;
}
