import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

function mockFetchResolvedWith(body: unknown, ok = true) {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok,
            statusText: 'Error',
            json: async () => body,
        })
    );
}

function mockFetchRejecting() {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network down')));
}

describe('App', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders the initial state with no results and an enabled button', () => {
        render(<App />);

        expect(screen.getByRole('heading', { name: 'Bupa Book Library' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Get Books' })).toBeEnabled();
        expect(screen.queryByRole('heading', { name: /Books owned by/i })).not.toBeInTheDocument();
    });

    it('fetches and groups books by owner age on button click', async () => {
        const user = userEvent.setup();
        mockFetchResolvedWith([
            {
                name: 'Ada Lovelace',
                age: 36,
                books: [{ name: 'Analytical Engine Notes', type: 'Hardcover' }],
            },
            {
                name: 'Small Timmy',
                age: 9,
                books: [{ name: 'Picture Book', type: 'Paperback' }],
            },
        ]);

        render(<App />);
        await user.click(screen.getByRole('button', { name: 'Get Books' }));

        const adultSection = screen.getByRole('heading', { name: 'Books owned by Adults' }).closest('section')!;
        expect(within(adultSection).getByText('Analytical Engine Notes')).toBeInTheDocument();
        expect(within(adultSection).getByText('(Ada Lovelace)')).toBeInTheDocument();

        const childSection = screen.getByRole('heading', { name: 'Books owned by Children' }).closest('section')!;
        expect(within(childSection).getByText('Picture Book')).toBeInTheDocument();
        expect(within(childSection).getByText('(Small Timmy)')).toBeInTheDocument();
    });

    it('filters to hardcover-only books and updates the headings when the checkbox is toggled', async () => {
        const user = userEvent.setup();
        mockFetchResolvedWith([
            {
                name: 'Ada Lovelace',
                age: 36,
                books: [
                    { name: 'Analytical Engine Notes', type: 'Hardcover' },
                    { name: 'Softcover Notes', type: 'Paperback' },
                ],
            },
        ]);

        render(<App />);
        await user.click(screen.getByRole('button', { name: 'Get Books' }));
        await user.click(screen.getByRole('checkbox', { name: 'Hardcover Only' }));

        expect(screen.getByRole('heading', { name: 'Hardcover Books owned by Adults' })).toBeInTheDocument();
        expect(screen.getByText('Analytical Engine Notes')).toBeInTheDocument();
        expect(screen.queryByText('Softcover Notes')).not.toBeInTheDocument();
    });

    it('shows a loading state while the request is in flight', async () => {
        const user = userEvent.setup();
        let resolveFetch: (value: unknown) => void = () => {};
        vi.stubGlobal(
            'fetch',
            vi.fn().mockReturnValue(
                new Promise(resolve => {
                    resolveFetch = resolve;
                })
            )
        );

        render(<App />);
        const button = screen.getByRole('button', { name: 'Get Books' });
        await user.click(button);

        expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled();

        resolveFetch({ ok: true, json: async () => [] });
        await screen.findByRole('button', { name: 'Get Books' });
    });

    it('falls back to sample data and visibly flags it when the API is unreachable', async () => {
        const user = userEvent.setup();
        mockFetchRejecting();

        render(<App />);
        await user.click(screen.getByRole('button', { name: 'Get Books' }));

        expect(await screen.findByText('Clean Code')).toBeInTheDocument();
        expect(screen.getAllByText('(John Smith)').length).toBeGreaterThan(0);
        expect(
            screen.getByText('Showing sample data — the live API is unavailable right now.')
        ).toBeInTheDocument();
        expect(screen.queryByText('Failed to load book data.')).not.toBeInTheDocument();
    });

    it('does not show the sample-data notice when the real API succeeds', async () => {
        const user = userEvent.setup();
        mockFetchResolvedWith([{ name: 'Real Owner', age: 40, books: [] }]);

        render(<App />);
        await user.click(screen.getByRole('button', { name: 'Get Books' }));

        await screen.findByRole('heading', { name: 'Books owned by Adults' });
        expect(
            screen.queryByText('Showing sample data — the live API is unavailable right now.')
        ).not.toBeInTheDocument();
    });
});
