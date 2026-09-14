# Bupa Book Library

A small React + TypeScript app that fetches a list of book owners, then groups
their books into "owned by adults" (18+) and "owned by children" (under 18),
sorted alphabetically by book title, with an optional hardcover-only filter.

## Getting started

```bash
npm install
npm run dev        # start the dev server (Vite)
```

## Scripts

| Command                | What it does                                   |
|-------------------------|-------------------------------------------------|
| `npm run dev`            | Start the local dev server                      |
| `npm run build`          | Type-check (`tsc`) then produce a production build |
| `npm run preview`        | Preview the production build locally             |
| `npm test`                | Run the test suite once                          |
| `npm run test:watch`      | Run tests in watch mode                          |
| `npm run test:coverage`   | Run tests with a coverage report                 |

## Project structure

```
src/
  App.tsx                 UI: fetch trigger, filter toggle, results
  types.ts                 Owner / Book shared types
  mockData.ts               Sample data shown when the live API is unreachable
  services/api.ts           fetchBookData() — the one place the API URL and fetch live
  utils/processBooks.ts     Pure function: filter by age group + hardcover, then sort
  test/setup.ts              Vitest + Testing Library setup (jest-dom matchers)
  *.test.ts(x)                Tests colocated next to the code they cover
```

## Testing

Unit tests cover the pure filtering/sorting logic (`processBooks`) and the API
service layer (`fetchBookData`, including error paths). Integration tests
render the full `App` component with a mocked `fetch` and drive it through
Testing Library the way a user would: clicking "Get Books", toggling the
hardcover filter, and asserting on what's rendered.

## A note on the sample-data fallback

The book-owners API this app calls (`digitalcodingtest.bupa.com.au`) isn't
always reachable from a local/dev environment. Rather than fail silently or
leave the UI empty, `handleGetData` falls back to a small hardcoded dataset in
[`src/mockData.ts`](src/mockData.ts) so the UI can still be demoed end-to-end.

This is called out explicitly in the UI — when the fallback is active you'll
see an amber "Showing sample data — the live API is unavailable right now."
banner — so it's never mistaken for a successful live fetch.

## What I'd do with more time

- Add an `.env`-driven API base URL instead of a hardcoded constant, so the
  same build can point at different environments.
- Add an "no results" empty state per category instead of an empty list when
  a filter matches nothing.
- Add a small CI workflow (type-check + test + build) on push/PR.
