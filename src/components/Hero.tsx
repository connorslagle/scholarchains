import { Button } from '@/components/ui/button';
import { BookOpen, Shield, Lock, Zap, GitBranch, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export function Hero() {
  const { user } = useCurrentUser();

  return (
    <div className="relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-400/5 dark:via-indigo-400/5 dark:to-purple-400/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo and title */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-800 shadow-lg">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Decentralized Research Publishing
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent leading-tight">
            ScholarChains
          </h1>

          <p className="text-xl sm:text-2xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Publish research papers with <span className="font-semibold text-blue-600 dark:text-blue-400">Bitcoin-anchored timestamps</span>, 
            censorship-resistant storage, and transparent peer review.
          </p>

          {/* Key features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8">
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Censorship-Resistant"
              description="Published on Nostr relays, impossible to take down"
            />
            <FeatureCard
              icon={<Lock className="h-5 w-5" />}
              title="Immutable Timestamps"
              description="Bitcoin block-hash anchoring proves existence"
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Lightning Tips"
              description="Reward authors and reviewers instantly"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            {user ? (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
              >
                <Link to="/publish">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Publish a Paper
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <LoginArea className="w-full max-w-xs" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Sign in to publish your research
                </p>
              </div>
            )}
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6"
            >
              <Link to="/explore">
                Explore Research
              </Link>
            </Button>
          </div>

          {/* Secondary features */}
          <div className="flex flex-wrap justify-center gap-6 pt-12 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Open Source Protocol</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Reputation System</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Peer Review</span>
            </div>
          </div>

          {/* Attribution */}
          <div className="pt-8">
            <a
              href="https://soapbox.pub/mkstack"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Vibed with MKStack
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
