"use client";

import { Film } from "lucide-react";

const MOVIES = [
    { title: "Interstellar", year: "2014", color: "from-blue-900 to-black" },
    { title: "Everything Everywhere All At Once", year: "2022", color: "from-purple-900 to-pink-900" },
    { title: "The Grand Budapest Hotel", year: "2014", color: "from-pink-400 to-purple-500" },
    { title: "Inception", year: "2010", color: "from-slate-700 to-slate-900" },
    { title: "Arrival", year: "2016", color: "from-gray-800 to-black" },
    { title: "Past Lives", year: "2023", color: "from-blue-200 to-blue-400" },
];

export function CinemaWall() {
    return (
        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800">
            <h2 className="font-mono text-xl text-neutral-400 mb-6 flex items-center gap-2">
                <Film className="w-4 h-4" />
                CINEMA_LOGS
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {MOVIES.map((movie, i) => (
                    <div
                        key={i}
                        className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 cursor-pointer"
                    >
                        {/* Poster Placeholder Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${movie.color} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />

                        {/* Title Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <h3 className="font-serif text-lg leading-tight text-white">{movie.title}</h3>
                            <span className="font-mono text-xs text-neutral-400 mt-1">{movie.year}</span>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <div className="aspect-[2/3] rounded-lg border border-dashed border-neutral-800 flex items-center justify-center text-neutral-700 hover:text-neutral-500 hover:border-neutral-700 transition-colors cursor-pointer">
                    <span className="text-4xl font-thin">+</span>
                </div>
            </div>
        </div>
    );
}
