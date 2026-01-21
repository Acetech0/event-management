'use server';

import { updateTaskStatus, updateEventDayStatus, addPostEventNote } from '@/lib/notion';
import { revalidatePath } from 'next/cache';

export async function updateTask(taskId: string, status: string) {
    try {
        await updateTaskStatus(taskId, status);
        revalidatePath('/tasks');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to update task:', error);
        throw new Error('Failed to update task');
    }
}

export async function updateEventDay(dayId: string, status: string) {
    try {
        await updateEventDayStatus(dayId, status);
        revalidatePath('/calendar');
        revalidatePath('/events');
    } catch (error) {
        console.error('Failed to update event day:', error);
        throw new Error('Failed to update event day');
    }
}

export async function addNote(eventId: string, content: string, sentiment: string) {
    try {
        await addPostEventNote(eventId, content, sentiment);
        revalidatePath(`/events/${eventId}`);
        revalidatePath('/post-event');
    } catch (error) {
        console.error('Failed to add note:', error);
        throw new Error('Failed to add note');
    }
}
