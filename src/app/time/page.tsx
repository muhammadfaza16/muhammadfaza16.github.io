"use client";

import { Container } from "@/components/Container";
import { useEffect, useState, useRef } from "react";

// Configuration
const DEFAULT_BIRTH_DATE = "2000-01-01";
const LIFE_EXPECTANCY_YEARS = 80;
const TOTAL_WEEKS = LIFE_EXPECTANCY_YEARS * 52;
const TOTAL_MONTHS = LIFE_EXPECTANCY_YEARS * 12;
const TOTAL_YEARS = LIFE_EXPECTANCY_YEARS;

// Helper to get weeks between dates
function getWeeksDiff(d1: Date, d2: Date) {
    return Math.floor((d2.getTime() - d1.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

// Helper to get months between dates
function getMonthsDiff(d1: Date, d2: Date) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

// Helper to get years between dates
function getYearsDiff(d1: Date, d2: Date) {
    let years = d2.getFullYear() - d1.getFullYear();
    const m = d2.getMonth() - d1.getMonth();
    if (m < 0 || (m === 0 && d2.getDate() < d1.getDate())) {
        years--;
    }
    return years < 0 ? 0 : years;
}

// Helper to format date
function formatDate(date: Date) {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Helper to add weeks to a date
function addWeeks(date: Date, weeks: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + weeks * 7);
    return result;
}

// Helper to add months to a date
function addMonths(date: Date, months: number) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

// Helper to add years to a date
function addYears(date: Date, years: number) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
}

export default function TimePage() {
    const [mounted, setMounted] = useState(false);
    const [birthDateStr, setBirthDateStr] = useState(DEFAULT_BIRTH_DATE);
    const [viewMode, setViewMode] = useState<'weeks' | 'months' | 'years'>('months');

    // Derived state
    const birthDate = new Date(birthDateStr);
    const now = new Date();
    const weeksLived = getWeeksDiff(birthDate, now);
    const monthsLived = getMonthsDiff(birthDate, now);
    const yearsLived = getYearsDiff(birthDate, now);

    useEffect(() => {
        setMounted(true);
        const savedDate = localStorage.getItem("memento_birthdate");
        if (savedDate) {
            setBirthDateStr(savedDate);
        }
    }, []);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setBirthDateStr(date);
        localStorage.setItem("memento_birthdate", date);
    };

    if (!mounted) return null;

    let totalUnits, unitsLived, unitLabel;

    switch (viewMode) {
        case 'weeks':
            totalUnits = TOTAL_WEEKS;
            unitsLived = weeksLived;
            unitLabel = 'Minggu';
            break;
        case 'years':
            totalUnits = TOTAL_YEARS;
            unitsLived = yearsLived;
            unitLabel = 'Tahun';
            break;
        case 'months':
        default:
            totalUnits = TOTAL_MONTHS;
            unitsLived = monthsLived;
            unitLabel = 'Bulan';
            break;
    }

    const unitsRemaining = totalUnits - unitsLived;
    const percentageLived = Math.min(100, Math.max(0, (unitsLived / totalUnits) * 100)).toFixed(1);

    return (
        <Container>
            <div className="animate-fade-in-up" style={{
                maxWidth: "60rem",
                margin: "0 auto",
                paddingTop: "3rem",
                paddingBottom: "6rem",
                minHeight: "80vh"
            }}>
                <header style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <h1 style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        marginBottom: "1rem"
                    }}>
                        Memento Mori
                    </h1>
                    <p style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.2rem",
                        color: "var(--text-secondary)",
                        fontStyle: "italic",
                        maxWidth: "600px",
                        margin: "0 auto 2rem auto"
                    }}>
                        "Ingatlah bahwa kamu akan mati."
                    </p>

                    {/* Settings / Controls */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1.5rem"
                    }}>
                        {/* View Toggle */}
                        <div style={{ display: "flex", gap: "0.5rem", background: "var(--card-bg)", padding: "4px", borderRadius: "99px", border: "1px solid var(--border)" }}>
                            <button
                                onClick={() => setViewMode('years')}
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    padding: "0.4rem 1rem",
                                    borderRadius: "99px",
                                    backgroundColor: viewMode === 'years' ? "var(--foreground)" : "transparent",
                                    color: viewMode === 'years' ? "var(--background)" : "var(--text-secondary)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    border: "none",
                                    fontWeight: viewMode === 'years' ? 600 : 400
                                }}
                            >
                                TAHUN
                            </button>
                            <button
                                onClick={() => setViewMode('months')}
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    padding: "0.4rem 1rem",
                                    borderRadius: "99px",
                                    backgroundColor: viewMode === 'months' ? "var(--foreground)" : "transparent",
                                    color: viewMode === 'months' ? "var(--background)" : "var(--text-secondary)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    border: "none",
                                    fontWeight: viewMode === 'months' ? 600 : 400
                                }}
                            >
                                BULAN
                            </button>
                            <button
                                onClick={() => setViewMode('weeks')}
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    padding: "0.4rem 1rem",
                                    borderRadius: "99px",
                                    backgroundColor: viewMode === 'weeks' ? "var(--foreground)" : "transparent",
                                    color: viewMode === 'weeks' ? "var(--background)" : "var(--text-secondary)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    border: "none",
                                    fontWeight: viewMode === 'weeks' ? 600 : 400
                                }}
                            >
                                MINGGU
                            </button>
                        </div>

                        {/* Birthdate Input Trigger */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.8rem",
                                color: "var(--text-secondary)",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em"
                            }}>
                                Tanggal Lahir:
                            </span>
                            <input
                                type="date"
                                value={birthDateStr}
                                onChange={handleDateChange}
                                style={{
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    backgroundColor: "var(--background)",
                                    color: "var(--foreground)",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.8rem",
                                    cursor: "pointer"
                                }}
                            />
                        </div>
                    </div>
                </header>

                {/* Stats */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "4rem",
                    textAlign: "center"
                }}>
                    {[
                        { val: unitsLived.toLocaleString(), label: `${unitLabel} Berlalu` },
                        { val: unitsRemaining.toLocaleString(), label: `${unitLabel} Tersisa` },
                        { val: `${percentageLived}%`, label: "Kehidupan" }
                    ].map((stat, i) => (
                        <div key={i} style={{
                            padding: "1.5rem",
                            borderRadius: "12px",
                            backgroundColor: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "1.75rem",
                                fontWeight: 300,
                                color: "var(--foreground)",
                                marginBottom: "0.25rem"
                            }}>
                                {stat.val}
                            </div>
                            <div style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "var(--text-secondary)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em"
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grid Visualization */}
                <div style={{
                    marginBottom: "6rem",
                    textAlign: "center"
                }}>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: viewMode === 'years' ? "12px" : (viewMode === 'months' ? "6px" : "3px"),
                        margin: "0 auto",
                        maxWidth: viewMode === 'weeks' ? "100%" : "50rem"
                    }}>
                        {Array.from({ length: totalUnits }).map((_, i) => {
                            const isLived = i < unitsLived;
                            // Calculate dates based on view mode
                            let startDate, endDate;
                            if (viewMode === 'weeks') {
                                startDate = addWeeks(birthDate, i);
                                endDate = addWeeks(startDate, 1);
                            } else if (viewMode === 'months') {
                                startDate = addMonths(birthDate, i);
                                endDate = addMonths(startDate, 1);
                            } else {
                                startDate = addYears(birthDate, i);
                                endDate = addYears(startDate, 1);
                            }

                            // Age calculation
                            let age;
                            if (viewMode === 'weeks') age = Math.floor(i / 52);
                            else if (viewMode === 'months') age = Math.floor(i / 12);
                            else age = i;

                            return (
                                <div
                                    key={i}
                                    title={`Usia ${age} | ${formatDate(startDate)}`}
                                    style={{
                                        width: viewMode === 'years' ? "24px" : (viewMode === 'months' ? "10px" : "4px"),
                                        height: viewMode === 'years' ? "24px" : (viewMode === 'months' ? "10px" : "4px"),
                                        borderRadius: "50%",
                                        backgroundColor: isLived ? "var(--foreground)" : "var(--border)",
                                        opacity: isLived ? 0.8 : 0.3,
                                        transition: "opacity 0.2s ease"
                                    }}
                                    className={isLived ? "hover:opacity-100" : ""}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Philosophical Copy */}
                <div style={{ maxWidth: "65ch", margin: "0 auto" }} className="prose-editorial">
                    <h2>Tentang Waktu Anda</h2>
                    <p>
                        Setiap titik di atas mewakili satu {unitLabel.toLowerCase()} kehidupan Anda.
                        Jika Anda beruntung hidup hingga {LIFE_EXPECTANCY_YEARS} tahun, Anda memiliki
                        sekitar {TOTAL_YEARS} tahun, {TOTAL_MONTHS.toLocaleString()} bulan, atau {TOTAL_WEEKS.toLocaleString()} minggu.
                    </p>
                    <blockquote>
                        "Bukan bahwa kita memiliki waktu yang singkat untuk hidup, tetapi bahwa kita membuang banyak darinya."
                        <br />
                        <span style={{ fontSize: "1rem", marginTop: "1rem", display: "block", color: "var(--text-secondary)" }}>— Seneca</span>
                    </blockquote>
                    <p>
                        Melihat kehidupan Anda tervisualisasi seperti ini mungkin terasa menakutkan, tetapi tujuannya bukan untuk membuat Anda depresi.
                        Tujuannya adalah urgensi. Titik-titik yang telah terisi (hitam) adalah masa lalu yang tidak bisa diubah.
                        Titik-titik yang transparan adalah masa depan, namun mereka tidak dijamin.
                    </p>
                    <p>
                        Apa yang akan Anda lakukan dengan titik {unitLabel.toLowerCase()} ini?
                    </p>
                </div>

                <footer style={{
                    textAlign: "center",
                    marginTop: "6rem",
                    paddingTop: "2rem",
                    borderTop: "1px solid var(--border)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)"
                }}>
                    <div>Data tersimpan di browser Anda.</div>
                    <div style={{ marginTop: "0.5rem" }}>Asumsi usia harapan hidup {LIFE_EXPECTANCY_YEARS} tahun.</div>
                </footer>
            </div>
        </Container>
    );
}
