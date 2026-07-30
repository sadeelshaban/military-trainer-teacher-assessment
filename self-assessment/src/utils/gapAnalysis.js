import { RATING_LABELS } from '../data/criteria';

export function analyzeGap(criterion, score) {
  if (!score || score >= 4) return null;

  const rating = RATING_LABELS[score];

  let problem;
  if (score === 1) {
    problem = `أجبت بـ«${rating.label}» (${score}/5) على: «${criterion.question}» — هذا يعني أنك نادراً ما تطبّق «${criterion.name}» في عملك، أو لا تطبّقه أصلاً.`;
  } else if (score === 2) {
    problem = `تقييمك «${rating.label}» (${score}/5) في «${criterion.name}» يدل على تطبيق متقطع — ${rating.desc} — وهذا يؤثر على جودة ${criterion.level === 'distinguished' ? 'تميزك' : 'أدائك'}.`;
  } else {
    problem = `تقييمك «${rating.label}» (${score}/5) في «${criterion.name}» — ${rating.desc}. تحتاج رفع هذا المعيار إلى 4 فأعلى للوصول لمستوى أعلى.`;
  }

  const solution = buildSolution(criterion, score);

  return {
    id: criterion.id,
    name: criterion.name,
    score,
    ratingLabel: rating.label,
    problem,
    solution,
    priority: score <= 2 ? 'high' : 'medium',
  };
}

function buildSolution(criterion, score) {
  const actions = criterion.indicators.map((ind, i) => `${i + 1}. ${ind}`).join('\n');

  if (score <= 2) {
    return `خطة تحسين عاجلة لـ«${criterion.name}»:\n${actions}\n\nابدأ بتطبيق خطوة واحدة هذا الأسبوع، وراجع تقدمك في الجلسة التالية.`;
  }

  return `لتعزيز «${criterion.name}»:\n${actions}\n\nحافظ على ما تفعله جيداً وركّز على الخطوات التي لا تطبّقها بعد.`;
}

export function analyzeAllGaps(criteriaWithScores) {
  return criteriaWithScores
    .map((c) => analyzeGap(c, c.score))
    .filter(Boolean)
    .sort((a, b) => a.score - b.score);
}
