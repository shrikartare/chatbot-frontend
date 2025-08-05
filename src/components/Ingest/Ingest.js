
import React, { useState } from "react";
import { API_BASE_URL } from "../../apiConfig";
import styles from "./Ingest.module.css";
import { LOCALES } from "../../constants/locales";

const Ingest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [locale, setLocale] = useState(LOCALES[0].value);

  const handleIngest = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API_BASE_URL}/${locale}/ingest`);
      const data = await res.json();
      setResult(data.message || "Ingest successful");
    } catch (e) {
      setResult("Error ingesting data");
    }
    setLoading(false);
  };

  return (
    <div className={styles.ingestPage}>
      <div className={styles.ingestCard}>
        <div className={styles.ingestIcon} aria-label="ingest icon">📥</div>
        <h2 className={styles.ingestTitle}>Ingest Data</h2>
        <div className={styles.ingestDesc}>
          Start the data ingestion process. This will add new data to the system.<br />
          Make sure your sources are ready.
        </div>
        <select
          className={styles.ingestInput}
          value={locale}
          onChange={e => setLocale(e.target.value)}
          disabled={loading}
        >
          {LOCALES.map(loc => (
            <option key={loc.value} value={loc.value}>{loc.label}</option>
          ))}
        </select>
        <button
          onClick={handleIngest}
          disabled={loading}
          className={styles.ingestButton}
        >
          {loading ? 'Ingesting...' : 'Ingest'}
        </button>
        {result && (
          <div className={
            result.includes('Error')
              ? `${styles.ingestResult} ${styles.error}`
              : `${styles.ingestResult} ${styles.success}`
          }>
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ingest;
