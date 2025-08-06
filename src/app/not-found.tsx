import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <ThemeToggle />
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-8xl mb-8">🔍</div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Pokemon Not Found
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg mb-8">
            The Pokemon you're looking for seems to have escaped to tall grass!
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-block btn-primary text-lg px-8 py-3 hover:scale-105 transition-transform"
            >
              Return to Pokédex
            </Link>
            
            <div className="text-sm text-gray-500 dark:text-slate-400">
              <Link href="/compare" className="hover:text-blue-500 mx-2">
                Compare Pokemon
              </Link>
              •
              <Link href="/worldcup" className="hover:text-blue-500 mx-2">
                World Cup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
