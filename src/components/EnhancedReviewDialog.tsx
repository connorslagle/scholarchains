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
import { Input } from '@/components/ui/input';
import { useCreateTimestamp } from '@/hooks/useOpenTimestamps';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useToast } from '@/hooks/useToast';
import { FileText, AlertCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  type EnhancedReview,
  type ReviewVerdict,
  type ReviewAttribution,
  enhancedReviewToTags,
  validateEnhancedReview,
} from '@/types/enhanced-review';

export function EnhancedReviewDialog({ paperAddress }: { paperAddress: string }) {
  const { user } = useCurrentUser();
  const { mutate: createEvent, isPending } = useNostrPublish();
  const { toast } = useToast();
  const { createTimestamp, isCreating: isTimestamping } = useCreateTimestamp();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('technical');

  // Technical Assessment
  const [methodologyRating, setMethodologyRating] = useState<number[]>([7]);
  const [methodologyCritique, setMethodologyCritique] = useState('');
  const [resultsRating, setResultsRating] = useState<number[]>([7]);
  const [resultsCritique, setResultsCritique] = useState('');
  const [statisticalRating, setStatisticalRating] = useState<number[]>([7]);
  const [statisticalCritique, setStatisticalCritique] = useState('');

  // Reproducibility
  const [dataAvailable, setDataAvailable] = useState(false);
  const [codeAvailable, setCodeAvailable] = useState(false);
  const [replicationFeasibility, setReplicationFeasibility] = useState<number[]>([5]);
  const [reproducibilityNotes, setReproducibilityNotes] = useState('');

  // Overall Assessment
  const [verdict, setVerdict] = useState<ReviewVerdict>('accept-with-revisions');
  const [overallRating, setOverallRating] = useState<number[]>([7]);
  const [confidence, setConfidence] = useState<number[]>([3]);

  // Metadata
  const [timeSpent, setTimeSpent] = useState<string>('2');
  const [conflicts, setConflicts] = useState('');

  // Attribution
  const [attribution, setAttribution] = useState<ReviewAttribution>('pseudonymous');
  const [orcid, setOrcid] = useState('');

  // Review Content
  const [content, setContent] = useState('');

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to write a review',
        variant: 'destructive',
      });
      return;
    }

    // Build enhanced review object
    const review: EnhancedReview = {
      technical: {
        methodology: {
          rating: methodologyRating[0],
          critique: methodologyCritique,
        },
        resultsValidity: {
          rating: resultsRating[0],
          critique: resultsCritique,
        },
        statisticalRigor: {
          rating: statisticalRating[0],
          critique: statisticalCritique,
        },
      },
      reproducibility: {
        dataAvailable,
        codeAvailable,
        replicationFeasibility: replicationFeasibility[0],
        notes: reproducibilityNotes,
      },
      verdict,
      overallRating: overallRating[0],
      confidence: confidence[0],
      timeSpent: parseFloat(timeSpent),
      conflicts: conflicts.trim(),
      attribution,
      orcid: orcid.trim() || undefined,
      content,
    };

    // Validate the review
    const validationErrors = validateEnhancedReview(review);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting',
        variant: 'destructive',
      });
      return;
    }

    setErrors([]);

    try {
      // Create OpenTimestamps proof for the review
      const reviewData = `${paperAddress}:${verdict}:${overallRating[0]}:${Date.now()}`;
      const timestampResult = await createTimestamp(reviewData);

      // Parse the paper address to get author pubkey
      const [, authorPubkey] = paperAddress.split(':');

      // Convert enhanced review to tags
      const reviewTags = enhancedReviewToTags(review);

      const tags: string[][] = [
        ['a', paperAddress],
        ['p', authorPubkey],
        ['ots', timestampResult.proof],
        ...reviewTags,
      ];

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
              description: 'Your enhanced review has been published successfully',
            });
            setOpen(false);
            resetForm();
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

  const resetForm = () => {
    setMethodologyRating([7]);
    setMethodologyCritique('');
    setResultsRating([7]);
    setResultsCritique('');
    setStatisticalRating([7]);
    setStatisticalCritique('');
    setDataAvailable(false);
    setCodeAvailable(false);
    setReplicationFeasibility([5]);
    setReproducibilityNotes('');
    setVerdict('accept-with-revisions');
    setOverallRating([7]);
    setConfidence([3]);
    setTimeSpent('2');
    setConflicts('');
    setAttribution('pseudonymous');
    setOrcid('');
    setContent('');
    setErrors([]);
    setActiveTab('technical');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <FileText className="h-4 w-4" />
          Write Enhanced Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write Enhanced Peer Review</DialogTitle>
          <DialogDescription>
            Provide comprehensive, structured feedback on this research paper. Enhanced reviews include technical assessments,
            reproducibility checks, and detailed metadata.
          </DialogDescription>
        </DialogHeader>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="reproducibility">Reproducibility</TabsTrigger>
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="content">Review Text</TabsTrigger>
          </TabsList>

          {/* Technical Assessment Tab */}
          <TabsContent value="technical" className="space-y-6 py-4">
            {/* Methodology */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Methodology</Label>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {methodologyRating[0]}
                </span>
              </div>
              <Slider
                value={methodologyRating}
                onValueChange={setMethodologyRating}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <Textarea
                value={methodologyCritique}
                onChange={(e) => setMethodologyCritique(e.target.value)}
                placeholder="Evaluate the research methodology: experimental design, controls, sample size, approach appropriateness..."
                className="min-h-[120px]"
              />
            </div>

            {/* Results Validity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Results Validity</Label>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {resultsRating[0]}
                </span>
              </div>
              <Slider
                value={resultsRating}
                onValueChange={setResultsRating}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <Textarea
                value={resultsCritique}
                onChange={(e) => setResultsCritique(e.target.value)}
                placeholder="Assess the validity of results: data quality, interpretation accuracy, conclusions support..."
                className="min-h-[120px]"
              />
            </div>

            {/* Statistical Rigor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Statistical Rigor</Label>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {statisticalRating[0]}
                </span>
              </div>
              <Slider
                value={statisticalRating}
                onValueChange={setStatisticalRating}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <Textarea
                value={statisticalCritique}
                onChange={(e) => setStatisticalCritique(e.target.value)}
                placeholder="Evaluate statistical methods: test appropriateness, power analysis, multiple comparisons, effect sizes..."
                className="min-h-[120px]"
              />
            </div>
          </TabsContent>

          {/* Reproducibility Tab */}
          <TabsContent value="reproducibility" className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dataAvailable"
                  checked={dataAvailable}
                  onCheckedChange={(checked) => setDataAvailable(checked as boolean)}
                />
                <Label htmlFor="dataAvailable" className="cursor-pointer">
                  Data is publicly available
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="codeAvailable"
                  checked={codeAvailable}
                  onCheckedChange={(checked) => setCodeAvailable(checked as boolean)}
                />
                <Label htmlFor="codeAvailable" className="cursor-pointer">
                  Code is publicly available
                </Label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Replication Feasibility</Label>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {replicationFeasibility[0]}
                  </span>
                </div>
                <Slider
                  value={replicationFeasibility}
                  onValueChange={setReplicationFeasibility}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500">
                  <span>Very difficult (1)</span>
                  <span>Very easy (10)</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reproducibilityNotes">Reproducibility Notes</Label>
                <Textarea
                  id="reproducibilityNotes"
                  value={reproducibilityNotes}
                  onChange={(e) => setReproducibilityNotes(e.target.value)}
                  placeholder="Describe what's needed to replicate this work, missing materials, accessibility issues..."
                  className="min-h-[150px]"
                />
              </div>
            </div>
          </TabsContent>

          {/* Overall Assessment Tab */}
          <TabsContent value="overall" className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="verdict">Verdict</Label>
              <Select value={verdict} onValueChange={(v) => setVerdict(v as ReviewVerdict)}>
                <SelectTrigger id="verdict">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accept">Accept - Ready for publication</SelectItem>
                  <SelectItem value="accept-with-revisions">Accept with Revisions - Minor changes needed</SelectItem>
                  <SelectItem value="major-revisions">Major Revisions - Substantial changes required</SelectItem>
                  <SelectItem value="reject">Reject - Fundamental issues</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Overall Rating</Label>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {overallRating[0]}
                </span>
              </div>
              <Slider
                value={overallRating}
                onValueChange={setOverallRating}
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Confidence Level</Label>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {confidence[0]}
                </span>
              </div>
              <Slider
                value={confidence}
                onValueChange={setConfidence}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500">
                <span>Low confidence (1)</span>
                <span>High confidence (5)</span>
              </div>
              <p className="text-xs text-slate-500">
                Rate your confidence in this review based on your expertise in the field
              </p>
            </div>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="timeSpent">Time Spent (hours)</Label>
              <Input
                id="timeSpent"
                type="number"
                min="0.25"
                step="0.25"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                placeholder="2.5"
              />
              <p className="text-xs text-slate-500">
                Approximate hours spent reviewing this paper
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conflicts">Conflicts of Interest</Label>
              <Textarea
                id="conflicts"
                value={conflicts}
                onChange={(e) => setConflicts(e.target.value)}
                placeholder="Declare any conflicts of interest, or write 'none' if you have no conflicts..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attribution">Attribution</Label>
              <Select value={attribution} onValueChange={(v) => setAttribution(v as ReviewAttribution)}>
                <SelectTrigger id="attribution">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pseudonymous">Pseudonymous - Sign with Nostr key only</SelectItem>
                  <SelectItem value="zk-proof">ZK Proof - Prove credentials without revealing identity</SelectItem>
                  <SelectItem value="full-disclosure">Full Disclosure - Reveal real identity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {attribution === 'full-disclosure' && (
              <div className="space-y-2">
                <Label htmlFor="orcid">ORCID (optional)</Label>
                <Input
                  id="orcid"
                  value={orcid}
                  onChange={(e) => setOrcid(e.target.value)}
                  placeholder="0000-0001-2345-6789"
                />
                <p className="text-xs text-slate-500">
                  Provide your ORCID identifier for full attribution
                </p>
              </div>
            )}
          </TabsContent>

          {/* Review Content Tab */}
          <TabsContent value="content" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Comprehensive Review (Markdown supported)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your detailed review here. Include summary, strengths, weaknesses, specific comments, and recommendations..."
                className="min-h-[400px] font-mono text-sm"
              />
              <p className="text-xs text-slate-500">
                Combine all your assessments into a comprehensive narrative review
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending || isTimestamping}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || isTimestamping || !user}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isPending || isTimestamping ? 'Publishing...' : 'Publish Enhanced Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
