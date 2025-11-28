'use client';

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function AdminHeader({ title, description, action }: AdminHeaderProps) {
  return (
    <div className="bg-neutral-900 border-b border-white/5 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="text-neutral-400 text-sm mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
