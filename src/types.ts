export interface Book {
    name: string;
    type: string;
}

export interface Owner{
    name: string;
    age: number;
    books: Book[];
}