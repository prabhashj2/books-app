import {useState} from 'react';
import {Owner} from './types';
import {fetchBookData} from './services/api';
import {processBooks} from './utils/processBooks';
import {mockOwners} from './mockData';
import './App.css';

export default function App(){
    const [owners, setOwners] = useState<Owner[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [usingMockData, setUsingMockData] = useState<boolean>(false);
    const [hardcoverOnly, setHardcoverOnly] = useState<boolean>(false);
    const [dataFetched, setDataFetched] = useState<boolean>(false);

const handleGetData = async () => {
    setLoading(true);
    setError(null);
    setUsingMockData(false);
    try {
      let data: Owner[] | undefined;
      let fellBackToMockData = false;
      try {
        data = await fetchBookData();
      } catch (e) {
        console.warn("API unreachable, falling back to sample data.", e);
        fellBackToMockData = true;
      }

      if (!data || !Array.isArray(data)) {
        data = mockOwners;
        fellBackToMockData = true;
      }

      setOwners(data);
      setUsingMockData(fellBackToMockData);
      setDataFetched(true);
    } catch (err) {
      setError('Failed to load book data.');
    } finally {
      setLoading(false); // This stops the button from staying stuck on "Loading..."
    }
  };

    const adultBooks = processBooks(owners, true, hardcoverOnly);
    const childBooks = processBooks(owners, false, hardcoverOnly);

    const adultHeading = hardcoverOnly ? "Hardcover Books owned by Adults" : "Books owned by Adults";
    const childHeading = hardcoverOnly ? "Hardcover Books owned by Children" : "Books owned by Children";

    return(
        <div className="container">
            <header className = "header">
                <h1>Bupa Book Library</h1>
            </header>

            <div className="controls">
                <button className = "primary-btn" onClick={handleGetData} disabled={loading}>
                    {loading?"Loading...":"Get Books"}
                </button>
                <label className="checkbox-label">
                    <input type="checkbox" checked={hardcoverOnly} onChange={(e) => setHardcoverOnly(e.target.checked)} />
                    Hardcover Only
                </label>
            </div>

            {error && <div className="error-message">{error}</div>}
            {usingMockData && (
                <div className="notice-message">
                    Showing sample data — the live API is unavailable right now.
                </div>
            )}

            {dataFetched && (
                <div className="results-grid">
                    <section className="category-section">
                        <h2>{adultHeading}</h2>
                        <ul>
                            {adultBooks.map((item) => (
                                <li key={`${item.ownerName}-${item.bookName}`}><strong>{item.bookName}</strong><span className="owner-tag">({item.ownerName})</span></li>
                            ))}
                        </ul>
                    </section>

                    <section className="category-section">
                        <h2>{childHeading}</h2>
                        <ul>
                            {childBooks.map((item) => (
                                <li key={`${item.ownerName}-${item.bookName}`}><strong>{item.bookName}</strong><span className="owner-tag">({item.ownerName})</span></li>
                            ))}
                        </ul>
                    </section>
                </div>
            )}
        </div>
    );
}