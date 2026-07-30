import { useState } from 'react';
import { ROLES } from '../data/criteria';
import { getDashboardStats } from '../utils/storage';
import DashboardCharts from './DashboardCharts';

export default function Welcome({ onStart, onAdmin }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState(null);
  const [nameError, setNameError] = useState('');
  const stats = getDashboardStats();

  function handleStart() {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('الاسم مطلوب');
      return;
    }
    if (!role) return;
    onStart({ role, name: trimmed });
  }

  return (
    <div className="welcome">
      <DashboardCharts stats={stats} />

      <div className="welcome-badge">تقييم ذاتي</div>
      <h1>نموذج تقييم المدرب والمعلم العسكري</h1>
      <p className="welcome-lead">
        سجّل اسمك، اختر دورك، ثم أجب عن 24 سؤالاً للحصول على تصنيفك
        وخطة تطوير مفصّلة.
      </p>

      <div className="register-form">
        <label className="field-label" htmlFor="user-name">
          الاسم <span className="required">*</span>
        </label>
        <input
          id="user-name"
          type="text"
          className={`text-input ${nameError ? 'input-error' : ''}`}
          placeholder="مثال: الرقيب أحمد"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) setNameError('');
          }}
          required
        />
        {nameError && <p className="form-error">{nameError}</p>}

        <p className="field-label">أنا أعمل كـ:</p>
        <div className="role-select">
          {Object.values(ROLES).map((r) => (
            <button
              key={r.id}
              type="button"
              className={`role-card ${role === r.id ? 'selected' : ''}`}
              onClick={() => setRole(r.id)}
            >
              <span className="role-icon">{r.id === 'trainer' ? '🎯' : '📚'}</span>
              <strong>{r.label}</strong>
              <span>{r.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="info-box">
        <h4>مستويات التصنيف</h4>
        <ul>
          <li><strong>ناجح</strong> — متوسط 3.5+ على المعايير الأساسية</li>
          <li><strong>متميز</strong> — ناجح + متوسط 4+ على معايير التميز</li>
          <li><strong>في مسار التطوير</strong> — دون الحد الأدنى للنجاح، مع إمكانية التطور</li>
        </ul>
      </div>

      <div className="welcome-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={handleStart}
          disabled={!role}
        >
          ابدأ التقييم
        </button>
        <button type="button" className="btn-admin" onClick={onAdmin}>
          🔐 دخول الإدارة
        </button>
      </div>
    </div>
  );
}
