export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`animate-pulse rounded-md bg-[var(--border)] opacity-50 ${className}`}
            {...props}
        />
    );
}
