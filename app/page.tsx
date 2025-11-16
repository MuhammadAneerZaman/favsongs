"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6">
      {/* Hero Section */}
      <section className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          🎵 Welcome to FavSongs
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Organize and manage your favorite songs with ease.  
          Create an account, log in, and start building your personalized playlist today.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg shadow hover:bg-gray-300 transition-colors"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">✨ Easy Management</h2>
          <p className="text-gray-600">
            Add, edit, and delete your favorite songs in just a few clicks.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">🔒 Secure Access</h2>
          <p className="text-gray-600">
            Your account is protected with authentication powered by NextAuth.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">🎧 Personalized</h2>
          <p className="text-gray-600">
            Build your own collection and access it anytime, anywhere.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-gray-500 text-sm">
        © {new Date().getFullYear()} FavSongs. All rights reserved.
      </footer>
    </main>
  );
}
