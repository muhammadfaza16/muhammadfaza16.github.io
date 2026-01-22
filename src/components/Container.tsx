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
                paddingLeft: "clamp(1.5rem, 6vw, 3rem)",
                paddingRight: "clamp(1.5rem, 6vw, 3rem)"
            }}
            className={className}
        >
            {children}
        </div>
    );
}
