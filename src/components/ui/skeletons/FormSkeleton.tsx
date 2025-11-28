export function FormSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-2">
                <div className="h-4 bg-white/5 rounded w-1/4" />
                <div className="h-10 bg-white/5 rounded" />
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-white/5 rounded w-1/4" />
                <div className="h-10 bg-white/5 rounded" />
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-white/5 rounded w-1/4" />
                <div className="h-32 bg-white/5 rounded" />
            </div>
        </div>
    );
}
