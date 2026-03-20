
async function test() {
    try {
        const res = await fetch("http://localhost:3000/api/curation?limit=8&sortBy=popularity");
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Data:", data);
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
