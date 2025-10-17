import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import type { PaperEvent } from '@/hooks/usePapers';
import { getPaperMetadata } from '@/hooks/usePapers';
import { FileText, Calendar, Users, ExternalLink, Bitcoin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export function PaperCard({ paper }: { paper: PaperEvent }) {
  const metadata = getPaperMetadata(paper);
  const mainAuthor = useAuthor(paper.pubkey);
  const authorMetadata = mainAuthor.data?.metadata;
  
  const displayName = authorMetadata?.name || genUserName(paper.pubkey);
  const authorAvatar = authorMetadata?.picture;

  const publishedDate = new Date(metadata.publishedAt * 1000);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <Card className="group border-2 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white dark:bg-slate-900">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-800">
              <AvatarImage src={authorAvatar} alt={displayName} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                {displayName[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {displayName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {timeAgo}
              </p>
            </div>
          </div>
          
          {metadata.license && (
            <Badge variant="outline" className="text-xs shrink-0">
              {metadata.license}
            </Badge>
          )}
        </div>

        <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {metadata.title}
        </CardTitle>
        
        {metadata.subject && (
          <CardDescription className="text-xs font-mono text-blue-600 dark:text-blue-400">
            {metadata.subject}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
          {metadata.summary}
        </p>

        {/* Topics */}
        {metadata.topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadata.topics.slice(0, 3).map((topic, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              >
                {topic}
              </Badge>
            ))}
            {metadata.topics.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{metadata.topics.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Metadata Bar */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1" title="Bitcoin Block Height">
            <Bitcoin className="h-3 w-3" />
            <span className="font-mono">#{metadata.blockHeight}</span>
          </div>
          
          {metadata.authors.length > 1 && (
            <div className="flex items-center gap-1" title="Co-authors">
              <Users className="h-3 w-3" />
              <span>{metadata.authors.length}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1" title="File Type">
            <FileText className="h-3 w-3" />
            <span className="uppercase">{metadata.mimeType.split('/')[1] || 'PDF'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Link to={`/paper/${paper.pubkey}/${metadata.id}`}>
              View Paper
            </Link>
          </Button>
          
          {metadata.url && (
            <Button
              asChild
              variant="outline"
              size="icon"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              <a
                href={metadata.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Download PDF"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
