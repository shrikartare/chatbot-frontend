import React, { useState } from "react";
import { API_BASE_URL } from "../../apiConfig";
import styles from "./Ingest.module.css";

const Ingest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleIngest = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API_BASE_URL}/ingest`);
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
