const fs = require('fs');
let text = fs.readFileSync('src/components/lobby/CleanHomeHero.tsx', 'utf-8');

// 1. Imports
text = text.replace("import { useLyrics } from \"@/hooks/useLyrics\";", 
    "import { CalendarStatsWidget } from \"./widgets/CalendarStatsWidget\";\n" +
    "import { MusicWidget } from \"./widgets/MusicWidget\";\n" +
    "import { NewsWidget } from \"./widgets/NewsWidget\";\n" +
    "import { CryptoWidget } from \"./widgets/CryptoWidget\";");

// 2. WIDGETS array
text = text.replace("const WIDGETS = ['calendar', 'music', 'news', 'crypto', 'pulse'] as const;", "const WIDGETS = ['calendar', 'music', 'news', 'crypto'] as const;");

// 3. Lyrics Hook
text = text.replace("const { lyrics } = useLyrics(currentSong?.title || \"\");", "");

// 4. activeLyricIndex
text = text.replace(/const activeLyricIndex = useMemo\([\s\S]+?\}, \[lyrics, currentTime\]\);/, "");

// 5. Lyrics auto scroll
text = text.replace(/useEffect\(\(\) => \{[\s\S]+?\}, \[activeLyricIndex\]\);/, "");

// 6. Pulse state
text = text.replace(/const \[pulse, setPulse\] = useState<any>\(null\);\n?/, "");

// 7. pulse fetch
const pulseFetchPattern = /const fetchPulse = async \(\) => \{[\s\S]+?catch \(e\) \{[\s\S]+?\}\n\s*\};\n/;
text = text.replace(pulseFetchPattern, "");

// 8. Promise.all fetches
text = text.replace("fetchPulse(), ", "");
text = text.replace(", fetchPulse()", "");
text = text.replace("fetchPulse()", "");

// 9. Replace huge AnimatePresence block
const startMark = "<AnimatePresence mode=\"popLayout\" initial={false} custom={swipeDirection}>";
const endMark = "                </AnimatePresence>";

const startIdx = text.indexOf(startMark);
if (startIdx === -1) throw new Error("Start mark not found");

// Because there are multiple </AnimatePresence> (e.g. in MatchesPopup), we need the exact one right before the dot indicators.
// So let's find the closing tag right before ` {/* Widget Toggle — iOS page dots */}`
const dotsMark = "{/* Widget Toggle — iOS page dots */}";
const dotsIdx = text.indexOf(dotsMark, startIdx);
if (dotsIdx === -1) throw new Error("Dots mark not found");

// We find the last `</AnimatePresence>` before `dotsIdx`
const endIdx = text.lastIndexOf("</AnimatePresence>", dotsIdx);
if (endIdx === -1) throw new Error("End mark not found");

const replacement = `<AnimatePresence mode="popLayout" initial={false} custom={swipeDirection}>
                    {WIDGETS[widgetIndex] === 'calendar' && (
                        <CalendarStatsWidget
                            swipeDirection={swipeDirection}
                            prayer={prayer}
                            now={now}
                            isMobile={isMobile}
                            holidayMap={holidayMap}
                            githubPushDays={githubPushDays}
                            tooltipInfo={tooltipInfo}
                            setTooltipInfo={setTooltipInfo}
                            football={football}
                            setShowMatchesPopup={setShowMatchesPopup}
                            matchPage={matchPage}
                            visibleMatches={visibleMatches}
                            MONTHS_FULL={MONTHS_FULL}
                            calendarGrid={calendarGrid}
                            github={github}
                        />
                    )}
                    {WIDGETS[widgetIndex] === 'music' && (
                        <MusicWidget
                            swipeDirection={swipeDirection}
                            isPlaying={isPlaying}
                            currentSong={currentSong}
                            song={currentSong?.title ? currentSong.title : currentSong?.name ? currentSong.name.replace(".m4a", "") : "Select a track"}
                            artist={currentSong?.artist || "Various Artists"}
                            currentTime={currentTime}
                            duration={duration}
                            togglePlay={togglePlay}
                            prevSong={prevSong}
                            nextSong={nextSong}
                            seekTo={seekTo}
                        />
                    )}
                    {WIDGETS[widgetIndex] === 'crypto' && (
                        <CryptoWidget
                            cryptoData={cryptoData}
                            swipeDirection={swipeDirection}
                        />
                    )}
                    {WIDGETS[widgetIndex] === 'news' && (
                        <NewsWidget
                            news={news}
                            swipeDirection={swipeDirection}
                            newsPage={newsPage}
                            visibleNews={visibleNews}
                            onMouseEnter={() => setNewsHovered(true)}
                            onMouseLeave={() => setNewsHovered(false)}
                        />
                    )}
                `;

text = text.substring(0, startIdx) + replacement + text.substring(endIdx);

fs.writeFileSync('src/components/lobby/CleanHomeHero.tsx', text);
console.log('Successfully updated CleanHomeHero.tsx');
