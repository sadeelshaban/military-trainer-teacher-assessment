import { useRef, useState } from 'react';
import { ADMIN_PASSWORD, isAdminConfigured } from '../config';
import { ROLES } from '../data/criteria';
import { getAssessmentById, getDashboardStats, loadAssessments } from '../utils/storage';
import { exportResultsPdf } from '../utils/exportPdf';
import DashboardCharts from './DashboardCharts';
import ResultReport from './ResultReport';

const AUTH_KEY = 'admin_authenticated';

function AdminLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAdminConfigured()) {
    return (
      <div className="admin-login">
        <h2>🔐 Admin access</h2>
        <p className="form-error">
          Admin password is not configured. Set <code>VITE_ADMIN_PASSWORD</code> in your{' '}
          <code>.env</code> file (see <code>.env.example</code>).
        </p>
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back
        </button>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1');
      onLogin();
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  }

  return (
    <div className="admin-login">
      <h2>🔐 دخول الإدارة</h2>
      <form onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="admin-pass">كلمة المرور</label>
        <input
          id="admin-pass"
          type="password"
          className="text-input"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          placeholder="أدخل كلمة مرور الإدارة"
        />
        {error && <p className="form-error">{error}</p>}
        <div className="nav-buttons">
          <button type="button" className="btn-secondary" onClick={onBack}>رجوع</button>
          <button type="submit" className="btn-primary">دخول</button>
        </div>
      </form>
    </div>
  );
}

function AdminDetail({ record, onBack }) {
  const pdfRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await exportResultsPdf(pdfRef.current, `${record.name}-نتيجة-التقييم.pdf`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="admin-detail">
      <div className="results-actions-top">
        <button type="button" className="btn-secondary" onClick={onBack}>
          ← العودة للقائمة
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? 'جاري التصدير...' : 'تصدير PDF'}
        </button>
      </div>
      <ResultReport
        result={record.result}
        pdfRef={pdfRef}
        completedAt={record.createdAt}
      />
    </div>
  );
}

export default function AdminPanel({ onBack }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1');
  const [selectedId, setSelectedId] = useState(null);
  const [records, setRecords] = useState(() => loadAssessments());
  const stats = getDashboardStats();

  function refresh() {
    setRecords(loadAssessments());
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    setSelectedId(null);
  }

  if (!authed) {
    return <AdminLogin onLogin={() => { setAuthed(true); refresh(); }} onBack={onBack} />;
  }

  const selected = selectedId ? getAssessmentById(selectedId) : null;

  if (selected) {
    return (
      <AdminDetail
        record={selected}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>لوحة الإدارة</h2>
        <div className="admin-header-actions">
          <button type="button" className="btn-secondary btn-sm" onClick={refresh}>
            تحديث
          </button>
          <button type="button" className="btn-secondary btn-sm" onClick={handleLogout}>
            خروج
          </button>
          <button type="button" className="btn-secondary btn-sm" onClick={onBack}>
            الرئيسية
          </button>
        </div>
      </div>

      <DashboardCharts stats={stats} />

      <section className="admin-list-section">
        <h3>جميع التقييمات ({records.length})</h3>

        {records.length === 0 ? (
          <p className="empty-list">لا توجد تقييمات مسجّلة.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>الدور</th>
                  <th>المستوى</th>
                  <th>متوسط أساسي</th>
                  <th>متوسط تميز</th>
                  <th>التاريخ</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.name}</strong></td>
                    <td>{ROLES[r.roleId]?.label}</td>
                    <td>
                      <span
                        className="level-pill"
                        style={{ background: r.result.meta.color }}
                      >
                        {r.result.meta.title}
                      </span>
                    </td>
                    <td>{r.result.averages.base}/5</td>
                    <td>
                      {r.result.distinguishedEvaluated && r.result.averages.distinguished != null
                        ? `${r.result.averages.distinguished}/5`
                        : '—'}
                    </td>
                    <td>
                      {new Date(r.createdAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => setSelectedId(r.id)}
                      >
                        عرض / PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export function isAdminAuthed() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}
