import { useParams, Link } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { usePaper, getPaperMetadata } from '@/hooks/usePapers';
import { usePaperReviews, getReviewStats } from '@/hooks/useReviews';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ReviewCard } from '@/components/ReviewCard';
import { WriteReviewDialog } from '@/components/WriteReviewDialog';
import {
  ArrowLeft,
  Download,
  Calendar,
  Bitcoin,
  FileText,
  Users,
  Star,
  MessageSquare,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { format } from 'date-fns';
import { ZapButton } from '@/components/ZapButton';

export default function PaperDetail() {
  const { author, id } = useParams<{ author: string; id: string }>();
  const { data: paper, isLoading } = usePaper(author || '', id || '');
  const { data: reviews = [] } = usePaperReviews(
    paper ? `32623:${author}:${id}` : ''
  );

  const metadata = paper ? getPaperMetadata(paper) : null;
  const mainAuthor = useAuthor(author || '');
  const authorMetadata = mainAuthor.data?.metadata;
  const displayName = authorMetadata?.name || genUserName(author || '');
  const reviewStats = getReviewStats(reviews);

  useSeoMeta({
    title: metadata?.title || 'Loading Paper...',
    description: metadata?.summary || 'Research paper on ScholarChains',
  });

  if (isLoading) {
    return <PaperDetailSkeleton />;
  }

  if (!paper || !metadata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Paper not found
              </p>
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const publishedDate = new Date(metadata.publishedAt * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Papers
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paper Header */}
            <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-blue-200 dark:border-blue-800">
                    <AvatarImage src={authorMetadata?.picture} alt={displayName} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      {displayName[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {displayName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{format(publishedDate, 'MMMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>

                <CardTitle className="text-3xl mb-3">{metadata.title}</CardTitle>

                {metadata.subject && (
                  <Badge variant="outline" className="w-fit">
                    {metadata.subject}
                  </Badge>
                )}

                {metadata.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {metadata.topics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Abstract
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {metadata.summary}
                  </p>
                </div>

                {paper.content && paper.content !== metadata.summary && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        Additional Details
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {paper.content}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {metadata.url && (
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <a href={metadata.url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </a>
                    </Button>
                  )}
                  
                  <ZapButton event={paper} />
                  
                  <WriteReviewDialog paperAddress={`32623:${author}:${id}`} />
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Peer Reviews ({reviewStats.total})
                  </CardTitle>
                  
                  {reviewStats.averageRating && (
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-lg">
                        {reviewStats.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      No reviews yet. Be the first to review this paper!
                    </p>
                    <WriteReviewDialog paperAddress={`32623:${author}:${id}`} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata Card */}
            <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg">Paper Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <MetadataItem
                  icon={<Bitcoin className="h-4 w-4" />}
                  label="Block Height"
                  value={`#${metadata.blockHeight}`}
                />
                
                <MetadataItem
                  icon={<Shield className="h-4 w-4" />}
                  label="Block Hash"
                  value={
                    <code className="text-xs break-all font-mono">
                      {metadata.blockHash.slice(0, 16)}...
                    </code>
                  }
                />

                {metadata.license && (
                  <MetadataItem
                    icon={<FileText className="h-4 w-4" />}
                    label="License"
                    value={metadata.license}
                  />
                )}

                {metadata.version && (
                  <MetadataItem
                    icon={<FileText className="h-4 w-4" />}
                    label="Version"
                    value={metadata.version}
                  />
                )}

                {metadata.authors.length > 1 && (
                  <MetadataItem
                    icon={<Users className="h-4 w-4" />}
                    label="Co-authors"
                    value={`${metadata.authors.length} authors`}
                  />
                )}

                {metadata.size > 0 && (
                  <MetadataItem
                    icon={<Download className="h-4 w-4" />}
                    label="File Size"
                    value={formatFileSize(metadata.size)}
                  />
                )}

                {metadata.doi && (
                  <MetadataItem
                    icon={<ExternalLink className="h-4 w-4" />}
                    label="DOI"
                    value={
                      <a
                        href={`https://doi.org/${metadata.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {metadata.doi}
                      </a>
                    }
                  />
                )}

                {metadata.arxiv && (
                  <MetadataItem
                    icon={<ExternalLink className="h-4 w-4" />}
                    label="arXiv"
                    value={
                      <a
                        href={`https://arxiv.org/abs/${metadata.arxiv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {metadata.arxiv}
                      </a>
                    }
                  />
                )}
              </CardContent>
            </Card>

            {/* Review Stats Card */}
            {reviewStats.total > 0 && (
              <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-lg">Review Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <VerdictBar verdict="Accept" count={reviewStats.verdicts.accept} color="green" />
                  <VerdictBar verdict="Revise" count={reviewStats.verdicts.revise} color="yellow" />
                  <VerdictBar verdict="Reject" count={reviewStats.verdicts.reject} color="red" />
                  <VerdictBar verdict="Comment" count={reviewStats.verdicts.comment} color="blue" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaperDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetadataItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-blue-600 dark:text-blue-400 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">{label}</p>
        <div className="text-slate-900 dark:text-slate-100">{value}</div>
      </div>
    </div>
  );
}

function VerdictBar({
  verdict,
  count,
  color,
}: {
  verdict: string;
  count: number;
  color: 'green' | 'yellow' | 'red' | 'blue';
}) {
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-400">{verdict}</span>
        <span className="font-semibold text-slate-900 dark:text-slate-100">{count}</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: count > 0 ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
