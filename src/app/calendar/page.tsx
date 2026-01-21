import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllEventDays } from '@/lib/notion';
import { addDays, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';

export const revalidate = 60;

export default async function CalendarPage() {
    const eventDays = await getAllEventDays();

    const today = new Date();
    const start = startOfWeek(startOfMonth(today));
    const end = endOfWeek(endOfMonth(today));

    const days = eachDayOfInterval({ start, end });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                <div className="text-xl font-medium text-muted-foreground">{format(today, 'MMMM yyyy')}</div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-px bg-muted border rounded-md overflow-hidden">
                        {/* Header */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="bg-background p-2 text-center text-sm font-medium">
                                {day}
                            </div>
                        ))}

                        {/* Days */}
                        {days.map((day, idx) => {
                            const dayEvents = eventDays.filter(e => e.date && isSameDay(new Date(e.date), day));
                            return (
                                <div key={day.toString()} className={`bg-background min-h-[120px] p-2 ${!isSameMonth(day, today) ? 'text-muted-foreground bg-muted/20' : ''}`}>
                                    <div className="text-right text-sm p-1">{format(day, 'd')}</div>
                                    <div className="space-y-1">
                                        {dayEvents.map(event => (
                                            <div key={event.id} className="text-xs bg-primary/10 text-primary p-1 rounded border border-primary/20 truncate" title={event.name}>
                                                {event.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
