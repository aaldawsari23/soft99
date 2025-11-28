interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="text-6xl mb-4 animate-float">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-text-secondary mb-6 max-w-md">{description}</p>
            )}
            {action && (
                <button onClick={action.onClick} className="btn-primary">
                    {action.label}
                </button>
            )}
        </div>
    );
}
