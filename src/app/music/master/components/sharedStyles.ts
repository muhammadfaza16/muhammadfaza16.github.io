export const shellBg = (theme: string) => theme === "dark" ? "#0A0A0A" : "#f9f9f9";
export const shellBorder = (theme: string) => theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)";
export const shellRadius = "24px";
export const shellShadow = (theme: string) => theme === "dark" ? "0 40px 70px -15px rgba(0,0,0,0.7)" : "0 10px 30px rgba(0,0,0,0.03)";

export const getInsetBox = (theme: string) => ({
    background: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.45)",
    border: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
    borderRadius: "12px",
    boxShadow: theme === "dark" ? "0 10px 40px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.02)"
});

export const getInputStyle = (theme: string) => ({
    background: theme === "dark" ? "rgba(0,0,0,0.2)" : "#fff",
    border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
    borderRadius: "8px",
    padding: "0.6rem 0.7rem",
    color: theme === "dark" ? "#FFF" : "#000",
    fontFamily: "var(--font-mono), monospace",
    fontSize: "0.65rem",
    fontWeight: 600,
    outline: "none",
});

export const getPrimaryBtnStyle = (theme: string) => ({
    ...getInsetBox(theme),
    padding: "8px 16px",
    color: theme === "dark" ? "#10B981" : "#059669",
    fontSize: "0.65rem",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer"
});

export const getSecondaryBtnStyle = (theme: string) => ({
    ...getInsetBox(theme),
    padding: "8px 16px",
    color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
    fontSize: "0.6rem",
    fontWeight: 800,
    cursor: "pointer"
});
