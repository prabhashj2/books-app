import { Owner } from './types';

/**
 * Sample data shown when the live API is unreachable, so the UI still has
 * something to render for a demo. Kept separate from the component and
 * surfaced explicitly in the UI (see the "sample data" notice in App.tsx)
 * so it's never mistaken for a real, successful fetch.
 */
export const mockOwners: Owner[] = [
    {
        name: 'John Smith',
        age: 30,
        books: [
            { name: 'Clean Code', type: 'Hardcover' },
            { name: 'JavaScript Guide', type: 'Paperback' },
        ],
    },
    {
        name: 'Tommy Smith',
        age: 12,
        books: [{ name: 'Adventure Island', type: 'Hardcover' }],
    },
];
