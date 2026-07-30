import { useRef, useState } from 'react';
import { exportResultsPdf } from '../utils/exportPdf';
import ResultReport from './ResultReport';

export default function Results({ result, onRestart }) {
  const pdfRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  async function handleExportPdf() {
    setExporting(true);
    try {
      await exportResultsPdf(pdfRef.current, `${result.userName}-نتيجة-التقييم.pdf`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="results">
      <div className="results-actions-top">
        <button type="button" className="btn-secondary" onClick={onRestart}>
          إعادة التقييم
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleExportPdf}
          disabled={exporting}
        >
          {exporting ? 'جاري التصدير...' : 'تصدير PDF'}
        </button>
      </div>

      <ResultReport result={result} pdfRef={pdfRef} />
    </div>
  );
}
