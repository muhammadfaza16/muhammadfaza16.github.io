import "react";

declare module "react" {
    interface CSSProperties {
        "--widget-accent"?: string;
        [key: string]: string | number | undefined;
    }
}
