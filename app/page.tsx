'use client'

import { useRouter } from 'next/navigation'
import { genres } from '@/data/genres'

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-6">
      <h1 className="text-4xl font-extrabold text-center mb-4 neon-text" style={{fontFamily:'Lobster, Cursive'}}>This OR That</h1>
      <p className="text-center text-lg text-gray-300 mb-10">Pick a genre to start the game!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {genres.map((genre) => (
          <div
            key={genre.id}
            onClick={() => router.push(`/vote/${genre.id}`)}
            className="relative cursor-pointer rounded-xl overflow-hidden group shadow-lg transform transition hover:scale-105"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80"
              style={{ backgroundImage: `url(${genre.image})` }} 
            />

            {/* Text on top */}
            <div className="relative z-10 flex items-center justify-center h-32">
              <h2 className="text-2xl font-bold">{genre.name}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Neon Text effect */}
      <style jsx>{`
        .neon-text {
          color: #fff;
          text-shadow:
            0 0 5px #f0f,
            0 0 10px #f0f,
            0 0 20px #f0f,
            0 0 40px #0ff,
            0 0 80px #0ff;
        }
      `}</style>
    </main>
  )
}
