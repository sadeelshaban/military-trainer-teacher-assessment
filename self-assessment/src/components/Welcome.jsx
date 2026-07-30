import { useState } from 'react';
import { ROLES } from '../data/criteria';

export default function Welcome({ onStart }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState(null);
  const [nameError, setNameError] = useState('');

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
      <div className="welcome-badge">تقييم ذاتي</div>
      <h1>نموذج تقييم المدرب والمعلم العسكري</h1>
      <p className="welcome-lead">
        سجّل اسمك، اختر دورك، ثم أجب عن المعايير الأساسية (12 سؤالاً).
        إذا اجتزتها، تنتقل لمعايير التميز.
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
        <h4>كيف يعمل التصنيف؟</h4>
        <ul>
          <li><strong>المرحلة 1:</strong> 12 معياراً أساسياً — يجب اجتيازها (متوسط 3.5+)</li>
          <li><strong>المرحلة 2:</strong> معايير التميز — فقط إذا نجحت بالمرحلة 1</li>
          <li><strong>في مسار التطوير:</strong> إذا لم تستوفِ المعايير الأساسية</li>
        </ul>
      </div>

      <button
        type="button"
        className="btn-primary btn-start"
        onClick={handleStart}
        disabled={!role}
      >
        ابدأ التقييم
      </button>
    </div>
  );
}
