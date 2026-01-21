import { Client } from '@notionhq/client';
import { NotionEvent, NotionEventDay, NotionTask, NotionStats } from './types';

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

// Helper to safely get property values
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTitle = (page: any, prop: string) =>
    page.properties[prop]?.title?.[0]?.plain_text || 'Untitled';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getText = (page: any, prop: string) =>
    page.properties[prop]?.rich_text?.[0]?.plain_text || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSelect = (page: any, prop: string) =>
    page.properties[prop]?.select?.name || 'New'; // Default status

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDate = (page: any, prop: string) =>
    page.properties[prop]?.date?.start || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRelationId = (page: any, prop: string) =>
    page.properties[prop]?.relation?.[0]?.id || '';

export const getEvents = async (): Promise<NotionEvent[]> => {
    if (!process.env.NOTION_EVENTS_DB) return [];

    const response = await notion.databases.query({
        database_id: process.env.NOTION_EVENTS_DB,
        sorts: [
            {
                property: 'Date', // Assumption: There's a 'Date' property
                direction: 'ascending',
            },
        ],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => ({
        id: page.id,
        name: getTitle(page, 'Name'), // Assumption: Title property is 'Name'
        date: getDate(page, 'Date'),
        status: getSelect(page, 'Status'),
        venue: getText(page, 'Venue'), // Assumption: 'Venue' exists
    }));
};

export const getStats = async (): Promise<NotionStats> => {
    const events = await getEvents();
    // We'll mock task count for now or fetch simple aggregation
    // Optimization: use separate queries with page_size=1 or helper functions
    const upcomingEvents = events.filter(e => e.status !== 'Done' && e.status !== 'Cancelled').length;

    return {
        upcomingEvents,
        pendingTasks: 0, // Implement real count
        totalClients: 0, // Implement real count
    };
};

export const getTasks = async (status?: string): Promise<NotionTask[]> => {
    if (!process.env.NOTION_TASKS_DB) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = status ? {
        property: 'Status',
        select: {
            equals: status
        }
    } : undefined;

    const response = await notion.databases.query({
        database_id: process.env.NOTION_TASKS_DB,
        filter: filter,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => ({
        id: page.id,
        title: getTitle(page, 'Task Name'),
        status: getSelect(page, 'Status'),
        eventId: getRelationId(page, 'Event'),
        dueDate: getDate(page, 'Due Date'),
    }));
};

export const getEvent = async (id: string): Promise<NotionEvent | null> => {
    try {
        const page: any = await notion.pages.retrieve({ page_id: id });
        return {
            id: page.id,
            name: getTitle(page, 'Name'),
            date: getDate(page, 'Date'),
            status: getSelect(page, 'Status'),
            venue: getText(page, 'Venue'),
        };
    } catch (e) {
        return null;
    }
};

export const getEventDays = async (eventId: string): Promise<NotionEventDay[]> => {
    if (!process.env.NOTION_EVENT_DAYS_DB) return [];

    const response = await notion.databases.query({
        database_id: process.env.NOTION_EVENT_DAYS_DB,
        filter: {
            property: 'Event', // Relation property name
            relation: {
                contains: eventId,
            },
        },
        sorts: [
            {
                property: 'Date',
                direction: 'ascending'
            }
        ]
    });

    return response.results.map((page: any) => ({
        id: page.id,
        name: getTitle(page, 'Name'),
        date: getDate(page, 'Date'),
        eventId: getRelationId(page, 'Event'),
        status: getSelect(page, 'Status'),
    }));
};

export const getAllEventDays = async (): Promise<NotionEventDay[]> => {
    if (!process.env.NOTION_EVENT_DAYS_DB) return [];

    const response = await notion.databases.query({
        database_id: process.env.NOTION_EVENT_DAYS_DB,
        sorts: [
            {
                property: 'Date',
                direction: 'ascending'
            }
        ]
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => ({
        id: page.id,
        name: getTitle(page, 'Name'),
        date: getDate(page, 'Date'),
        eventId: getRelationId(page, 'Event'),
        status: getSelect(page, 'Status'),
    }));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getVendors = async (eventId: string): Promise<any[]> => {
    if (!process.env.NOTION_VENDORS_DB) return [];

    const response = await notion.databases.query({
        database_id: process.env.NOTION_VENDORS_DB,
        filter: {
            property: 'Event',
            relation: { contains: eventId }
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => ({
        id: page.id,
        name: getTitle(page, 'Name'), // or Vendor Name
        type: getSelect(page, 'Type'),
        status: getSelect(page, 'Status'),
    }));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAssets = async (eventId: string): Promise<any[]> => {
    if (!process.env.NOTION_ASSETS_DB) return [];

    const response = await notion.databases.query({
        database_id: process.env.NOTION_ASSETS_DB,
        filter: {
            property: 'Event',
            relation: { contains: eventId }
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => ({
        id: page.id,
        name: getTitle(page, 'Name'),
        quantity: page.properties['Quantity']?.number || 0,
        status: getSelect(page, 'Status'),
    }));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPostEventNotes = async (eventId: string): Promise<any[]> => {
    if (!process.env.NOTION_POST_EVENT_DB) return [];

    const response = await notion.databases.query({
        database_id: process.env.NOTION_POST_EVENT_DB,
        filter: {
            property: 'Event',
            relation: { contains: eventId }
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => ({
        id: page.id,
        content: getText(page, 'Notes'), // Assumption
        sentiment: getSelect(page, 'Sentiment'),
    }));
};

export const updateTaskStatus = async (taskId: string, status: string) => {
    if (!process.env.NOTION_TASKS_DB) return;

    await notion.pages.update({
        page_id: taskId,
        properties: {
            'Status': {
                select: {
                    name: status,
                },
            },
        },
    });
};

export const updateEventDayStatus = async (dayId: string, status: string) => {
    if (!process.env.NOTION_EVENT_DAYS_DB) return;

    await notion.pages.update({
        page_id: dayId,
        properties: {
            'Status': { select: { name: status } }
        }
    });
};

export const addPostEventNote = async (eventId: string, content: string, sentiment?: string) => {
    if (!process.env.NOTION_POST_EVENT_DB) return;

    await notion.pages.create({
        parent: { database_id: process.env.NOTION_POST_EVENT_DB },
        properties: {
            'Notes': {
                rich_text: [
                    {
                        text: {
                            content: content,
                        },
                    },
                ],
            },
            'Event': { // Relation property
                relation: [
                    {
                        id: eventId,
                    },
                ],
            },
            'Sentiment': {
                select: {
                    name: sentiment || 'Neutral',
                },
            },
            // Name property is usually required
            'Name': {
                title: [
                    {
                        text: {
                            content: 'Note - ' + new Date().toLocaleDateString(),
                        },
                    },
                ],
            },
        },
    });
};
