export type BookType = 'Hardcover' | 'Paperback';

export interface Book {
    name: string;
    type: BookType;
}

export interface Owner{
    name: string;
    age: number;
    books: Book[];
}
