import { AddNoteForm } from '@/components/post-event/AddNoteForm';
import { getEvents } from '@/lib/notion';

export const revalidate = 60;

export default async function PostEventPage() {
    const events = await getEvents();
    // Filter for 'Done' events preferably, or show all.
    const relevantEvents = events; // Show all for now to allow adding notes anytime

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Post-Event Notes</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {relevantEvents.map(event => (
                    <AddNoteForm key={event.id} eventId={event.id} eventName={event.name} />
                ))}
            </div>
        </div>
    );
}
