"use server";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import * as SpotifyWebApi from "@spotify/web-api-ts-sdk";

import * as dotenv from "dotenv";
dotenv.config();

const mimeType = "image/png";

async function geminiPromptWithImage(prompt: string, imageParts: any) {
  const genAI = new GoogleGenerativeAI(process.env.BARD_API_KEY);

  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  return text;
}

async function imageToTrackRecommendations(
  imageParts: any
): Promise<{ recommendations: string[] }> {
  const prompt = `You are an assistant that generates JSON. You always return JSON with no additional text. Please Generate a list of 5 songs in JSON format. The songs should relate to this image. Use the format like this example Example: {"recommendations": ["Song - Artist", "Song - Artist", ...]}.`;
  const response = await geminiPromptWithImage(prompt, imageParts);

  // Could make more durable with regex
  const responsePrime = response.substring(
    " ```json".length,
    response.length - "```".length
  );
  return JSON.parse(responsePrime);
}

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

export async function getRecommendationsFromImage(buf: any) {
  const imageParts = [
    {
      inlineData: {
        data: Buffer.from(buf).toString("base64"),
        mimeType,
      },
    },
  ];

  const recommendations = await imageToTrackRecommendations(imageParts);
  console.log(recommendations);

  const trackPromises = recommendations.recommendations.map(
    (recommendation: string) => spotifySearchForTrack(recommendation)
  );
  const allTracks = await Promise.all(trackPromises);

  return allTracks;
}
