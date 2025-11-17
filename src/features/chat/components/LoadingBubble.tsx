'use client';

export interface LoadingBubbleProps {
  message?: string;
  className?: string;
}

/**
 * Renders a loading state bubble (assistant thinking)
 * Displays animated thinking dots with optional message
 */
export const LoadingBubble: React.FC<LoadingBubbleProps> = ({
  message = 'Thinking...',
  className = '',
}) => {
  return (
    <div className={`flex justify-start mb-4 ${className}`}>
      <div className="bg-muted text-muted-foreground px-4 py-3 rounded-lg rounded-bl-none animate-slideUp">
        <div className="flex items-center gap-2">
          {/* Animated thinking dots */}
          <div className="flex gap-1.5">
            <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
            <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
            <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};
