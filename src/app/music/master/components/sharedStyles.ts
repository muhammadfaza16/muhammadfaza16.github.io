export const shellBg = "linear-gradient(180deg, #2d2d2d 0%, #252525 100%)";
export const shellBorder = "2px solid #111";
export const shellRadius = "24px";
export const shellShadow = "0 40px 70px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)";

export const insetBox = {
    background: "#1e1e1e",
    border: "1.5px solid #2a2a2a",
    borderRadius: "10px",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)"
};

export const inputStyle = {
    background: "#151515",
    border: "1.5px solid #222",
    borderRadius: "6px",
    padding: "0.6rem 0.7rem",
    color: "#ccc",
    fontFamily: "monospace",
    fontSize: "0.65rem",
    fontWeight: 600,
    outline: "none",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)"
};

export const primaryBtnStyle = {
    ...insetBox,
    padding: "8px 16px",
    color: "#39ff14",
    fontSize: "0.65rem",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px"
};

export const secondaryBtnStyle = {
    ...insetBox,
    padding: "8px 16px",
    color: "#555",
    fontSize: "0.6rem",
    fontWeight: 800
};
