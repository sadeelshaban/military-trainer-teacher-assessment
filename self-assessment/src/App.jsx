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

  function handleStart({ role, name }) {
    setUserInfo({ role, name });
    setScores({});
    setStep(STEPS.quiz);
  }

  function handleComplete() {
    const classified = classify(scores, userInfo.role, userInfo.name);
    const record = createAssessmentRecord(
      userInfo.name,
      userInfo.role,
      scores,
      classified,
    );
    saveAssessment(record);
    setResult(classified);
    setStep(STEPS.results);
    setRefreshKey((k) => k + 1);
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
          <span className="header-icon">⚔</span>
          <div>
            <strong>التقييم الذاتي</strong>
            <span>المدرب والمعلم العسكري</span>
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
          <Welcome
            key={refreshKey}
            onStart={handleStart}
            onAdmin={() => setStep(STEPS.admin)}
          />
        )}
        {step === STEPS.quiz && userInfo.role && (
          <Questionnaire
            roleId={userInfo.role}
            scores={scores}
            setScores={setScores}
            onComplete={handleComplete}
            onBack={() => setStep(STEPS.welcome)}
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
        <p>نموذج معايير التقييم الذاتي — الإصدار 1.2</p>
      </footer>
    </div>
  );
}
