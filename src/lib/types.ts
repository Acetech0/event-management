export interface NotionEvent {
    id: string;
    name: string;
    date?: string; // ISO date string or start date
    status: string;
    client?: string; // Client Name
    venue?: string;
}

export interface NotionEventDay {
    id: string;
    name: string; // Function Name / Day Name
    date: string;
    eventId: string; // Relation ID
    status: string;
}

export interface NotionTask {
    id: string;
    title: string;
    status: 'To Do' | 'In Progress' | 'Done' | string;
    dueDate?: string;
    eventId?: string; // Relation
    assignee?: string;
}

export interface NotionClient {
    id: string;
    name: string;
    email?: string;
    phone?: string;
}

export interface NotionStats {
    upcomingEvents: number;
    pendingTasks: number;
    totalClients: number;
}
