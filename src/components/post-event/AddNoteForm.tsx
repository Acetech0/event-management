'use client';

import { addNote } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // I need to install textarea or use Input
import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

// Assuming Textarea is not installed, I'll use a standard <textarea> or install it. 
// I'll stick to Input for simplicity or use specific Shadcn Textarea if I installed it.
// I didn't install textarea explicitly. I'll use tailwind styled textarea.

export function AddNoteForm({ eventId, eventName }: { eventId: string, eventName: string }) {
    const [content, setContent] = useState('');
    const [sentiment, setSentiment] = useState('Neutral');
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            await addNote(eventId, content, sentiment);
            setContent('');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Add Note for {eventName}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Content</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter feedback or notes..."
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sentiment</label>
                        <Select value={sentiment} onValueChange={setSentiment}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Positive">Positive</SelectItem>
                                <SelectItem value="Neutral">Neutral</SelectItem>
                                <SelectItem value="Negative">Negative</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {success && <p className="text-green-600 text-sm">Note added successfully!</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending || !content}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Note
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
