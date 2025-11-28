export function ProductCardSkeleton() {
    return (
        <div className="bg-background-card rounded-2xl overflow-hidden border border-border animate-pulse">
            <div className="aspect-square bg-white/5" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
                <div className="h-6 bg-white/5 rounded w-1/3 mt-4" />
            </div>
        </div>
    );
}
