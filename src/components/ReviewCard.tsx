import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import type { ReviewEvent } from '@/hooks/useReviews';
import { getReviewMetadata } from '@/hooks/useReviews';
import { Star, CheckCircle, XCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export function ReviewCard({ review }: { review: ReviewEvent }) {
  const metadata = getReviewMetadata(review);
  const reviewer = useAuthor(review.pubkey);
  const reviewerMetadata = reviewer.data?.metadata;
  
  const displayName = reviewerMetadata?.name || genUserName(review.pubkey);
  const reviewerAvatar = reviewerMetadata?.picture;

  const reviewDate = new Date(review.created_at * 1000);

  const verdictConfig = {
    accept: {
      icon: <CheckCircle className="h-4 w-4" />,
      label: 'Accept',
      color: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    },
    reject: {
      icon: <XCircle className="h-4 w-4" />,
      label: 'Reject',
      color: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
    },
    revise: {
      icon: <AlertCircle className="h-4 w-4" />,
      label: 'Revisions Needed',
      color: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
    },
    comment: {
      icon: <MessageCircle className="h-4 w-4" />,
      label: 'Comment',
      color: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    },
  };

  const verdict = metadata.verdict
    ? verdictConfig[metadata.verdict]
    : verdictConfig.comment;

  return (
    <Card className="border-2 border-slate-200 dark:border-slate-800">
      <CardContent className="p-6 space-y-4">
        {/* Reviewer Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10 border-2 border-slate-200 dark:border-slate-800">
              <AvatarImage src={reviewerAvatar} alt={displayName} />
              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {displayName[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {displayName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {format(reviewDate, 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {metadata.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {metadata.rating}
                </span>
              </div>
            )}
            
            <Badge variant="outline" className={verdict.color}>
              <span className="mr-1">{verdict.icon}</span>
              {verdict.label}
            </Badge>
          </div>
        </div>

        {/* Aspects */}
        {metadata.aspects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadata.aspects.map((aspect, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {aspect}
              </Badge>
            ))}
          </div>
        )}

        {/* Review Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{review.content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
