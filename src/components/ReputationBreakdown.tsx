import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ReputationBadge } from './ReputationBadge';
import { type ReputationData, getTier, REPUTATION_CONSTANTS } from '@/types/reputation';
import { Info, TrendingUp, FileText, MessageSquare, Users, Vote, Coins, Clock, AlertTriangle } from 'lucide-react';

interface ReputationBreakdownProps {
  reputation: ReputationData;
}

export function ReputationBreakdown({ reputation }: ReputationBreakdownProps) {
  const tierConfig = getTier(reputation.totalReputation);
  const nextTier = getTier(reputation.totalReputation + 1);

  // Calculate progress to next tier (if not at max)
  const progressToNextTier =
    nextTier.tier !== tierConfig.tier
      ? ((reputation.totalReputation - tierConfig.minReputation) /
          (tierConfig.maxReputation - tierConfig.minReputation)) *
        100
      : 100;

  const components = [
    {
      label: 'Publication Quality',
      value: reputation.components.publicationQuality,
      max: REPUTATION_CONSTANTS.MAX.PUBLICATION,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'Reputation from published papers, based on ratings and citations with 5-year decay',
    },
    {
      label: 'Review Quality',
      value: reputation.components.reviewQuality,
      max: REPUTATION_CONSTANTS.MAX.REVIEW,
      icon: MessageSquare,
      color: 'bg-green-500',
      description: 'Reputation from peer reviews, based on editor quality ratings with 5-year decay',
    },
    {
      label: 'Community Trust',
      value: reputation.components.communityTrust,
      max: REPUTATION_CONSTANTS.MAX.COMMUNITY_TRUST,
      icon: Users,
      color: 'bg-purple-500',
      description: 'Web of Trust endorsements weighted by endorser reputation',
    },
    {
      label: 'Governance',
      value: reputation.components.governanceParticipation,
      max: REPUTATION_CONSTANTS.MAX.GOVERNANCE,
      icon: Vote,
      color: 'bg-indigo-500',
      description: 'Participation in community governance through voting and proposals',
    },
    {
      label: 'Economic Stake',
      value: reputation.components.economicStake,
      max: REPUTATION_CONSTANTS.MAX.ECONOMIC_STAKE,
      icon: Coins,
      color: 'bg-amber-500',
      description: 'Staked Bitcoin as a commitment to platform integrity',
    },
    {
      label: 'Time Investment',
      value: reputation.components.timeInvestment,
      max: REPUTATION_CONSTANTS.MAX.TIME_INVESTMENT,
      icon: Clock,
      color: 'bg-cyan-500',
      description: 'Account age bonus as an anti-Sybil measure',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Reputation Overview</CardTitle>
            <CardDescription>Multi-factor reputation with 5-year decay</CardDescription>
          </div>
          <ReputationBadge
            tier={tierConfig.tier}
            reputation={reputation.totalReputation}
            showScore={true}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tier Progress */}
        {nextTier.tier !== tierConfig.tier && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                Progress to {nextTier.tier}
              </span>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                {Math.round(reputation.totalReputation)} / {tierConfig.maxReputation}
              </span>
            </div>
            <Progress value={progressToNextTier} className="h-2" />
          </div>
        )}

        {/* Permissions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4" />
            Permissions
          </div>
          <div className="flex flex-wrap gap-2">
            {tierConfig.canPublish && <Badge variant="outline">Publish Papers</Badge>}
            {tierConfig.canReview && <Badge variant="outline">Write Reviews</Badge>}
            {tierConfig.canComment && <Badge variant="outline">Comment</Badge>}
            {tierConfig.canVoteMinor && <Badge variant="outline">Vote (Minor)</Badge>}
            {tierConfig.canVoteMajor && <Badge variant="outline">Vote (Major)</Badge>}
            {tierConfig.canEdit && <Badge variant="outline">Edit Content</Badge>}
            {tierConfig.canInvestigate && <Badge variant="outline">Investigate Fraud</Badge>}
          </div>
        </div>

        {/* Component Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Info className="h-4 w-4" />
            Reputation Components
          </div>

          <div className="space-y-3">
            {components.map((component) => {
              const Icon = component.icon;
              const percentage = (component.value / component.max) * 100;

              return (
                <TooltipProvider key={component.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1 cursor-help">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-slate-500" />
                            <span>{component.label}</span>
                          </div>
                          <span className="font-mono text-slate-600 dark:text-slate-400">
                            {Math.round(component.value)} / {component.max}
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className={`h-1.5 ${component.color}`}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{component.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}

            {/* Bonuses/Penalties */}
            {reputation.components.statisticalConsistency !== 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Statistical Consistency</span>
                  </div>
                  <span className="font-mono text-green-600 dark:text-green-400">
                    +{Math.round(reputation.components.statisticalConsistency)}
                  </span>
                </div>
              </div>
            )}

            {reputation.components.penalties > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>Penalties</span>
                  </div>
                  <span className="font-mono text-red-600 dark:text-red-400">
                    -{Math.round(reputation.components.penalties)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-slate-500 dark:text-slate-500 pt-4 border-t">
          Last calculated: {new Date(reputation.lastCalculated * 1000).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
