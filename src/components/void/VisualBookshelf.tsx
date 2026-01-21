"use client";

const BOOKS = [
    { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson", color: "bg-neutral-800" },
    { title: "Atomic Habits", author: "James Clear", color: "bg-amber-700" },
    { title: "Project Hail Mary", author: "Andy Weir", color: "bg-blue-900" },
    { title: "Dune", author: "Frank Herbert", color: "bg-orange-800" },
    { title: "Three Body Problem", author: "Cixin Liu", color: "bg-zinc-900" },
    { title: "Steve Jobs", author: "Walter Isaacson", color: "bg-gray-100 text-black border-gray-300" },
];

export function VisualBookshelf() {
    return (
        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 overflow-hidden">
            <h2 className="font-mono text-xl text-neutral-400 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                LIBRARY_DATABASE_V1
            </h2>

            {/* Shelf */}
            <div className="flex items-end gap-1 h-64 border-b-8 border-neutral-800 px-4 pb-0 overflow-x-auto">
                {BOOKS.map((book, i) => (
                    <div
                        key={i}
                        className={`
              relative group cursor-pointer transition-transform duration-300 hover:-translate-y-4
              w-12 h-${Math.floor(Math.random() * (60 - 48 + 1) + 48)} 
              ${book.color} 
              rounded-sm border-l border-white/10 shadow-lg
            `}
                        style={{ height: `${Math.floor(Math.random() * (14 - 10 + 1) + 10)}rem` }}
                    >
                        {/* Spine Text - Rotated */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="writing-vertical-rl text-[10px] md:text-sm font-bold tracking-wider opacity-80 whitespace-nowrap overflow-hidden text-ellipsis max-h-[90%] rotate-180">
                                {book.title}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-xs font-mono text-neutral-600">
                Total Volumes: {BOOKS.length} | Status: ARCHIVED
            </div>

            <style jsx>{`
        .writing-vertical-rl {
          writing-mode: vertical-rl;
        }
      `}</style>
        </div>
    );
}
