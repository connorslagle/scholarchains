import { usePapers } from '@/hooks/usePapers';
import { PaperCard } from '@/components/PaperCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { RelaySelector } from '@/components/RelaySelector';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useSearchPapers } from '@/hooks/usePapers';

export function PaperFeed() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: papers, isLoading, error } = usePapers({ limit: 20 });
  const { data: searchResults, isLoading: isSearching } = useSearchPapers(searchQuery);

  const displayPapers = searchQuery.length > 0 ? searchResults : papers;
  const loading = searchQuery.length > 0 ? isSearching : isLoading;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Latest Research
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Browse recently published papers on ScholarChains
            </p>
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-4">
            <RelaySelector className="w-full md:w-auto" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search papers by title, keywords, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-lg border-2 border-slate-200 dark:border-slate-800 focus:border-blue-400 dark:focus:border-blue-600"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-2 border-slate-200 dark:border-slate-800">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
            <CardContent className="py-12 px-8 text-center">
              <div className="max-w-sm mx-auto space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Failed to load papers. Please check your connection and try another relay.
                </p>
                <RelaySelector className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && displayPapers?.length === 0 && (
          <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
            <CardContent className="py-12 px-8 text-center">
              <div className="max-w-sm mx-auto space-y-6">
                <p className="text-slate-600 dark:text-slate-400">
                  {searchQuery.length > 0 
                    ? `No papers found matching "${searchQuery}". Try a different search or explore another relay.`
                    : 'No papers found. Try switching to another relay or be the first to publish!'
                  }
                </p>
                <RelaySelector className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Papers Grid */}
        {!loading && displayPapers && displayPapers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
