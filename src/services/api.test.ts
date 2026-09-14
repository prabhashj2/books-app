import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchBookData } from './api';

const API_URL = 'https://digitalcodingtest.bupa.com.au/api/v1/bookowners';

describe('fetchBookData', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('calls the book owners endpoint', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => [],
        });

        await fetchBookData();

        expect(fetch).toHaveBeenCalledWith(API_URL);
    });

    it('resolves with the parsed JSON body on success', async () => {
        const owners = [{ name: 'Jane Doe', age: 40, books: [] }];
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => owners,
        });

        await expect(fetchBookData()).resolves.toEqual(owners);
    });

    it('throws a descriptive error when the response is not ok', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: false,
            statusText: 'Service Unavailable',
            json: async () => ({}),
        });

        await expect(fetchBookData()).rejects.toThrow(
            'Failed to fetch book data: Service Unavailable'
        );
    });

    it('propagates network errors', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network down'));

        await expect(fetchBookData()).rejects.toThrow('Network down');
    });
});
