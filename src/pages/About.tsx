import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Shield, Lock, Zap, Network, Bitcoin, GitBranch, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  useSeoMeta({
    title: 'About ScholarChains - Decentralized Research Publishing',
    description: 'Learn about ScholarChains, a censorship-resistant scholarly publishing platform built on Nostr, Blossom, and Bitcoin.',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-800 shadow-lg">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                About the Project
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100">
              The Future of Scholarly Publishing
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              ScholarChains is a fully decentralized, censorship-resistant platform for publishing and reviewing academic research.
            </p>
          </div>

          {/* Problem Statement */}
          <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl">The Problem</CardTitle>
              <CardDescription>
                Current scholarly publishing systems are broken
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                Existing centralized repositories like arXiv and institutional servers suffer from critical vulnerabilities:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  <span><strong>Single points of failure:</strong> Central servers can go offline, lose data, or be shut down</span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  <span><strong>Censorship risk:</strong> Politically motivated content removal and policy-driven takedowns</span>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  <span><strong>No provenance guarantees:</strong> Papers can be altered after publication without proof</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  <span><strong>Opaque incentives:</strong> Reviewers aren't compensated, authors can't receive direct support</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Solution */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            <CardHeader>
              <CardTitle className="text-2xl">Our Solution</CardTitle>
              <CardDescription className="dark:text-slate-300">
                Three proven protocols working together
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <ProtocolCard
                  icon={<Network className="h-6 w-6" />}
                  name="Nostr"
                  description="A lightweight, relay-based pub/sub protocol for publishing signed metadata events. Because relays only forward messages, no single relay can block or modify the data."
                  link="https://github.com/nostr-protocol/nips"
                />
                
                <ProtocolCard
                  icon={<BookOpen className="h-6 w-6" />}
                  name="Blossom"
                  description="A content-addressable, append-only blob store that guarantees immutability of actual files (PDFs, datasets, etc.). Files are identified by their SHA-256 hash."
                  link="https://github.com/hzrd149/blossom"
                />
                
                <ProtocolCard
                  icon={<Bitcoin className="h-6 w-6" />}
                  name="Bitcoin Block Anchoring"
                  description="Each paper includes the hash of the most recent Bitcoin block. This provides a cryptographic timestamp proving the paper existed no later than that block's time—with no transaction fees."
                  link="https://bitcoin.org"
                />
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="space-y-4">
                <Step
                  number={1}
                  title="Upload to Blossom"
                  description="Author uploads a PDF to Blossom; the service returns the SHA-256 hash and a public URL."
                />
                <Step
                  number={2}
                  title="Publish to Nostr"
                  description="The front-end creates a Nostr event containing the blob hash and current Bitcoin block hash. The event is signed with the author's key and broadcast to relays."
                />
                <Step
                  number={3}
                  title="Instant Discovery"
                  description="Relays disseminate the event instantly. Anyone can query and discover papers through the global relay network."
                />
                <Step
                  number={4}
                  title="Bitcoin Proof"
                  description="The Bitcoin block hash creates an immutable, publicly verifiable proof of existence for every paper. Optional: daily Merkle root can be written on-chain."
                />
                <Step
                  number={5}
                  title="Peer Review"
                  description="Community members write signed reviews that are also published to Nostr. Reviews can include ratings, verdicts, and specific aspect evaluations."
                />
                <Step
                  number={6}
                  title="Lightning Tips"
                  description="Authors and reviewers can receive Lightning tips directly, creating transparent incentives for quality work."
                />
              </ol>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureItem
                  icon={<GitBranch className="h-5 w-5" />}
                  title="Fully Open Source"
                  description="Every component is publicly auditable and can be forked or self-hosted"
                />
                <FeatureItem
                  icon={<Bitcoin className="h-5 w-5" />}
                  title="Zero TX Costs"
                  description="Bitcoin block hash is fetched from APIs—no per-paper fees"
                />
                <FeatureItem
                  icon={<Network className="h-5 w-5" />}
                  title="Decentralized Storage"
                  description="Multiple Blossom nodes can replicate blobs; multiple relays forward metadata"
                />
                <FeatureItem
                  icon={<Shield className="h-5 w-5" />}
                  title="Censorship Resistant"
                  description="No single entity can remove or alter published work"
                />
                <FeatureItem
                  icon={<Zap className="h-5 w-5" />}
                  title="Lightning Payments"
                  description="Tip authors and reviewers instantly with micro-payments"
                />
                <FeatureItem
                  icon={<Award className="h-5 w-5" />}
                  title="Transparent Reputation"
                  description="Community-driven quality signals without gatekeeping"
                />
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl">Technical Implementation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Custom Nostr Event Kinds
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        Kind 32623
                      </Badge>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Research Paper (addressable, updatable by author)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        Kind 4597
                      </Badge>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Peer Review (permanent, immutable record)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Bitcoin Anchoring
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Every event includes a <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">b</code> tag 
                    with format: <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">["b", "height", "block-hash"]</code>
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    File Storage
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Papers reference Blossom blobs via SHA-256 hashes in <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">h</code> tags. 
                    Files are immutable and can be retrieved from any Blossom server holding the hash.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Ready to Join the Revolution?
              </h2>
              <p className="text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                Start publishing censorship-resistant research today. No permissions needed, no gatekeepers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Link to="/publish">
                    Publish Your Research
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/explore">
                    Explore Papers
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ProtocolCard({
  icon,
  name,
  description,
  link,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
  link: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg group"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <li className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div className="flex-1 pt-1">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
          {title}
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
    </li>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">
          {title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}
