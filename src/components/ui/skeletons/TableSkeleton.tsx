export function TableSkeleton() {
    return (
        <div className="w-full animate-pulse">
            <div className="h-10 bg-white/5 rounded-t-lg mb-1" />
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-white/5 mb-1 last:rounded-b-lg" />
            ))}
        </div>
    );
}
