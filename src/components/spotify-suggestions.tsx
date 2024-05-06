"use client";

/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/FyQRKVW7Mex
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Syne } from 'next/font/google'
import { Comfortaa } from 'next/font/google'

syne({
  subsets: ['latin'],
  display: 'swap',
})

comfortaa({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa6";
import React, { useState, useRef } from "react";
import { getRecommendationsFromImage } from "../../functions/getRecommendationsForImage";
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPG", "PNG", "GIF"];

export function SpotifySuggestions() {
  const [file, setFile] = useState<File | null>(null);
  const [buf, setBuf] = useState(null);
  const [image, setImage] = useState(null);

  const handleChange = async (file: File) => {
    setFile(file);
    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);
    const ab = await file.arrayBuffer();

    setBuf(Buffer.from(ab));
  };

  const fileInputRef = useRef(null);

  const handleImageSelect = () => {
    // Triggering a click on the file input element
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
    }
  };

  const videoRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");

  const handleCaptureImage = async () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL();
      setImgSrc(dataURL);
    }
  };

  const handleStartCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing camera:", err));
  };

  const handleStopCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  };

  type SpotifyTrack = {
    songName: string;
    artistName: string;
    songLink: string;
    imageHref: string;
  };

  const [spotifyTracks, setSpotifyTracks] = useState<null | SpotifyTrack[]>(
    null
  );

  async function handleSubmit(b: any): void {
    const resp = await getRecommendationsFromImage(b);
    setSpotifyTracks(resp);
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-green-400 to-green-600">
      <header className="flex items-center h-14 px-4 border-b sm:h-16 lg:px-6">
        <div className="flex items-center gap-2">
          <MusicIcon className="h-6 w-6 text-spotify" />
          <span className="text-lg font-semibold">Spotify</span>
        </div>
        <nav className="ml-auto flex items-center gap-4 lg:gap-6">
          <Button className="h-8 text-xs" variant="outline">
            <FaGithub />
            &nbsp; Github
          </Button>
        </nav>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="container mx-auto grid gap-4 grid-cols-2 text-center">
          <div>
            <h1 className="text-2xl font-bold">Upload your image</h1>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="container mx-auto grid ">
                <FileUploader
                  classes="drop_area drop_zone"
                  handleChange={handleChange}
                  name="file"
                  types={fileTypes}
                  children={
                    <img
                      alt="Uploaded image"
                      className="rounded-lg object-cover border border-gray-200 w-full aspect-square overflow-hidden dark:border-gray-800 dark:border-gray-800"
                      src={image || "/placeholder-image.jpg"}
                    />
                  }
                />
              </div>

              {/* <div>
                <button onClick={handleCaptureImage}>Capture Image</button>
                <br></br>

                <button onClick={handleStopCamera}>Stop Camera</button>
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={handleStartCamera}
              >
                Start Camera
              </Button> */}
              {buf === null ? (
                <Button className="w-full" disabled={true}>
                  Submit
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleSubmit(JSON.parse(JSON.stringify(buf)))}
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Top Suggestions</h1>
            <ul className="grid gap-4">
              {spotifyTracks?.map((spotifyTrack) => {
                return (
                  <li className="flex items-center gap-4">
                    <img
                      alt="Song Image"
                      className="aspect-square rounded-lg object-cover overflow-hidden"
                      height={100}
                      src={spotifyTrack.imageHref}
                      width={100}
                    />
                    <div className="grid gap-1.5">
                      <h3 className="font-bold">{spotifyTrack.songName}</h3>
                      <p className="text-sm text-gray-500 light:text-gray-400">
                        {spotifyTrack.artistName}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MusicIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function PlayIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}