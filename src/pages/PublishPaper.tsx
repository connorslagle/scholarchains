import { useState } from 'react';
import { useSeoMeta } from '@unhead/react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoginArea } from '@/components/auth/LoginArea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileText, X, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SUBJECT_CATEGORIES = [
  'cs.AI - Artificial Intelligence',
  'cs.CR - Cryptography and Security',
  'cs.DB - Databases',
  'cs.LG - Machine Learning',
  'physics.gen-ph - General Physics',
  'math.CO - Combinatorics',
  'q-bio.GN - Genomics',
  'econ.GN - General Economics',
  'stat.ML - Machine Learning (Statistics)',
];

const LICENSES = [
  'CC-BY-4.0',
  'CC-BY-SA-4.0',
  'CC0-1.0',
  'MIT',
  'Apache-2.0',
  'GPL-3.0',
  'AGPL-3.0',
  'Proprietary',
];

export default function PublishPaper() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { mutate: createEvent, isPending: isPublishing } = useNostrPublish();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    summary: '',
    content: '',
    subject: '',
    license: 'CC-BY-4.0',
    version: 'v1',
    doi: '',
    arxiv: '',
  });

  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useSeoMeta({
    title: 'Publish Paper - ScholarChains',
    description: 'Publish your research paper on the decentralized ScholarChains platform',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTopic = () => {
    if (topicInput.trim() && !topics.includes(topicInput.trim())) {
      setTopics((prev) => [...prev, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics((prev) => prev.filter((t) => t !== topic));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a PDF file',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to publish a paper',
        variant: 'destructive',
      });
      return;
    }

    if (!file) {
      toast({
        title: 'File Required',
        description: 'Please upload a PDF file',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.id || !formData.title || !formData.summary) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in ID, title, and abstract',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Step 1: Upload file to Blossom
      setUploadProgress(25);
      const fileMetadata = await uploadFile(file);
      const blobHash = fileMetadata[0][1]; // Extract hash from first tag
      const blobUrl = fileMetadata.find(([name]) => name === 'url')?.[1] || '';
      
      setUploadProgress(50);

      // Step 2: Get Bitcoin block for anchoring
      const blockResponse = await fetch('https://blockstream.info/api/blocks/tip/height');
      const blockHeight = await blockResponse.text();
      const blockHashResponse = await fetch(`https://blockstream.info/api/block-height/${blockHeight}`);
      const blockHash = await blockHashResponse.text();

      setUploadProgress(75);

      // Step 3: Create paper event
      const tags: string[][] = [
        ['d', formData.id],
        ['title', formData.title],
        ['summary', formData.summary],
        ['published_at', Math.floor(Date.now() / 1000).toString()],
        ['b', blockHeight, blockHash],
        ['h', blobHash],
        ['url', blobUrl],
        ['m', 'application/pdf'],
        ['size', file.size.toString()],
        ['license', formData.license],
        ['version', formData.version],
      ];

      // Add optional fields
      if (formData.subject) tags.push(['subject', formData.subject]);
      if (formData.doi) tags.push(['doi', formData.doi]);
      if (formData.arxiv) tags.push(['arxiv', formData.arxiv]);

      // Add topic tags
      topics.forEach((topic) => {
        tags.push(['t', topic]);
      });

      createEvent(
        {
          kind: 32623,
          content: formData.content || formData.summary,
          tags,
        },
        {
          onSuccess: () => {
            setUploadProgress(100);
            toast({
              title: 'Paper Published!',
              description: 'Your research paper has been published successfully',
            });
            setTimeout(() => {
              navigate(`/paper/${user.pubkey}/${formData.id}`);
            }, 1000);
          },
          onError: (error) => {
            toast({
              title: 'Publishing Failed',
              description: error instanceof Error ? error.message : 'Failed to publish paper',
              variant: 'destructive',
            });
            setUploadProgress(0);
          },
        }
      );
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      });
      setUploadProgress(0);
    }
  };

  const isProcessing = isUploading || isPublishing;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please log in to publish your research</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <LoginArea className="w-full" />
              <Button asChild variant="outline" className="w-full">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card className="max-w-4xl mx-auto border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-3xl">Publish Research Paper</CardTitle>
            <CardDescription>
              Upload your research to the decentralized ScholarChains platform with Bitcoin-anchored timestamps
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Paper ID */}
              <div className="space-y-2">
                <Label htmlFor="id" className="required">
                  Paper ID
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  placeholder="unique-paper-identifier-2024"
                  required
                  disabled={isProcessing}
                />
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  A unique identifier for your paper (e.g., descriptive-title-2024)
                </p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Your Research Paper Title"
                  required
                  disabled={isProcessing}
                />
              </div>

              {/* Abstract */}
              <div className="space-y-2">
                <Label htmlFor="summary">
                  Abstract
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Provide a concise abstract of your research..."
                  className="min-h-[150px]"
                  required
                  disabled={isProcessing}
                />
              </div>

              {/* Additional Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Additional Details (optional)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Additional information, acknowledgments, or notes..."
                  className="min-h-[100px]"
                  disabled={isProcessing}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file">
                  PDF File
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                  <input
                    id="file"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isProcessing}
                  />
                  <label
                    htmlFor="file"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    {file ? (
                      <>
                        <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {file.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-slate-400" />
                        <p className="text-slate-600 dark:text-slate-400">
                          Click to upload PDF file
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Maximum file size: 50MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Subject Category */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Category</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleInputChange('subject', value)}
                  disabled={isProcessing}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category.split(' - ')[0]}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Topics */}
              <div className="space-y-2">
                <Label>Topics/Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                    placeholder="Add topic or keyword"
                    disabled={isProcessing}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTopic}
                    disabled={isProcessing}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="gap-1 cursor-pointer"
                        onClick={() => !isProcessing && handleRemoveTopic(topic)}
                      >
                        {topic}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* License */}
              <div className="space-y-2">
                <Label htmlFor="license">License</Label>
                <Select
                  value={formData.license}
                  onValueChange={(value) => handleInputChange('license', value)}
                  disabled={isProcessing}
                >
                  <SelectTrigger id="license">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LICENSES.map((license) => (
                      <SelectItem key={license} value={license}>
                        {license}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Optional Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                    placeholder="v1"
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doi">DOI (optional)</Label>
                  <Input
                    id="doi"
                    value={formData.doi}
                    onChange={(e) => handleInputChange('doi', e.target.value)}
                    placeholder="10.1234/example"
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arxiv">arXiv ID (optional)</Label>
                  <Input
                    id="arxiv"
                    value={formData.arxiv}
                    onChange={(e) => handleInputChange('arxiv', e.target.value)}
                    placeholder="2401.12345"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Progress Bar */}
              {isProcessing && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Publishing progress...
                    </span>
                    <span className="font-semibold">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
              >
                {isProcessing ? 'Publishing...' : 'Publish Paper'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
