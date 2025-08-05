
import React, { useState } from "react";
import { API_BASE_URL } from "../../apiConfig";
import styles from "./Purge.module.css";
import { LOCALES } from "../../constants/locales";

const Purge = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [locale, setLocale] = useState(LOCALES[0].value);

  const handlePurge = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API_BASE_URL}/${locale}/purge`);
      const data = await res.json();
      if (res.ok) {
        setResult(data.message || "Purge successful");
      } else {
        setResult(data.error || "Error purging data");
      }
    } catch (e) {
      setResult("Error purging data");
    }
    setLoading(false);
  };

  return (
    <div className={styles.purgePage}>
      <div className={styles.purgeCard}>
        <div className={styles.purgeIcon} aria-label="purge icon">🗑️</div>
        <h2 className={styles.purgeTitle}>Purge Data</h2>
        <div className={styles.purgeDesc}>
          Remove all stored data from the system. This action is <b>irreversible</b>.<br />
          Use with caution.
        </div>
        <select
          className={styles.purgeInput}
          value={locale}
          onChange={e => setLocale(e.target.value)}
          disabled={loading}
        >
          {LOCALES.map(loc => (
            <option key={loc.value} value={loc.value}>{loc.label}</option>
          ))}
        </select>
        <button
          onClick={handlePurge}
          disabled={loading}
          className={styles.purgeButton}
        >
          {loading ? 'Purging...' : 'Purge'}
        </button>
        {result && (
          <div className={
            result.includes('Error')
              ? `${styles.purgeResult} ${styles.error}`
              : `${styles.purgeResult} ${styles.success}`
          }>
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default Purge;
