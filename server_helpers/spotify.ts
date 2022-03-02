import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Song = {
  title: string;
  artist: string;
  metadata: {
    spotTrackId: string;
    trackNum: string;
    spotAlbumId: string;
    albumTitle: string;
    albumArt: string;
    artist: string;
    artistId: string;
    previewUrl: string;
  };
  bpm: null;
};

let _token: any = null;

export const getToken = async () => {
  if (_token) {
    return _token;
  }
  const result = await prisma.spotify.findFirst();
  if (!result || !result.token || !result.expires) {
    throw new Error("No token found");
  }
  if (result.expires.getTime() < Date.now()) {
    _token = await getNewToken();
    return _token;
  }

  _token = result?.token;
  return _token;
};

const getNewToken = async () => {
  try {
    console.log("Getting new token");
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.SPOTIFY_BASE64}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials`,
    });
    if (!result.ok) {
      console.log(result);
      throw new Error("Error getting new token");
    }
    const data = await result.json();
    const expiration = Date.now() + data.expires_in * 1000;
    const date = new Date(expiration);
    await prisma.spotify.upsert({
      where: {
        id: "cl0912p9n00152kv5rfgrqex7",
      },
      update: {
        token: data.access_token,
        expires: date,
      },
      create: {
        token: data.access_token,
        expires: date,
      },
    });
    return data.access_token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function getSongData(title: string, filter: boolean) {
  let token = await getToken();
  const paramsObj = {
    q: filter ? getSongName(title) : title,
    type: "track",
    limit: "1",
    market: "US",
  };
  console.log("Searching Spotify for: " + title);
  let data;
  try {
    const result = await fetch(
      "https://api.spotify.com/v1/search?" + new URLSearchParams(paramsObj),
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (!result.ok) {
      // TODO:
      throw new Error("Unable to search Spotify for song");
    }
    data = await result.json();

    if (data.tracks.items.length == 0) {
      throw new Error("Unable to get song data");
    }

    const trackData = data.tracks.items[0];

    const betterOutput: Song = {
      title: trackData.name,
      artist: trackData.artists[0].name,
      metadata: {
        spotTrackId: trackData.id,
        trackNum: trackData.track_number,
        spotAlbumId: trackData.album.id,
        albumTitle: trackData.album.name,
        albumArt: trackData.album.images[1]?.url,
        artist: trackData.artists[0].name,
        artistId: trackData.artists[0].id,
        previewUrl: trackData.preview_url || null,
      },
      bpm: null,
    };

    betterOutput.bpm = await getBpm(betterOutput.metadata.spotTrackId);
    console.log(betterOutput);
    return betterOutput;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getBpm(spotifyId: string) {
  const token = await getToken();
  const result = await fetch(
    `https://api.spotify.com/v1/audio-features/${spotifyId}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!result.ok) {
    console.log(result);
    throw new Error("Unable to get BPM");
  }
  const data = await result.json();
  return data.tempo;
}

export async function getTrackNum(id: string) {
  const token = await getToken();
  const result = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  if (!(await result).ok) {
    console.log(result);
    throw new Error("Unable to get BPM");
  }
  const data = await result.json();
  return data.track_number;
}

function getSongName(filename: string) {
  let termArray = filename
    .toLowerCase()
    .replace(/[^a-z]/g, " ")
    .replace(/\s\s+/g, " ")
    .split(" ");

  let bannedWords = ["mp", "drums", "vocals", "other", "remix", "bass"];

  let songName = "";
  loop1: for (let i = 0; i < termArray.length; i++) {
    const word = termArray[i];
    if (word.length == 0) {
      continue;
    }

    for (let j = 0; j < bannedWords.length; j++) {
      if (word.includes(bannedWords[j])) {
        continue loop1;
      }
    }

    songName += word + " ";
  }
  console.log(songName);
  return songName;
}
