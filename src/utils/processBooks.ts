import { Owner } from '../types';

export interface BookEntry {
    bookName: string;
    ownerName: string;
}

const ADULT_AGE_THRESHOLD = 18;

/**
 * Filters owners by age group (adult/child) and, optionally, to hardcover
 * books only, then returns the flattened (book, owner) pairs sorted
 * alphabetically by book name.
 */
export function processBooks(owners: Owner[], isAdult: boolean, hardcoverOnly: boolean): BookEntry[] {
    const filteredOwners = owners.filter(owner =>
        isAdult ? owner.age >= ADULT_AGE_THRESHOLD : owner.age < ADULT_AGE_THRESHOLD
    );

    const books: BookEntry[] = [];
    filteredOwners.forEach(owner => {
        owner.books.forEach(book => {
            if (!hardcoverOnly || book.type.toLowerCase() === 'hardcover') {
                books.push({ bookName: book.name, ownerName: owner.name });
            }
        });
    });

    return books.sort((a, b) => a.bookName.localeCompare(b.bookName));
}
