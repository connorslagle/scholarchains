import { Card, CardContent } from '@/components/ui/card';
import { Bitcoin, Network, FileCheck, Users } from 'lucide-react';

export function FeaturedSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          How It Works
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          A revolutionary approach to scholarly publishing that combines cutting-edge protocols
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <ProcessCard
          step="1"
          icon={<FileCheck className="h-8 w-8" />}
          title="Upload to Blossom"
          description="Store your PDF and datasets on content-addressable Blossom servers. Files are identified by their SHA-256 hash."
          color="from-blue-500 to-cyan-500"
        />
        
        <ProcessCard
          step="2"
          icon={<Bitcoin className="h-8 w-8" />}
          title="Bitcoin Anchor"
          description="Your paper is timestamped with the current Bitcoin block hash, creating an immutable proof of existence."
          color="from-orange-500 to-amber-500"
        />
        
        <ProcessCard
          step="3"
          icon={<Network className="h-8 w-8" />}
          title="Publish to Nostr"
          description="Metadata is broadcast to Nostr relays. No single entity can censor or remove your work."
          color="from-purple-500 to-pink-500"
        />
        
        <ProcessCard
          step="4"
          icon={<Users className="h-8 w-8" />}
          title="Peer Review"
          description="Receive transparent, signed reviews from the community. Build reputation and earn Lightning tips."
          color="from-green-500 to-emerald-500"
        />
      </div>

      {/* Technical Stack Info */}
      <div className="mt-16 max-w-4xl mx-auto">
        <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 text-center">
              Built on Proven Protocols
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <TechCard
                name="Nostr"
                description="Decentralized pub/sub protocol for metadata distribution"
                link="https://github.com/nostr-protocol/nips"
              />
              <TechCard
                name="Blossom"
                description="Content-addressable blob storage for immutable files"
                link="https://github.com/hzrd149/blossom"
              />
              <TechCard
                name="Bitcoin"
                description="Block-hash anchoring for cryptographic timestamps"
                link="https://bitcoin.org"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProcessCard({
  step,
  icon,
  title,
  description,
  color,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r opacity-25 group-hover:opacity-50 rounded-2xl blur transition duration-300" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
      
      <Card className="relative h-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300">
        <CardContent className="p-6 space-y-4">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${color} text-white`}>
            {icon}
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white font-bold text-sm`}>
              {step}
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              {title}
            </h3>
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function TechCard({ name, description, link }: { name: string; description: string; link: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg group"
    >
      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {name}
      </h4>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </a>
  );
}
