import { Container } from "@/components/Container";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
    return (
        <Container className="py-24">
            <div className="space-y-8 ">
                {/* Header Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4 max-w-lg" />
                    <Skeleton className="h-6 w-1/2 max-w-md" />
                </div>

                {/* Content Skeleton */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-64 w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
}
