import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVerifyTimestamp, useOpenTimestamps } from '@/hooks/useOpenTimestamps';
import { useToast } from '@/hooks/useToast';
import { Clock, CheckCircle, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface TimestampVerificationProps {
  otsProof: string;
  data: string | Uint8Array;
  filename?: string;
}

export function TimestampVerification({
  otsProof,
  data,
  filename = 'timestamp.ots',
}: TimestampVerificationProps) {
  const { verifyTimestamp, isVerifying, data: verificationData } = useVerifyTimestamp();
  const { download, upgradeMutation } = useOpenTimestamps();
  const { toast } = useToast();
  const [hasVerified, setHasVerified] = useState(false);

  const handleVerify = async () => {
    try {
      await verifyTimestamp({ proof: otsProof, data });
      setHasVerified(true);
      toast({
        title: 'Verification Complete',
        description: verificationData?.isPending
          ? 'Timestamp is pending Bitcoin confirmation'
          : 'Timestamp verified successfully',
      });
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'Failed to verify timestamp',
        variant: 'destructive',
      });
    }
  };

  const handleUpgrade = async () => {
    try {
      await upgradeMutation.mutateAsync(otsProof);
      toast({
        title: 'Upgrade Complete',
        description: 'Timestamp has been upgraded. Verify again to see the new status.',
      });
      setHasVerified(false);
    } catch (error) {
      toast({
        title: 'Upgrade Failed',
        description: error instanceof Error ? error.message : 'Failed to upgrade timestamp',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    try {
      download(otsProof, filename);
      toast({
        title: 'Download Started',
        description: 'OTS proof file is being downloaded',
      });
    } catch {
      toast({
        title: 'Download Failed',
        description: 'Failed to download timestamp proof file',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-3 border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-sm">OpenTimestamps Proof</span>
        </div>
        {hasVerified && verificationData && !verificationData.isPending && (
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        )}
        {hasVerified && verificationData?.isPending && (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )}
      </div>

      {hasVerified && verificationData && (
        <div className="space-y-2 text-sm">
          {verificationData.timestamp && (
            <div>
              <span className="text-slate-600 dark:text-slate-400">Timestamp: </span>
              <span className="font-mono">
                {format(new Date(verificationData.timestamp * 1000), 'PPpp')}
              </span>
            </div>
          )}
          {verificationData.blockHeight && (
            <div>
              <span className="text-slate-600 dark:text-slate-400">Block Height: </span>
              <span className="font-mono">{verificationData.blockHeight}</span>
            </div>
          )}
          {verificationData.blockHash && (
            <div>
              <span className="text-slate-600 dark:text-slate-400">Block Hash: </span>
              <span className="font-mono text-xs break-all">{verificationData.blockHash}</span>
            </div>
          )}
          {verificationData.isPending && (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              This timestamp is awaiting Bitcoin block confirmation. Check back later or try
              upgrading the proof.
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleVerify}
          disabled={isVerifying}
          className="gap-2"
        >
          <CheckCircle className="h-3 w-3" />
          {isVerifying ? 'Verifying...' : hasVerified ? 'Re-verify' : 'Verify'}
        </Button>

        {hasVerified && verificationData?.isPending && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleUpgrade}
            disabled={upgradeMutation.isPending}
            className="gap-2"
          >
            <RefreshCw className="h-3 w-3" />
            {upgradeMutation.isPending ? 'Upgrading...' : 'Upgrade'}
          </Button>
        )}

        <Button size="sm" variant="outline" onClick={handleDownload} className="gap-2">
          <Download className="h-3 w-3" />
          Download .ots
        </Button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-500">
        This cryptographic timestamp proves the existence of this content at a specific point in
        time using the Bitcoin blockchain.
      </p>
    </div>
  );
}
