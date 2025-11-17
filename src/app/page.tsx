import { cn } from '@/shared/lib/cn';
import { APP_MODES } from '@/shared/lib/constants';
import Link from 'next/link';

export default function Home(): React.ReactNode {
  const modes = Object.values(APP_MODES);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container-main py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Groovie</h1>
          <p className="text-lg text-foreground/70">
            Personalized AI-powered learning tools for every student
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {modes.map((mode) => (
            <Link
              key={mode.id}
              href={`/${mode.id}`}
              className={cn(
                'group relative overflow-hidden rounded-xl border-2 border-border p-6',
                'transition-all duration-300',
                'hover:border-primary hover:shadow-lg hover:shadow-primary/20',
                mode.requiredAccess === 'premium'
                  ? 'bg-blue-50 hover:bg-blue-100'
                  : 'bg-white hover:bg-green-50'
              )}
            >
              {/* Badge for premium modes */}
              {mode.requiredAccess === 'premium' && (
                <div className="absolute right-4 top-4 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Premium
                </div>
              )}

              {/* Content */}
              <div className="relative z-10">
                <h2 className="mb-2 text-xl font-bold text-foreground">{mode.label}</h2>
                <p className="mb-4 text-sm text-foreground/70">{mode.description}</p>

                {/* CTA Button */}
                <div className="mt-6 inline-flex items-center text-primary font-medium group-hover:text-primary/80">
                  Get started
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>

              {/* Decorative background */}
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/50" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-foreground/60">
          <p>Get started with any mode above. Premium modes require an active subscription.</p>
        </div>
      </div>
    </main>
  );
}
