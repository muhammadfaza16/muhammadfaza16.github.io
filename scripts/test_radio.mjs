import { getLiveRadioStatus } from '../src/lib/liveRadio';

async function test() {
    console.log("Testing Live Radio Engine...");
    try {
        const status = await getLiveRadioStatus();
        console.log("Status:", JSON.stringify(status, null, 2));
    } catch (e) {
        console.error("Engine Error:", e);
    }
}

test();
