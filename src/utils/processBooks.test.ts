import { describe, it, expect } from 'vitest';
import { processBooks } from './processBooks';
import { Owner } from '../types';

const owners: Owner[] = [
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
        books: [
            { name: 'Adventure Island', type: 'Hardcover' },
            { name: 'Picture Book', type: 'Paperback' },
        ],
    },
    {
        name: 'Exactly Eighteen',
        age: 18,
        books: [{ name: 'Coming Of Age', type: 'Paperback' }],
    },
];

describe('processBooks', () => {
    it('returns only adult-owned books when isAdult is true', () => {
        const result = processBooks(owners, true, false);

        expect(result.map(r => r.ownerName)).toEqual(
            expect.arrayContaining(['John Smith', 'Exactly Eighteen'])
        );
        expect(result.some(r => r.ownerName === 'Tommy Smith')).toBe(false);
    });

    it('returns only child-owned books when isAdult is false', () => {
        const result = processBooks(owners, false, false);

        expect(result.every(r => r.ownerName === 'Tommy Smith')).toBe(true);
        expect(result).toHaveLength(2);
    });

    it('treats age 18 as adult (boundary)', () => {
        const result = processBooks(owners, true, false);
        expect(result.some(r => r.ownerName === 'Exactly Eighteen')).toBe(true);

        const childResult = processBooks(owners, false, false);
        expect(childResult.some(r => r.ownerName === 'Exactly Eighteen')).toBe(false);
    });

    it('filters to hardcover-only books when hardcoverOnly is true', () => {
        const result = processBooks(owners, true, true);

        expect(result).toEqual([{ bookName: 'Clean Code', ownerName: 'John Smith' }]);
    });

    it('is case-insensitive when matching the hardcover type', () => {
        // The API response is untyped JSON at runtime, so casing isn't guaranteed
        // to match the `BookType` union even though our own code always produces it.
        const mixedCaseOwners = [
            {
                name: 'Case Tester',
                age: 40,
                books: [{ name: 'Weird Casing', type: 'HARDcover' }],
            },
        ] as unknown as Owner[];

        const result = processBooks(mixedCaseOwners, true, true);
        expect(result).toEqual([{ bookName: 'Weird Casing', ownerName: 'Case Tester' }]);
    });

    it('sorts results alphabetically by book name', () => {
        const result = processBooks(owners, true, false);
        const names = result.map(r => r.bookName);
        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    it('returns an empty array when there are no owners', () => {
        expect(processBooks([], true, false)).toEqual([]);
    });

    it('returns an empty array when no owner in the age group has any books', () => {
        const noBooks: Owner[] = [{ name: 'Empty Shelf', age: 25, books: [] }];
        expect(processBooks(noBooks, true, false)).toEqual([]);
    });
});
