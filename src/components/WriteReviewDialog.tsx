import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateTimestamp } from '@/hooks/useOpenTimestamps';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useToast } from '@/hooks/useToast';
import { MessageSquarePlus, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const ASPECTS = [
  'methodology',
  'results',
  'clarity',
  'novelty',
  'reproducibility',
  'significance',
  'rigor',
];

export function WriteReviewDialog({ paperAddress }: { paperAddress: string }) {
  const { user } = useCurrentUser();
  const { mutate: createEvent, isPending } = useNostrPublish();
  const { toast } = useToast();
  const { createTimestamp, isCreating: isTimestamping } = useCreateTimestamp();

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number[]>([7]);
  const [verdict, setVerdict] = useState<string>('comment');
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to write a review',
        variant: 'destructive',
      });
      return;
    }

    if (content.trim().length === 0) {
      toast({
        title: 'Review Required',
        description: 'Please write your review before submitting',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create OpenTimestamps proof for the review
      const reviewData = `${paperAddress}:${verdict}:${rating[0]}:${Date.now()}`;
      const timestampResult = await createTimestamp(reviewData);

      // Parse the paper address to get author pubkey
      const [, authorPubkey] = paperAddress.split(':');

      const tags: string[][] = [
        ['a', paperAddress],
        ['p', authorPubkey],
        ['ots', timestampResult.proof],
        ['verdict', verdict],
        ['rating', rating[0].toString()],
      ];

      // Add aspect tags
      selectedAspects.forEach((aspect) => {
        tags.push(['aspect', aspect]);
      });

      createEvent(
        {
          kind: 4597,
          content,
          tags,
        },
        {
          onSuccess: () => {
            toast({
              title: 'Review Published',
              description: 'Your review has been published successfully',
            });
            setOpen(false);
            setContent('');
            setRating([7]);
            setVerdict('comment');
            setSelectedAspects([]);
          },
          onError: (error) => {
            toast({
              title: 'Publishing Failed',
              description: error instanceof Error ? error.message : 'Failed to publish review',
              variant: 'destructive',
            });
          },
        }
      );
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create timestamp proof',
        variant: 'destructive',
      });
    }
  };

  const toggleAspect = (aspect: string) => {
    setSelectedAspects((prev) =>
      prev.includes(aspect)
        ? prev.filter((a) => a !== aspect)
        : [...prev, aspect]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          Write Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Peer Review</DialogTitle>
          <DialogDescription>
            Provide constructive feedback on this research paper. Your review will be publicly signed and permanently stored on Nostr.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Verdict */}
          <div className="space-y-2">
            <Label htmlFor="verdict">Verdict</Label>
            <Select value={verdict} onValueChange={setVerdict}>
              <SelectTrigger id="verdict">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accept">Accept - Ready for publication</SelectItem>
                <SelectItem value="revise">Revisions Needed - Minor changes required</SelectItem>
                <SelectItem value="reject">Reject - Major issues</SelectItem>
                <SelectItem value="comment">Comment - General feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Overall Rating</Label>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {rating[0]}
              </span>
            </div>
            <Slider
              value={rating}
              onValueChange={setRating}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500">
              <span>Poor (1)</span>
              <span>Excellent (10)</span>
            </div>
          </div>

          {/* Aspects */}
          <div className="space-y-2">
            <Label>Review Aspects (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {ASPECTS.map((aspect) => (
                <Badge
                  key={aspect}
                  variant={selectedAspects.includes(aspect) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  onClick={() => toggleAspect(aspect)}
                >
                  {aspect}
                  {selectedAspects.includes(aspect) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Review (Markdown supported)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your detailed review here... You can use Markdown formatting for headings, lists, code blocks, etc."
              className="min-h-[300px] font-mono text-sm"
            />
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Tip: Use ## for headings, * for lists, ` for code, and **bold** for emphasis
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending || isTimestamping}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || isTimestamping || !user || content.trim().length === 0}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isPending || isTimestamping ? 'Publishing...' : 'Publish Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
