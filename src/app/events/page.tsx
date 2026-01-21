import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEvents } from '@/lib/notion';
import { CalendarDays, MapPin } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {events.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                        No events found in the database.
                    </div>
                ) : (
                    events.map((event) => (
                        <Link key={event.id} href={`/events/${event.id}`}>
                            <Card className="hover:bg-muted/50 transition-colors h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-medium">{event.name}</CardTitle>
                                    <span className={`text-xs px-2 py-1 rounded-full border ${event.status === 'Done' ? 'bg-green-100 text-green-800 border-green-200' :
                                            event.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                                'bg-blue-100 text-blue-800 border-blue-200'
                                        }`}>
                                        {event.status}
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <CalendarDays className="h-4 w-4" />
                                        {event.date || 'No Date'}
                                    </div>
                                    {event.venue && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            {event.venue}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
