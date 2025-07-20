'use client';
import { Suspense, useEffect, useState } from 'react';
import confetti, { Options } from 'canvas-confetti';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [winner, setWinner] = useState('');
  const [genre, setGenre] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    const winnerParam = searchParams.get('winner');
    const genreParam = searchParams.get('genre');
    const imageParam = searchParams.get('image');

    if (!winnerParam || !genreParam || !imageParam) return;

    setWinner(winnerParam);
    setGenre(genreParam);
    setImage(imageParam);

    fireConfetti();
  }, [searchParams]);

  const fireConfetti = () => {
    const defaults = { origin: { y: 0.6 } };

    function fire(particleRatio: number, opts: Options) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(200 * particleRatio),
      }));
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0, y: 0.5 },
    });
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 1, y: 0.5 },
    });
  };

  if (!winner || !genre || !image) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center text-lg">
        Invalid result. Please <button onClick={() => router.push('/')} className="underline text-blue-500">go vote again</button>.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <h1 className="text-3xl font-bold mb-4">🏆Winner</h1>
      <p className="text-xl mb-4">
        In <span className="font-semibold text-purple-600">{genre}</span>, your top pick is:
      </p>

      <div className="bg-white rounded-xl shadow-xl p-4">
        <Image
          src={image}
          alt={winner}
          width={300}
          height={300}
          className="rounded-lg object-cover mb-4 border-2 border-black"
        />
        <h2 className="text-2xl text-black text-center neon-text" style={{ fontFamily: 'Lobster, Cursive' }}>{winner}</h2>
      </div>

      <button
        onClick={() => router.push('/')}
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Vote Again
      </button>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading result...</div>}>
      <ResultContent />
    </Suspense>
  );
}
