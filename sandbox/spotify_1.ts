import * as SpotifyWebApi from "@spotify/web-api-ts-sdk";

import * as dotenv from "dotenv";
dotenv.config();

async function spotifySearchForTrack(trackQuery: string) {
  const sdk = SpotifyWebApi.SpotifyApi.withClientCredentials(
    // @ts-ignore
    process.env.SPOTIFY_CLIENT_ID,
    process.env.SPOTIFY_CLIENT_SECRET
  );

  const item = await sdk.search(trackQuery, ["track"]);

  return {
    songName: item.tracks.items[0].name,
    artistName: item.tracks.items[0].artists[0].name,
    songLink: item.tracks.items[0].external_urls.spotify,
    imageHref: item.tracks.items[0].album.images[0].url,
  };
}

async function run() {
  const queries = ["The Beatles", "The Weeknd"];

  const promises = queries.map((query) => spotifySearchForTrack(query));
  const allResults = await Promise.all(promises);

  console.log(allResults);
}

run();
