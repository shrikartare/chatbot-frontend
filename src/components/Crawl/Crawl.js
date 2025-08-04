import React, { useState } from "react";
import { API_BASE_URL } from "../../apiConfig";
import styles from "./Crawl.module.css";

const Crawl = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [url, setUrl] = useState("/en_gb/customer-service.html");
  const [pageUrls, setPageUrls] = useState([]);

  const handleCrawl = async () => {
    if (!url.trim()) {
      setResult("Please enter a URL.");
      return;
    }
    setLoading(true);
    setResult("");
    setPageUrls([]);
    try {
      const res = await fetch(`${API_BASE_URL}/crawl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      setResult(data.message || "Crawl successful");
      if (Array.isArray(data.aemPageResponses)) {
        setPageUrls(data.aemPageResponses.map(p => p.pageUrl).filter(Boolean));
      }
    } catch (e) {
      setResult("Error crawling data");
    }
    setLoading(false);
  };

  return (
    <div className={styles.crawlPage}>
      <div className={styles.crawlCard}>
        <div className={styles.crawlIcon} aria-label="crawl icon">🔎</div>
        <h2 className={styles.crawlTitle}>Crawl Data</h2>
        <div className={styles.crawlDesc}>
          Start the data crawling process. This will scan and collect new data.<br />
          Ensure your sources are accessible.
        </div>
        <input
          type="text"
          className={styles.crawlInput}
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="/en_gb/customer-service.html"
          disabled={loading}
        />
        <button
          onClick={handleCrawl}
          disabled={loading || !url.trim()}
          className={styles.crawlButton}
        >
          {loading ? 'Crawling...' : 'Crawl'}
        </button>
        {result && (
          <div className={
            result.includes('Error')
              ? `${styles.crawlResult} ${styles.error}`
              : `${styles.crawlResult} ${styles.success}`
          }>
            {result}
          </div>
        )}
        {pageUrls.length > 0 && (
          <div className={styles.crawlResultList}>
            <div className={styles.crawlResultTitle}>Crawled Page URLs:</div>
            <ul className={styles.crawlResultUrls}>
              {pageUrls.map((url, idx) => (
                <li key={idx} className={styles.crawlResultUrl}>{url}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crawl;
