import { useSeoMeta } from '@unhead/react';
import { Hero } from '@/components/Hero';
import { PaperFeed } from '@/components/PaperFeed';
import { FeaturedSection } from '@/components/FeaturedSection';

const Index = () => {
  useSeoMeta({
    title: 'ScholarChains - Decentralized Scholarly Publishing',
    description: 'Censorship-resistant research publishing on Nostr with Bitcoin-anchored timestamps. Publish papers, share datasets, and receive peer reviews in a fully open and decentralized ecosystem.',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Hero />
      <FeaturedSection />
      <PaperFeed />
    </div>
  );
};

export default Index;
