require('dotenv').config({ path: ['.env.local', '.env'] });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.Book.deleteMany();
    await prisma.WishlistItem.deleteMany();
    console.log("Purged old data");
    const books = [
        {
            title: "Attitude Is Everything",
            author: "Jeff Keller",
            coverImage: "https://covers.openlibrary.org/b/isbn/9789381431444-L.jpg",
            review: "Change your attitude... and you change your life!",
            rating: 5
        },
        {
            title: "Atomic Habits",
            author: "James Clear",
            coverImage: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
            review: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
            rating: 5
        },
        {
            title: "The Practicing Mind",
            author: "Thomas M. Sterner",
            coverImage: "https://covers.openlibrary.org/b/isbn/9781608680900-L.jpg",
            review: "Developing Focus and Discipline in Your Life.",
            rating: 4
        },
        {
            title: "Do It Today",
            author: "Darius Foroux",
            coverImage: "https://covers.openlibrary.org/b/isbn/9780143452126-L.jpg",
            review: "Overcome procrastination, improve productivity and achieve more meaningful things.",
            rating: 4
        }
    ];
    for (const b of books) {
        await prisma.Book.create({ data: b });
    }

    const items = [
        {
            name: "MacBook Pro M4 Max",
            price: "Rp 65.000.000",
            url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290",
            priority: "High"
        },
        {
            name: "Sony A7R V",
            price: "Rp 60.000.000",
            url: "https://m.media-amazon.com/images/I/81xU2pY00fL._AC_UF894,1000_QL80_.jpg",
            priority: "Medium"
        }
    ];
    for (const i of items) {
        await prisma.WishlistItem.create({ data: i });
    }
    console.log("Seeded database successfully");
}

main().catch(console.error).finally(() => prisma.$disconnect());
