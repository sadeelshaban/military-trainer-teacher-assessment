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
      <img src="/logo.png" alt="" className="welcome-logo" />
      <div className="welcome-badge">نظام التقييم الذاتي</div>
      <h1>لجنة تقييم كادر جامعة الاستقلال</h1>
      <p className="welcome-lead">
        سجّل اسمك، اختر دورك، ثم أجب عن جميع المعايير (24 سؤالاً — النجاح والتميز معاً).
        يُقيَّم مستوى النجاح والتميز في النهاية.
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
          <li><strong>جميع الأسئلة:</strong> 12 معيار نجاح + 12 معيار تميز في استبيان واحد</li>
          <li><strong>النجاح:</strong> متوسط 3.5+ في المعايير الأساسية مع شروط إضافية</li>
          <li><strong>التميز:</strong> يُقيَّم فقط إذا نجحت — وإلا تُسجَّل «لم تتحقق معايير التميز»</li>
          <li><strong>في مسار التطوير:</strong> إذا لم تستوفِ معايير النجاح</li>
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
