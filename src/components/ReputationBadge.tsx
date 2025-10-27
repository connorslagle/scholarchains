import { Badge } from '@/components/ui/badge';
import { ReputationTier } from '@/types/reputation';
import { Award, Star, Crown, Shield, Sparkles } from 'lucide-react';

interface ReputationBadgeProps {
  tier: ReputationTier;
  reputation: number;
  showScore?: boolean;
  className?: string;
}

const tierConfig: Record<
  ReputationTier,
  {
    label: string;
    color: string;
    icon: React.ElementType;
    gradient: string;
  }
> = {
  [ReputationTier.NEWCOMER]: {
    label: 'Newcomer',
    color: 'bg-slate-500',
    icon: Sparkles,
    gradient: 'from-slate-400 to-slate-600',
  },
  [ReputationTier.CONTRIBUTOR]: {
    label: 'Contributor',
    color: 'bg-green-500',
    icon: Award,
    gradient: 'from-green-400 to-green-600',
  },
  [ReputationTier.ESTABLISHED]: {
    label: 'Established',
    color: 'bg-blue-500',
    icon: Star,
    gradient: 'from-blue-400 to-blue-600',
  },
  [ReputationTier.EXPERT]: {
    label: 'Expert',
    color: 'bg-purple-500',
    icon: Shield,
    gradient: 'from-purple-400 to-purple-600',
  },
  [ReputationTier.COUNCIL]: {
    label: 'Council',
    color: 'bg-amber-500',
    icon: Crown,
    gradient: 'from-amber-400 to-amber-600',
  },
};

export function ReputationBadge({
  tier,
  reputation,
  showScore = false,
  className = '',
}: ReputationBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Badge
      className={`px-3 py-1 bg-gradient-to-r ${config.gradient} text-white border-0 ${className}`}
    >
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
      {showScore && (
        <span className="ml-2 font-mono text-xs">
          {Math.round(reputation)}
        </span>
      )}
    </Badge>
  );
}
