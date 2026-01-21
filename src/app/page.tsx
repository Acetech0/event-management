import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEvents, getStats } from '@/lib/notion';
import { CalendarDays, CheckSquare, Users } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

export default async function DashboardPage() {
  const stats = await getStats();
  const upcomingEvents = (await getEvents()).slice(0, 5); // Get first 5

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">in the pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">needing attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">active accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events found.</p>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.venue || 'No venue'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">{event.date}</div>
                      <Link href={`/events/${event.id}`} className="text-sm font-medium text-primary hover:underline">
                        View
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for Quick Actions or Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/events" className="flex items-center p-2 rounded-md hover:bg-muted transition-colors text-sm">
              View All Events
            </Link>
            <Link href="/tasks" className="flex items-center p-2 rounded-md hover:bg-muted transition-colors text-sm">
              Manage Tasks
            </Link>
            <Link href="/post-event" className="flex items-center p-2 rounded-md hover:bg-muted transition-colors text-sm">
              Add Post-Event Notes
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
