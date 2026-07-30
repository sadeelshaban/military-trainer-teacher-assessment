import { useState } from 'react';
import Welcome from './components/Welcome';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import AdminPanel from './components/AdminPanel';
import { classify } from './utils/scoring';
import { createAssessmentRecord, saveAssessment } from './utils/storage';
import './App.css';

const STEPS = { welcome: 'welcome', quiz: 'quiz', results: 'results', admin: 'admin' };

export default function App() {
  const [step, setStep] = useState(STEPS.welcome);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);
  const [userInfo, setUserInfo] = useState({ role: null, name: '' });
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  function handleStart({ role, name }) {
    setUserInfo({ role, name });
    setScores({});
    setStep(STEPS.quiz);
  }

  async function handleComplete({ distinguishedEvaluated = true, finalScores = null } = {}) {
    const final = finalScores ?? scores;
    const classified = classify(final, userInfo.role, userInfo.name, {
      distinguishedEvaluated,
    });
    const record = createAssessmentRecord(
      userInfo.name,
      userInfo.role,
      final,
      classified,
    );

    setSaving(true);
    setSaveError('');

    try {
      await saveAssessment(record);
      setResult(classified);
      setStep(STEPS.results);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setSaveError(err?.message ?? 'تعذّر حفظ التقييم. تحقق من الاتصال وحاول مرة أخرى.');
    } finally {
      setSaving(false);
    }
  }

  function handleRestart() {
    setScores({});
    setResult(null);
    setUserInfo({ role: null, name: '' });
    setStep(STEPS.welcome);
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <img src="/logo.png" alt="" className="header-logo" />
          <div>
            <strong>لجنة تقييم كادر جامعة الاستقلال</strong>
            <span>نظام التقييم الذاتي</span>
          </div>
          {step !== STEPS.admin && (
            <button
              type="button"
              className="header-admin-btn"
              onClick={() => setStep(STEPS.admin)}
            >
              الإدارة
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {step === STEPS.welcome && (
          <Welcome key={refreshKey} onStart={handleStart} />
        )}
        {step === STEPS.quiz && userInfo.role && (
          <Questionnaire
            roleId={userInfo.role}
            scores={scores}
            setScores={setScores}
            onComplete={handleComplete}
            onBack={() => setStep(STEPS.welcome)}
            saving={saving}
            saveError={saveError}
          />
        )}
        {step === STEPS.results && result && (
          <Results result={result} onRestart={handleRestart} />
        )}
        {step === STEPS.admin && (
          <AdminPanel onBack={() => setStep(STEPS.welcome)} />
        )}
      </main>

      <footer className="app-footer">
        <p>لجنة تقييم كادر جامعة الاستقلال — نظام التقييم الذاتي</p>
      </footer>
    </div>
  );
}
