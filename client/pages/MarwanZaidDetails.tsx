import React from "react";

export default function MarwanZaidDetails() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-egypt-black via-gray-900 to-egypt-black flex items-center justify-center p-8">
      <div className="max-w-xl w-full text-center space-y-6">
        <img
          src="/placeholder.svg"
          alt="Marwan Zaid"
          className="mx-auto w-48 h-48 rounded-lg object-cover shadow-2xl"
        />

        <h1 className="text-2xl md:text-4xl font-bold text-egypt-gold">
          MY apps,games,websites
        </h1>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <a
            href="https://www.tiktok.com/@marwanzaid_pablo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-egypt-sand underline"
          >
            TikTok
          </a>
          <a
            href="https://www.instagram.com/marwanzaid_pablo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-egypt-sand underline"
          >
            Instagram
          </a>
        </div>

        <div className="text-sm text-egypt-sand/80">Phone: </div>
      </div>
    </div>
  );
}
