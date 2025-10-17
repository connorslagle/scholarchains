import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Upload,
  FileText,
  Shield,
  Zap,
  Users,
  Award,
  Eye,
  AlertTriangle,
  CheckCircle,
  Bitcoin,
  MessageSquare,
  Network,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReviewProcess() {
  useSeoMeta({
    title: 'Peer Review Process - ScholarChains',
    description: 'Learn about the decentralized, transparent peer review process on ScholarChains with Bitcoin-anchored timestamps and Lightning incentives.',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-800 shadow-lg">
              <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Peer Review Process
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100">
              Transparent, Incentivized Peer Review
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A fully open, cryptographically verifiable peer review workflow where reviewers are recognized, incentivized, and held accountable.
            </p>
          </div>

          {/* Overview */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            <CardHeader>
              <CardTitle className="text-2xl">How It Works</CardTitle>
              <CardDescription className="dark:text-slate-300">
                Decentralized, Bitcoin-anchored review process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                ScholarChains implements a transparent peer review system built on Nostr events and Bitcoin timestamps. 
                Every review is publicly signed, immutably recorded, and cryptographically verifiable. Reviewers earn 
                reputation and Lightning tips for quality contributions.
              </p>
            </CardContent>
          </Card>

          {/* Step-by-Step Process */}
          <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl">The Review Lifecycle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ReviewStep
                number={1}
                icon={<Upload className="h-6 w-6" />}
                title="Paper Publication"
                description={
                  <>
                    <p className="mb-2">An author publishes their research:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Upload manuscript to Blossom → receive SHA-256 hash</li>
                      <li>• Create Nostr event with blob hash (<code>h</code>) and Bitcoin block hash (<code>b</code>)</li>
                      <li>• Sign with author's Nostr key and broadcast to relay network</li>
                    </ul>
                  </>
                }
                color="from-blue-500 to-cyan-500"
              />

              <ReviewStep
                number={2}
                icon={<Users className="h-6 w-6" />}
                title="Finding Reviewers"
                description={
                  <>
                    <p className="mb-2">Papers are discovered by the community:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Reviewers browse the real-time Nostr feed of new papers</li>
                      <li>• Search UI indexes titles, authors, topics, and reputation scores</li>
                      <li>• Interface highlights papers with few/no reviews to encourage participation</li>
                      <li>• Anyone can review—no gatekeeping or permission required</li>
                    </ul>
                  </>
                }
                color="from-purple-500 to-pink-500"
              />

              <ReviewStep
                number={3}
                icon={<FileText className="h-6 w-6" />}
                title="Submitting a Review"
                description={
                  <>
                    <p className="mb-2">Reviewers write and publish their evaluation:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Write review in markdown format (supports headings, lists, code blocks)</li>
                      <li>• Create Nostr review event (kind 4597) with paper address reference</li>
                      <li>• Include rating (1-10), verdict (accept/revise/reject), and aspects reviewed</li>
                      <li>• Add current Bitcoin block hash for timestamping</li>
                      <li>• Sign with reviewer's key and broadcast to network</li>
                    </ul>
                  </>
                }
                color="from-green-500 to-emerald-500"
              />

              <ReviewStep
                number={4}
                icon={<Network className="h-6 w-6" />}
                title="Linking Review to Paper"
                description={
                  <>
                    <p className="mb-2">Reviews are automatically associated with papers:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Review events reference paper via <code>a</code> tag (address coordinate)</li>
                      <li>• Relays propagate review to all subscribers instantly</li>
                      <li>• Clients query reviews using paper address: <code>{`#a: ['32623:pubkey:id']`}</code></li>
                      <li>• All reviews appear in the paper's detail page automatically</li>
                    </ul>
                  </>
                }
                color="from-orange-500 to-amber-500"
              />

              <ReviewStep
                number={5}
                icon={<Zap className="h-6 w-6" />}
                title="Incentivizing Quality Reviews"
                description={
                  <>
                    <p className="mb-2">Reviewers are rewarded for contributions:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Lightning Tips:</strong> Anyone can tip reviewers via NIP-57 zaps</li>
                      <li>• <strong>Reputation Points:</strong> Quality reviews earn visible reputation scores</li>
                      <li>• <strong>Badges:</strong> Top reviewers earn achievement badges</li>
                      <li>• <strong>Visibility:</strong> High-reputation reviewers rank higher in search</li>
                      <li>• Tips and reviews are public, creating transparent incentive structures</li>
                    </ul>
                  </>
                }
                color="from-yellow-500 to-orange-500"
              />

              <ReviewStep
                number={6}
                icon={<Shield className="h-6 w-6" />}
                title="Transparency & Auditability"
                description={
                  <>
                    <p className="mb-2">Every action is cryptographically verifiable:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• All reviews are publicly signed and timestamped with Bitcoin block hashes</li>
                      <li>• Anyone can verify signatures and timestamps independently</li>
                      <li>• Complete event history is preserved on relay network</li>
                      <li>• No review can be altered or deleted after publication</li>
                      <li>• Optional: Daily Merkle root can be anchored on Bitcoin blockchain</li>
                    </ul>
                  </>
                }
                color="from-indigo-500 to-purple-500"
              />
            </CardContent>
          </Card>

          {/* Review Components */}
          <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl">Review Components</CardTitle>
              <CardDescription>
                What makes up a ScholarChains review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ComponentCard
                  title="Rating (1-10)"
                  description="Numerical score for overall quality"
                  badge="Optional"
                />
                <ComponentCard
                  title="Verdict"
                  description="Accept, Revise, Reject, or Comment"
                  badge="Optional"
                />
                <ComponentCard
                  title="Review Aspects"
                  description="Methodology, results, clarity, novelty, reproducibility, etc."
                  badge="Optional"
                />
                <ComponentCard
                  title="Written Feedback"
                  description="Detailed review in markdown format"
                  badge="Required"
                />
                <ComponentCard
                  title="Bitcoin Timestamp"
                  description="Current block hash proving existence time"
                  badge="Required"
                />
                <ComponentCard
                  title="Signature"
                  description="Reviewer's cryptographic signature"
                  badge="Required"
                />
              </div>
            </CardContent>
          </Card>

          {/* Anonymity Options */}
          <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Eye className="h-6 w-6" />
                Public Reviews Only
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                ScholarChains implements <strong>public, signed reviews</strong> by design. All reviews are 
                attributed to the reviewer's Nostr identity (npub), creating accountability and building reputation.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Why Public Reviews?
                </h4>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <span><strong>Accountability:</strong> Reviewers stand behind their critiques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <span><strong>Reputation:</strong> Quality reviewers build public credibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <span><strong>Incentives:</strong> Reviewers receive tips and recognition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <span><strong>Transparency:</strong> The community sees who is contributing</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Note: Reviewers can use pseudonymous Nostr identities if desired, but all reviews 
                are cryptographically signed and publicly attributable to that identity.
              </p>
            </CardContent>
          </Card>

          {/* Conflict & Misconduct */}
          <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                Handling Misconduct
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <MisconductSection
                  title="Spam & Abuse Detection"
                  description="Community-driven flagging and reputation penalties for low-quality or abusive reviews."
                  items={[
                    'Users can report spam, plagiarism, or abusive reviews',
                    'Multiple reports trigger reputation deductions',
                    'Persistent bad actors may face relay-level rate limiting',
                    'All flags are public and auditable',
                  ]}
                />

                <MisconductSection
                  title="Paper Retractions"
                  description="Authors can retract papers while preserving auditability."
                  items={[
                    'Authors publish retraction events to Nostr',
                    'Relays propagate retraction to all subscribers',
                    'UI hides retracted papers but preserves history',
                    'Original events remain on-chain for transparency',
                  ]}
                />

                <MisconductSection
                  title="Dispute Resolution"
                  description="Serious disputes handled by reputation-weighted community governance."
                  items={[
                    'Major disputes raised in governance channels',
                    'Voting weighted by community reputation scores',
                    'Successful motions can blacklist bad actors',
                    'All votes publicly recorded on Nostr',
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reputation System */}
          <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Award className="h-6 w-6" />
                Reputation System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                Reputation scores are calculated based on multiple factors:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReputationFactor
                  title="Review Quality"
                  description="High ratings, detailed feedback, constructive critiques"
                  points="+5-20 points"
                />
                <ReputationFactor
                  title="Paper Citations"
                  description="Published papers that are cited by others"
                  points="+10 points per citation"
                />
                <ReputationFactor
                  title="Lightning Tips"
                  description="Zaps received for papers and reviews"
                  points="+1 point per 1000 sats"
                />
                <ReputationFactor
                  title="Community Engagement"
                  description="Reviewing papers, helping others, participation"
                  points="+2-10 points"
                />
                <ReputationFactor
                  title="Spam Reports"
                  description="Flagged for spam, abuse, or low-quality work"
                  points="-10 to -50 points"
                />
                <ReputationFactor
                  title="Review Agreement"
                  description="Reviews that align with community consensus"
                  points="+3-8 points"
                />
              </div>

              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Note:</strong> Reputation calculations are transparent and auditable. 
                  Scores are computed client-side from public Nostr events—no centralized authority 
                  controls reputation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bitcoin Anchoring */}
          <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bitcoin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                Bitcoin Timestamping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                Every review includes the current Bitcoin block hash, creating an immutable timestamp:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      Fetch Current Block
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Client queries Bitcoin block explorer API for latest block height and hash
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      Include in Event
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Review event includes <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">
                        ["b", "height", "hash"]
                      </code> tag
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      Cryptographic Proof
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Block hash proves review existed no later than that block's timestamp
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">4</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      Zero Cost
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No on-chain transaction needed—block hash is fetched via public APIs
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-lg">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Optional Enhancement:</strong> A daily Merkle root of all reviews can be 
                  published in a Bitcoin OP_RETURN transaction, providing an additional layer of 
                  cryptographic proof for the entire day's reviews.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardHeader>
              <CardTitle className="text-2xl">Key Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BenefitCard
                  icon={<Shield className="h-5 w-5" />}
                  title="Immutable Records"
                  description="Reviews cannot be altered or deleted after publication"
                />
                <BenefitCard
                  icon={<Zap className="h-5 w-5" />}
                  title="Direct Incentives"
                  description="Reviewers earn Lightning tips and reputation instantly"
                />
                <BenefitCard
                  icon={<Users className="h-5 w-5" />}
                  title="Open Participation"
                  description="Anyone can review—no gatekeepers or permissions"
                />
                <BenefitCard
                  icon={<Award className="h-5 w-5" />}
                  title="Transparent Reputation"
                  description="Quality reviewers build public credibility"
                />
                <BenefitCard
                  icon={<Bitcoin className="h-5 w-5" />}
                  title="Cryptographic Proof"
                  description="Bitcoin timestamps provide immutable evidence"
                />
                <BenefitCard
                  icon={<Network className="h-5 w-5" />}
                  title="Decentralized"
                  description="No central authority controls the process"
                />
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Start Reviewing Today
              </h2>
              <p className="text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                Join the community of scholars building a transparent, incentivized peer review system. 
                Your reviews earn reputation and Lightning tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Link to="/explore">
                    Find Papers to Review
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">
                    Learn More
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

function ReviewStep({
  number,
  icon,
  title,
  description,
  color,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} text-white flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
        {number < 6 && (
          <div className="w-0.5 h-full bg-gradient-to-b from-slate-300 to-transparent dark:from-slate-700 mt-2" />
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white font-bold text-xs`}>
            {number}
          </div>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
            {title}
          </h3>
        </div>
        <div className="text-slate-700 dark:text-slate-300 ml-8">
          {description}
        </div>
      </div>
    </div>
  );
}

function ComponentCard({ title, description, badge }: { title: string; description: string; badge: string }) {
  return (
    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
          {title}
        </h4>
        <Badge variant={badge === 'Required' ? 'default' : 'outline'} className="text-xs">
          {badge}
        </Badge>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function MisconductSection({ title, description, items }: { title: string; description: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h4>
      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
        {description}
      </p>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
            <span className="text-red-500 dark:text-red-400 mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReputationFactor({ title, description, points }: { title: string; description: string; points: string }) {
  return (
    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
          {title}
        </h4>
        <Badge variant="outline" className="text-xs shrink-0">
          {points}
        </Badge>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800">
      <div className="text-green-600 dark:text-green-400 shrink-0">
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
