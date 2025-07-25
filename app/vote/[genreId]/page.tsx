'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { genres } from '@/data/genres';
import { optionsByGenre } from '@/data/options';
import { use } from 'react';

type Props = {
  params: Promise<{
    genreId: string;
  }>;
};

export default function GenreVotePage({ params }: Props) {
  const { genreId } = use(params);
  const router = useRouter();
  const genre = genres.find(g => g.id.toString() === genreId);
  const allOptions = genre ? optionsByGenre[genre.name.toLowerCase()] : [];

  const [round, setRound] = useState(1);
  const [index, setIndex] = useState(2);
  const [left, setLeft] = useState(allOptions[0]);
  const [right, setRight] = useState(allOptions[1]);
  const [animationSide, setAnimationSide] = useState<"left" | "right" | null>(null);
  const [animating, setAnimating] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Preload all images
    allOptions.forEach(option => {
      const img = new window.Image();
      img.src = option.imagePath;
    });
  }, []);

  useEffect(() => {
    let loaded = 0;
    const done = () => {
      loaded += 1;
      if (loaded === 2) setInitialLoading(false);
    };

    const timeout = setTimeout(() => setInitialLoading(false), 1500);

    const leftImg = new window.Image();
    const rightImg = new window.Image();

    leftImg.onload = done;
    leftImg.onerror = done;
    leftImg.src = left.imagePath;

    rightImg.onload = done;
    rightImg.onerror = done;
    rightImg.src = right.imagePath;

    return () => clearTimeout(timeout);
  }, [left, right]);

  if (!genre) notFound();

  if (!allOptions || allOptions.length < 2) {
    return <div>Not enough options to vote in this genre.</div>;
  }

  const handleVote = (choice: "left" | "right") => {
    if (animating) return;
    setAnimationSide(choice === "left" ? "right" : "left");
    setAnimating(true);

    setTimeout(() => {
      if (round >= allOptions.length - 1) {
        const winnerLabel = choice === "left" ? left.label : right.label;
        const winnerImage = choice === "left" ? left.imagePath : right.imagePath;
        router.push(`/result?winner=${encodeURIComponent(winnerLabel)}&image=${encodeURIComponent(winnerImage)}&genre=${encodeURIComponent(genre.name)}`);
        return;
      }

      const next = allOptions[index];
      if (choice === "left") {
        setRight(next);
      } else {
        setLeft(next);
      }

      setIndex(prev => prev + 1);
      setRound(prev => prev + 1);
      setAnimationSide(null);
      setAnimating(false);
    }, 300);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <div className="text-center">
          <div className="loader mb-4 mx-auto"></div>
          <h1 className="text-white text-2xl font-bold tracking-wider">Loading game...</h1>
        </div>
        <style jsx>{`
          .loader {
            width: 48px;
            height: 48px;
            border: 5px solid #fff;
            border-top: 5px solid #ff00cc;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#11013b] via-[#f9dbe2] to-[#570224] p-6 flex flex-col items-center">
      <h1 className="text-1xl md:text-1xl font-bold text-center bg-white bg-clip-text text-transparent mb-8 tracking-wide" style={{ fontFamily: 'Satisfy, monospace' }}>
        Which one do you like more?
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full mt-10">
        <button
          onClick={() => handleVote("left")}
          className={`w-[200px] h-[220px] bg-gray-100 rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-200 relative ${animationSide === "left" ? "swipe-out-left" : ""}`}
          disabled={animating}
        >
          <Image
            src={left.imagePath}
            alt={left.label}
            width={200}
            height={220}
            unoptimized
            className="object-cover h-full w-full border-2 border-white rounded-xl shadow-2xl"
          />
          <div className="absolute bottom-0 w-full bg-black/40 text-white text-sm text-center py-1 rounded-b-xl backdrop-blur-sm">
            {left.label}
          </div>
        </button>

        <div className="flex items-center justify-center w-full md:w-auto">
          <div className="flex md:hidden items-center w-full gap-2 text-gray-500 text-lg font-semibold">
            <div className="flex-1 border-t border-gray-400" />
            <div className="px-2">VS</div>
            <div className="flex-1 border-t border-gray-400" />
          </div>
          <div className="hidden md:flex flex-col items-center px-4 text-gray-500 text-lg font-semibold">
            <div className="h-6 border-l border-gray-400" />
            <div>VS</div>
            <div className="h-6 border-l border-gray-400" />
          </div>
        </div>

        <button
          onClick={() => handleVote("right")}
          className={`w-[200px] h-[220px] bg-gray-100 rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-200 relative ${animationSide === "right" ? "swipe-out-right" : ""}`}
          disabled={animating}
        >
          <Image
            src={right.imagePath}
            alt={right.label}
            width={200}
            height={220}
            unoptimized
            className="object-cover h-full w-full border-2 border-white rounded-xl shadow-md"
          />
          <div className="absolute bottom-0 w-full bg-black/40 text-white text-sm text-center py-1 rounded-b-xl shadow-black">
            {right.label}
          </div>
        </button>
      </div>

      <p className="mt-6 text-gray-600 text-sm">Round {round} of {allOptions.length - 1}</p>
    </div>
  );
}
