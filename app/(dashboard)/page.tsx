'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateLinkedInPost } from '@/lib/openai';
import { sharePostToLinkedIn } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Sparkles, Copy, Save, CheckCircle2, Loader2, Share2 } from 'lucide-react';
import { toast } from 'sonner';

type PostType = 'long' | 'short' | 'carousel';

export default function GeneratorPage() {
  const [theme, setTheme] = useState('');
  const [postType, setPostType] = useState<PostType>('short');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!theme.trim()) {
      toast.error('Please enter a theme for your post');
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateLinkedInPost(theme, postType);
      setGeneratedContent(content);
      toast.success('Post generated successfully!');
    } catch (error) {
      toast.error('Failed to generate post. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!generatedContent) return;

    setIsSharing(true);
    try {
      await sharePostToLinkedIn(generatedContent);
      toast.success('Post shared to LinkedIn successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to share post to LinkedIn');
    } finally {
      setIsSharing(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('posts').insert({
        content: generatedContent,
        type: postType,
        theme: theme,
      });

      if (error) throw error;

      toast.success('Post saved to history!');
    } catch (error) {
      toast.error('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Generate LinkedIn Post
        </h1>
        <p className="text-muted-foreground">
          Create engaging content in seconds with AI-powered generation
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Post Type</label>
              <Tabs
                value={postType}
                onValueChange={(value) => setPostType(value as PostType)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="short">Short</TabsTrigger>
                  <TabsTrigger value="long">Long</TabsTrigger>
                  <TabsTrigger value="carousel">Carousel</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-3">
              <label htmlFor="theme" className="text-sm font-medium">
                What do you want to write about?
              </label>
              <Textarea
                id="theme"
                placeholder="e.g., The importance of work-life balance in tech..."
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !theme.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Post
                </>
              )}
            </Button>
          </Card>

          <Card className="p-6 bg-muted/50">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Tips for better results:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific about your topic</li>
                <li>• Include key points you want to cover</li>
                <li>• Mention your target audience if relevant</li>
                <li>• Specify the tone (professional, casual, etc.)</li>
              </ul>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Generated Content</h3>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      disabled={isSharing}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      {isSharing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sharing...
                        </>
                      ) : (
                        <>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share to LinkedIn
                        </>
                      )}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {generatedContent ? (
                <div className="min-h-[400px] rounded-lg border bg-background p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
              ) : (
                <div className="min-h-[400px] rounded-lg border border-dashed bg-muted/20 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Your generated post will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
