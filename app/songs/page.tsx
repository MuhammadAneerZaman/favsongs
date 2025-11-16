"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Favorite = { id: string; song: string };

export default function SongsPage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [songs, setSongs] = useState<Favorite[]>([]);
  const [newSong, setNewSong] = useState("");
  const [editSong, setEditSong] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // Protect route + fetch songs
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetch("/api/songs", { credentials: "include" })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => setSongs(Array.isArray(data) ? data : []))
        .catch(() => setSongs([]));
    }
  }, [status, router]);

  // Create
  async function addSong() {
    if (!newSong) return;
    const res = await fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song: newSong }),
      credentials: "include",
    });
    const data = await res.json();
    setSongs([...songs, data]);
    setNewSong("");
  }

  // Update
  async function updateSong(id: string) {
    if (!editSong) return;
    const res = await fetch("/api/songs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, song: editSong }),
      credentials: "include",
    });
    const data = await res.json();
    setSongs(songs.map((s) => (s.id === id ? data : s)));
    setEditId(null);
    setEditSong("");
  }

  // Delete
  async function deleteSong(id: string) {
    await fetch("/api/songs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      credentials: "include",
    });
    setSongs(songs.filter((s) => s.id !== id));
  }

  if (status === "loading") return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      {/* Header with Logout */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🎵 Favorite Songs</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      <p className="mb-4 text-gray-600">Welcome, {session?.user?.email}</p>

      {/* Add new song */}
      <div className="flex gap-2 mb-6">
        <input
          value={newSong}
          onChange={(e) => setNewSong(e.target.value)}
          placeholder="Enter song name"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={addSong}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Song
        </button>
      </div>

      {/* List songs */}
      <ul className="space-y-3">
        {Array.isArray(songs) && songs.length > 0 ? (
          songs.map((song) => (
            <li key={song.id} className="flex items-center justify-between border-b pb-2">
              {editId === song.id ? (
                <div className="flex gap-2 w-full">
                  <input
                    value={editSong}
                    onChange={(e) => setEditSong(e.target.value)}
                    placeholder="Edit song name"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <button
                    onClick={() => updateSong(song.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{song.song}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditId(song.id);
                        setEditSong(song.song);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSong(song.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No songs found.</p>
        )}
      </ul>
    </div>
  );
}
