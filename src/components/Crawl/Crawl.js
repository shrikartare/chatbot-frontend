
import React, { useState } from "react";
import { API_BASE_URL } from "../../apiConfig";
import styles from "./Crawl.module.css";
import { LOCALES } from "../../constants/locales";

const Crawl = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [locale, setLocale] = useState(LOCALES[0].value);
  const [pageUrls, setPageUrls] = useState([]);

  const handleCrawl = async () => {
    setLoading(true);
    setResult("");
    setPageUrls([]);
    try {
      const res = await fetch(`${API_BASE_URL}/${locale}/crawl`, {});
      const data = await res.json();
      setResult(data.message || "Crawl successful");
      if (Array.isArray(data.aemPageResponses)) {
        setPageUrls(
          data.aemPageResponses.map((p) => p.pageUrl).filter(Boolean)
        );
      }
    } catch (e) {
      setResult("Error crawling data");
    }
    setLoading(false);
  };

  return (
    <div className={styles.crawlPage}>
      <div className={styles.crawlCard}>
        <div className={styles.crawlIcon} aria-label="crawl icon">
          🔎
        </div>
        <h2 className={styles.crawlTitle}>Crawl Data</h2>
        <div className={styles.crawlDesc}>
          Start the data crawling process. This will scan and collect new data.
          <br />
          Ensure your sources are accessible.
        </div>
        <select
          className={styles.crawlInput}
          value={locale}
          onChange={e => setLocale(e.target.value)}
          disabled={loading}
        >
          {LOCALES.map(loc => (
            <option key={loc.value} value={loc.value}>{loc.label}</option>
          ))}
        </select>
        <button
          onClick={handleCrawl}
          disabled={loading}
          className={styles.crawlButton}
        >
          {loading ? "Crawling..." : "Crawl"}
        </button>
        {result && (
          <div
            className={
              result.includes("Error")
                ? `${styles.crawlResult} ${styles.error}`
                : `${styles.crawlResult} ${styles.success}`
            }
          >
            {result}
          </div>
        )}
        {pageUrls.length > 0 && (
          <div className={styles.crawlResultList}>
            <div className={styles.crawlResultTitle}>Crawled Page URLs:</div>
            <ul className={styles.crawlResultUrls}>
              {pageUrls.map((url, idx) => (
                <li key={idx} className={styles.crawlResultUrl}>
                  {url}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crawl;
