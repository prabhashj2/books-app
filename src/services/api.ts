import {Owner} from '../types';

const API_URL = 'https://digitalcodingtest.bupa.com.au/api/v1/bookowners';

export async function fetchBookData(): Promise<Owner[]> {
    try{
        const response = await fetch(API_URL);

        if(!response.ok){
            throw new Error(`Failed to fetch book data: ${response.statusText}`);
        }
    const data = await response.json();
    return data;
    }catch(error){
        console.error("Error fetching book data:", error);
        throw error;
    }
}