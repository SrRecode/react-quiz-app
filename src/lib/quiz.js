/** Pure quiz-engine helpers. No React, no DOM — just immutable transforms. */

export function createSession(quiz) {
  return {
    quizId: quiz.id,
    title: quiz.title,
    total: quiz.questions.length,
    current: 0,
    answers: quiz.questions.map(() => null),
    finished: false,
  };
}

export function answer(session, choice) {
  if (session.finished) return session;
  const answers = session.answers.map((value, index) =>
    index === session.current ? choice : value,
  );
  return { ...session, answers };
}

export function goTo(session, index) {
  const clamped = Math.max(0, Math.min(session.total - 1, index));
  return { ...session, current: clamped };
}

export function nextQuestion(session) {
  return goTo(session, session.current + 1);
}

export function previousQuestion(session) {
  return goTo(session, session.current - 1);
}

export function answeredCount(session) {
  return session.answers.filter((value) => value !== null).length;
}

export function isComplete(session) {
  return answeredCount(session) === session.total;
}

export function submit(session) {
  return { ...session, finished: true };
}

/** Score a finished (or in-progress) session against its quiz. */
export function computeResults(session, quiz) {
  const breakdown = quiz.questions.map((question, index) => {
    const chosen = session.answers[index];
    return {
      id: question.id,
      prompt: question.prompt,
      chosen,
      correctIndex: question.answer,
      explanation: question.explanation,
      isCorrect: chosen === question.answer,
    };
  });
  const correct = breakdown.filter((item) => item.isCorrect).length;
  const total = breakdown.length;
  return {
    correct,
    total,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    breakdown,
  };
}

export function grade(percent) {
  if (percent >= 90) return 'Excellent';
  if (percent >= 70) return 'Good';
  if (percent >= 50) return 'Pass';
  return 'Keep practicing';
}
