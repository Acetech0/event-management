'use client';

import { updateTask } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NotionTask } from '@/lib/types';
import { CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

interface TaskListProps {
    tasks: NotionTask[];
}

export function TaskList({ tasks: initialTasks }: TaskListProps) {
    // We rely on Props updating from Server Action revalidation, 
    // but for immediate feedback we can use optimistic UI or just loading state.
    // Since revalidatePath is used, props will update.
    const [filter, setFilter] = useState('All');
    const [isPending, startTransition] = useTransition();

    const filteredTasks = initialTasks.filter(task => {
        if (filter === 'All') return true;
        return task.status === filter;
    });

    const handleStatusChange = (taskId: string, newStatus: string) => {
        startTransition(async () => {
            await updateTask(taskId, newStatus);
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 pb-4">
                {['All', 'To Do', 'In Progress', 'Done'].map(status => (
                    <Button
                        key={status}
                        variant={filter === status ? 'default' : 'outline'}
                        onClick={() => setFilter(status)}
                        size="sm"
                    >
                        {status}
                    </Button>
                ))}
            </div>

            <div className="grid gap-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        No tasks found.
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <Card key={task.id}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    {task.status === 'Done' ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : task.status === 'In Progress' ? (
                                        <Clock className="h-5 w-5 text-blue-500" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    <div className="space-y-1">
                                        <p className={`font-medium ${task.status === 'Done' ? 'line-through text-muted-foreground' : ''}`}>
                                            {task.title}
                                        </p>
                                        <div className="flex gap-2">
                                            <Badge variant="secondary" className="text-xs">{task.status}</Badge>
                                            {task.dueDate && <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {task.status !== 'Done' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={isPending}
                                            onClick={() => handleStatusChange(task.id, 'Done')}
                                        >
                                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Mark Done'}
                                        </Button>
                                    )}
                                    {task.status === 'To Do' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            disabled={isPending}
                                            onClick={() => handleStatusChange(task.id, 'In Progress')}
                                        >
                                            Start
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
