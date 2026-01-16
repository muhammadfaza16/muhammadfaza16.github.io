import { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
    return (
        <div
            style={{
                maxWidth: "64rem",
                marginLeft: "auto",
                marginRight: "auto",
                paddingLeft: "clamp(1rem, 5vw, 1.5rem)",
                paddingRight: "clamp(1rem, 5vw, 1.5rem)"
            }}
            className={className}
        >
            {children}
        </div>
    );
}
