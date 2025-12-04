'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase, type CalendarIdea } from '@/lib/supabase';
import { generateCalendarIdeas } from '@/lib/openai';
import {
  Calendar as CalendarIcon,
  Plus,
  Sparkles,
  CheckCircle2,
  Circle,
  Trash2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categoryColors: Record<string, string> = {
  Leadership: 'bg-blue-100 text-blue-700 border-blue-200',
  Career: 'bg-green-100 text-green-700 border-green-200',
  Innovation: 'bg-purple-100 text-purple-700 border-purple-200',
  Industry: 'bg-orange-100 text-orange-700 border-orange-200',
  Personal: 'bg-pink-100 text-pink-700 border-pink-200',
};

export default function CalendarPage() {
  const [ideas, setIdeas] = useState<CalendarIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: 'Personal',
    scheduled_date: '',
  });

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('calendar_ideas')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      toast.error('Failed to load ideas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);
    try {
      const generatedIdeas = await generateCalendarIdeas();

      const today = new Date();
      const ideasWithDates = generatedIdeas.map((idea, index) => ({
        ...idea,
        scheduled_date: new Date(
          today.getTime() + (index + 1) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split('T')[0],
      }));

      const { error } = await supabase.from('calendar_ideas').insert(ideasWithDates);

      if (error) throw error;

      await fetchIdeas();
      toast.success('Generated 10 new content ideas!');
    } catch (error) {
      toast.error('Failed to generate ideas');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddIdea = async () => {
    if (!newIdea.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      const { error } = await supabase.from('calendar_ideas').insert({
        title: newIdea.title,
        description: newIdea.description || null,
        category: newIdea.category,
        scheduled_date: newIdea.scheduled_date || null,
        status: 'pending',
      });

      if (error) throw error;

      await fetchIdeas();
      setIsDialogOpen(false);
      setNewIdea({
        title: '',
        description: '',
        category: 'Personal',
        scheduled_date: '',
      });
      toast.success('Idea added!');
    } catch (error) {
      toast.error('Failed to add idea');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

    try {
      const { error } = await supabase
        .from('calendar_ideas')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setIdeas(
        ideas.map((idea) =>
          idea.id === id ? { ...idea, status: newStatus } : idea
        )
      );
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('calendar_ideas').delete().eq('id', id);

      if (error) throw error;

      setIdeas(ideas.filter((idea) => idea.id !== id));
      toast.success('Idea deleted');
    } catch (error) {
      toast.error('Failed to delete idea');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const groupedIdeas = ideas.reduce((acc, idea) => {
    const status = idea.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(idea);
    return acc;
  }, {} as Record<string, CalendarIdea[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground">
            Plan and organize your content ideas
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGenerateIdeas}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Ideas
              </>
            )}
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Idea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Content Idea</DialogTitle>
                <DialogDescription>
                  Create a new content idea for your calendar
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter idea title..."
                    value={newIdea.title}
                    onChange={(e) =>
                      setNewIdea({ ...newIdea, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Add details about this idea..."
                    value={newIdea.description}
                    onChange={(e) =>
                      setNewIdea({ ...newIdea, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={newIdea.category}
                      onValueChange={(value) =>
                        setNewIdea({ ...newIdea, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                        <SelectItem value="Career">Career</SelectItem>
                        <SelectItem value="Innovation">Innovation</SelectItem>
                        <SelectItem value="Industry">Industry</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={newIdea.scheduled_date}
                      onChange={(e) =>
                        setNewIdea({ ...newIdea, scheduled_date: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddIdea}>Add Idea</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {ideas.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-3">
            <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="font-semibold">No ideas yet</h3>
            <p className="text-sm text-muted-foreground">
              Generate AI-powered ideas or add your own
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {['pending', 'completed'].map((status) => {
            const statusIdeas = groupedIdeas[status] || [];
            if (statusIdeas.length === 0) return null;

            return (
              <div key={status} className="space-y-4">
                <h2 className="text-lg font-semibold capitalize flex items-center gap-2">
                  {status === 'pending' ? (
                    <Circle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                  {status}
                  <span className="text-sm text-muted-foreground font-normal">
                    ({statusIdeas.length})
                  </span>
                </h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {statusIdeas.map((idea) => (
                    <Card
                      key={idea.id}
                      className={`p-4 hover:shadow-md transition-all ${
                        idea.status === 'completed' ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => handleToggleStatus(idea.id, idea.status)}
                            className="mt-1"
                          >
                            {idea.status === 'completed' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                            )}
                          </button>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm leading-tight">
                              {idea.title}
                            </h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(idea.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>

                        {idea.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {idea.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          {idea.category && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                categoryColors[idea.category] ||
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {idea.category}
                            </Badge>
                          )}
                          {idea.scheduled_date && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {formatDate(idea.scheduled_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
