
import { Mail } from 'lucide-react';
import BackgroundParticles from '@/components/BackgroundParticles';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden p-4">
      <BackgroundParticles />
      
      {/* Top-left positioned site title */}
      <div className="absolute top-4 left-4 z-20">
        <h1 
          className="text-2xl sm:text-3xl font-bold font-headline leading-tight"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          <div>Roots</div>
          <div>and Remedies</div>
        </h1>
      </div>

      {/* Centered "Coming Soon..." message */}
      <div className="relative z-10 text-center">
        <p 
          className="text-5xl sm:text-6xl md:text-7xl font-bold coming-soon-text-animation font-headline"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          Coming Soon...
        </p>
      </div>

      {/* Bottom-center positioned email address and icon */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2">
        <Mail className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--foreground))' }} />
        <a 
          href="mailto:info@rootandremedies.in" 
          className="text-xs sm:text-sm font-medium"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          info@rootandremedies.in
        </a>
      </div>
    </main>
  );
}
