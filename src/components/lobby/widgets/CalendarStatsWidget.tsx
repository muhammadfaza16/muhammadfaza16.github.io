"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalIcon, GitBranch } from "lucide-react";
import Link from "next/link";
import { AnimatedNumber } from "../AnimatedNumber";

interface CalendarStatsWidgetProps {
    swipeDirection: number;
    prayer: any;
    now: Date;
    isMobile: boolean;
    holidayMap: Map<number, string>;
    githubPushDays: Set<number>;
    tooltipInfo: { day: number; text: string } | null;
    setTooltipInfo: (t: { day: number; text: string } | null) => void;
    football: any;
    setShowMatchesPopup: (v: boolean) => void;
    matchPage: number;
    visibleMatches: any[];
    MONTHS_FULL: string[];
    DAYS_FULL: string[];
    calendarGrid: (number | null)[];
    github: any;
}

export function CalendarStatsWidget({
    swipeDirection,
    prayer,
    now,
    isMobile,
    holidayMap,
    githubPushDays,
    tooltipInfo,
    setTooltipInfo,
    football,
    setShowMatchesPopup,
    matchPage,
    visibleMatches,
    MONTHS_FULL,
    DAYS_FULL,
    calendarGrid,
    github
}: CalendarStatsWidgetProps) {
    return (
        <motion.div
            key="calendar-stats"
            custom={swipeDirection}
            variants={{
                initial: (d: number) => ({ opacity: 0, x: d * 15 }),
                animate: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -15 })
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "0.85rem",
                alignItems: "start",
                position: "relative",
                zIndex: 1,
            }}
        >
            {/* ── Calendar Card (inset within glass) ── */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(0, 0, 0, 0.12)",
                borderRadius: "18px",
                padding: isMobile ? "0.85rem 0.75rem" : "1rem 0.9rem",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                width: isMobile ? "175px" : "190px",
            }}>
                {/* Month header */}
                <div
                    title={prayer?.hijriDate || undefined}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: isMobile ? "0.75rem" : "0.82rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.85)",
                        marginBottom: "0.5rem",
                        cursor: prayer?.hijriDate ? "help" : "default"
                    }}>
                    <CalIcon size={13} strokeWidth={2} />
                    {MONTHS_FULL[now.getMonth()]}
                </div>

                {/* Weekday Headers */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    textAlign: "center",
                    fontSize: isMobile ? "0.5rem" : "0.55rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "3px",
                    letterSpacing: "0.02em",
                }}>
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i}>{d}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "2px 1px",
                    fontSize: "0.68rem",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.8)",
                    textAlign: "center",
                }}>
                    {calendarGrid.map((d, i) => {
                        const isToday = d === now.getDate();
                        const isHoliday = d ? holidayMap.has(d) : false;
                        const isGithubDay = d ? githubPushDays.has(d) : false;
                        const hasDots = isHoliday || isGithubDay;
                        const holidayName = d ? holidayMap.get(d) : undefined;

                        // Build tooltip text
                        const tooltipParts: string[] = [];
                        if (holidayName) tooltipParts.push(`🔴 ${holidayName}`);
                        if (isGithubDay) tooltipParts.push('🟢 GitHub push');
                        const tooltipText = tooltipParts.join(' · ');

                        return (
                            <div
                                key={i}
                                onClick={() => d && hasDots ? setTooltipInfo(tooltipInfo?.day === d ? null : { day: d, text: tooltipText }) : setTooltipInfo(null)}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "3px 0",
                                    borderRadius: "6px",
                                    color: isToday ? "white" : isHoliday ? "#ff6b6b" : (d ? "rgba(255,255,255,0.85)" : "transparent"),
                                    background: isToday ? "linear-gradient(135deg, #ff3b30 0%, #ff6b4a 50%, #ff9500 100%)" : "transparent",
                                    boxShadow: isToday ? "0 0 10px rgba(255,59,48,0.5), 0 0 20px rgba(255,149,0,0.2)" : "none",
                                    animation: isToday ? "today-pulse 2.5s ease-in-out infinite" : "none",
                                    fontWeight: isToday ? 700 : isHoliday ? 600 : 400,
                                    fontSize: isMobile ? "0.6rem" : "0.65rem",
                                    cursor: hasDots ? "pointer" : "default",
                                    lineHeight: 1.2,
                                }}>
                                <span>{d}</span>
                                {d && hasDots && (
                                    <div style={{
                                        display: "flex",
                                        gap: "1.5px",
                                        marginTop: "1px",
                                    }}>
                                        {isHoliday && <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#ff6b6b" }} />}
                                        {isGithubDay && <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#4ade80" }} />}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Tooltip overlay */}
                {tooltipInfo && (
                    <div style={{
                        marginTop: "0.3rem",
                        padding: "4px 8px",
                        background: "rgba(0,0,0,0.6)",
                        borderRadius: "8px",
                        fontSize: "0.6rem",
                        color: "white",
                        textAlign: "center",
                        fontWeight: 500,
                        backdropFilter: "blur(10px)",
                    }}>
                        {tooltipInfo.text}
                    </div>
                )}

                {/* Upcoming Matches */}
                {football && football.matches.length > 0 && (
                    <div style={{ marginTop: "1.2rem" }}>
                        <div
                            onClick={() => setShowMatchesPopup(true)}
                            style={{
                                fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" as const,
                                letterSpacing: "0.04em", color: "rgba(255,255,255,0.5)",
                                marginBottom: "0.25rem",
                                display: "flex", alignItems: "center", gap: "0.3rem",
                                cursor: "pointer",
                                justifyContent: "space-between",
                            }}>
                            <span>⚽ Upcoming</span>
                            <span style={{ fontSize: "0.5rem", opacity: 0.6 }}>See all →</span>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={matchPage}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.35 }}
                                style={{ display: "flex", flexDirection: "column", gap: "3px" }}
                            >
                                {visibleMatches.map((m: any, i: number) => (
                                    <div key={`${matchPage}-${i}`} style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        fontSize: "0.58rem",
                                        padding: "5px 6px",
                                        borderRadius: "6px",
                                        background: "rgba(255,255,255,0.06)",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                                            <span style={{ fontSize: "0.52rem" }}>{m.leagueEmoji}</span>
                                            <span>{m.homeAbbr}</span>
                                            <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: "0.5rem" }}>vs</span>
                                            <span>{m.awayAbbr}</span>
                                        </div>
                                        <div style={{
                                            color: "rgba(255,255,255,0.5)",
                                            fontSize: "0.52rem",
                                            fontWeight: 500,
                                            textAlign: "right",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                            lineHeight: 1.1,
                                            minWidth: "40px",
                                        }}>
                                            {m.state === "in" ? (
                                                <span style={{ color: "#4ade80", fontWeight: 700, whiteSpace: "nowrap" }}>{m.liveMinute || "LIVE"}<br />{m.homeScore}-{m.awayScore}</span>
                                            ) : m.state === "post" ? (
                                                <span>{m.homeScore}-{m.awayScore}<br /><span style={{ fontSize: "0.45rem", opacity: 0.8 }}>FT</span></span>
                                            ) : (
                                                <>
                                                    <span style={{ whiteSpace: "nowrap" }}>{m.date}</span>
                                                    <span style={{ whiteSpace: "nowrap" }}>{m.time}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ── Live Stats (Right — API-powered) ── */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem",
                paddingTop: "0.15rem",
                minWidth: 0,
            }}>
                {/* Time Progress Stats */}
                {(() => {
                    const dayProgress = Math.round(((now.getHours() * 60 + now.getMinutes()) / 1440) * 100);
                    const monthProgress = Math.round((now.getDate() / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()) * 100);
                    const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
                    const endOfYear = new Date(now.getFullYear() + 1, 0, 1).getTime();
                    const yearProgress = Math.round(((now.getTime() - startOfYear) / (endOfYear - startOfYear)) * 100);

                    return (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(0,0,0,0.12)", padding: isMobile ? "12px 14px" : "14px 18px", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.05)" }}>
                            <div style={{ fontSize: isMobile ? "0.65rem" : "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Time Stats</div>

                            {/* Day Progress */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: isMobile ? "0.52rem" : "0.58rem", fontWeight: 700 }}>
                                    <span style={{ color: "rgba(255,255,255,0.7)", textTransform: "uppercase", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{DAYS_FULL[now.getDay()]}</span>
                                    <span style={{ color: "#34d399", textShadow: "0 1px 4px rgba(52,211,153,0.3)" }}>
                                        <AnimatedNumber value={dayProgress} />%
                                    </span>
                                </div>
                                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)" }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${dayProgress}%` }}
                                        transition={{ duration: 1.5, type: "spring", damping: 30, stiffness: 200 }}
                                        style={{ height: "100%", background: "#34d399", borderRadius: "3px" }}
                                    />
                                </div>
                            </div>

                            {/* Month Progress */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: isMobile ? "0.52rem" : "0.58rem", fontWeight: 700 }}>
                                    <span style={{ color: "rgba(255,255,255,0.7)", textTransform: "uppercase", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{MONTHS_FULL[now.getMonth()]}</span>
                                    <span style={{ color: "#60a5fa", textShadow: "0 1px 4px rgba(96,165,250,0.3)" }}>
                                        <AnimatedNumber value={monthProgress} />%
                                    </span>
                                </div>
                                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)" }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${monthProgress}%` }}
                                        transition={{ duration: 1.5, type: "spring", damping: 30, stiffness: 200, delay: 0.1 }}
                                        style={{ height: "100%", background: "#60a5fa", borderRadius: "3px" }}
                                    />
                                </div>
                            </div>

                            {/* Year Progress */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: isMobile ? "0.52rem" : "0.58rem", fontWeight: 700 }}>
                                    <span style={{ color: "rgba(255,255,255,0.7)", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{now.getFullYear()}</span>
                                    <span style={{ color: "#a78bfa", textShadow: "0 1px 4px rgba(167,139,250,0.3)" }}>
                                        <AnimatedNumber value={yearProgress} />%
                                    </span>
                                </div>
                                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)" }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${yearProgress}%` }}
                                        transition={{ duration: 1.5, type: "spring", damping: 30, stiffness: 200, delay: 0.2 }}
                                        style={{ height: "100%", background: "#a78bfa", borderRadius: "3px" }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* GitHub Benchmark */}
                <Link href="https://github.com/muhammadfaza16" target="_blank" style={{ marginTop: "0.3rem", textDecoration: "none" }}>
                    <motion.div
                        whileHover={{ scale: 1.02, y: -2, transition: { type: "spring", stiffness: 400, damping: 30 } }}
                        whileTap={{ scale: 0.98, y: 1, transition: { type: "spring", stiffness: 500, damping: 40 } }}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            backdropFilter: "blur(12px) saturate(120%)",
                            borderRadius: "18px",
                            padding: isMobile ? "0.6rem 0.8rem" : "0.7rem 0.9rem",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.1)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            cursor: "pointer",
                        }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: "0.35rem",
                            fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" as const,
                            letterSpacing: "0.03em", color: "rgba(255,255,255,0.95)",
                            marginBottom: "0.3rem",
                            textShadow: "0 1px 3px rgba(0,0,0,0.5)"
                        }}>
                            <GitBranch size={13} strokeWidth={2.5} />
                            GitHub
                        </div>
                        {github ? (
                            <>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                                    <span style={{ fontSize: isMobile ? "1rem" : "1.2rem", fontWeight: 800, color: "rgba(255,255,255,0.95)", lineHeight: 1, textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}>
                                        <AnimatedNumber value={github.currentMonthActiveDays} />
                                        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textShadow: "none" }}>/{github.currentMonthTotalDays}</span>
                                    </span>
                                    <span style={{ fontSize: isMobile ? "0.58rem" : "0.65rem", fontWeight: 500, color: "rgba(255,255,255,0.65)", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                                        days active
                                    </span>
                                </div>
                                <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.55)", marginTop: "0.2rem", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <span style={{ color: "#4ade80", fontWeight: 700, textShadow: "0 1px 3px rgba(74,222,128,0.4)" }}>
                                        <AnimatedNumber value={github.currentMonthPushCount} />
                                    </span> commits/pushes
                                </div>
                                {github.recentRepo && (
                                    <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.45)", marginTop: "0.3rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontStyle: "italic" }}>
                                        <span style={{ fontWeight: 600 }}>Last touched:</span> {github.recentRepo}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>Loading···</div>
                        )}
                    </motion.div>
                </Link>

            </div>
        </motion.div>
    );
}

