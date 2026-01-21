import { TaskList } from '@/components/tasks/TaskList';
import { getTasks } from '@/lib/notion';

export const revalidate = 0; // Always dynamic for tasks

export default async function TasksPage() {
    const tasks = await getTasks();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            </div>
            <TaskList tasks={tasks} />
        </div>
    );
}
