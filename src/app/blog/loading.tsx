import { Container } from "@/components/Container";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
    return (
        <section className="py-16 md:py-24">
            <Container>
                {/* Page Header Skeleton */}
                <div className="mb-16 ">
                    <Skeleton className="h-10 w-32 mb-4" /> {/* "Blog" Title */}
                    <Skeleton className="h-5 w-full max-w-lg" /> {/* Description line 1 */}
                    <Skeleton className="h-5 w-3/4 max-w-md mt-2" /> {/* Description line 2 */}
                </div>

                {/* Posts List Skeleton */}
                <div className="space-y-12">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <Skeleton className="h-8 w-3/4 max-w-xl" /> {/* Title */}
                                <Skeleton className="h-4 w-24" /> {/* Date */}
                            </div>
                            <Skeleton className="h-16 w-full max-w-3xl" /> {/* Excerpt */}
                            <Skeleton className="h-4 w-32" /> {/* Read more */}
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
