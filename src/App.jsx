import { QUIZZES } from './data/quizzes.js';
import { useQuiz } from './hooks/useQuiz.js';
import { answeredCount, grade, isComplete } from './lib/quiz.js';

export default function App() {
  const { quiz, session, results, start, reset, exit, choose, go, next, prev, finish } = useQuiz();

  if (!quiz || !session) {
    return (
      <main className="app">
        <header className="intro">
          <h1>Quizzes</h1>
          <p>Pick a topic to test yourself.</p>
        </header>
        <ul className="picker">
          {QUIZZES.map((item) => (
            <li key={item.id}>
              <button type="button" className="picker__card" onClick={() => start(item)}>
                <span className="picker__title">{item.title}</span>
                <span className="picker__meta">{item.questions.length} questions</span>
              </button>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  const question = quiz.questions[session.current];
  const chosen = session.answers[session.current];
  const answered = answeredCount(session);
  const complete = isComplete(session);
  const progress = Math.round((session.current / session.total) * 100);

  if (session.finished && results) {
    const verdict = grade(results.percent);
    return (
      <main className="app">
        <header className="results__head">
          <h1>Results</h1>
          <p className="results__score">
            {results.correct} / {results.total} correct · {results.percent}%
          </p>
          <p className={`verdict verdict--${verdict.replace(/\s+/g, '-').toLowerCase()}`}>
            {verdict}
          </p>
        </header>

        <ol className="review" aria-label="Answer review">
          {results.breakdown.map((item, index) => (
            <li key={item.id} className={`review__item ${item.isCorrect ? 'is-correct' : 'is-wrong'}`}>
              <p className="review__prompt">
                {index + 1}. {item.prompt}
              </p>
              <p className="review__answer">
                Your answer: {item.chosen === null ? '—' : quiz.questions[index].choices[item.chosen]}
                {item.isCorrect ? ' ✓' : ` ✗ (correct: ${quiz.questions[index].choices[item.correctIndex]})`}
              </p>
              <p className="review__explain">{item.explanation}</p>
            </li>
          ))}
        </ol>

        <div className="actions">
          <button type="button" className="btn btn--primary" onClick={reset}>
            Try again
          </button>
          <button type="button" className="btn" onClick={exit}>
            Back to quizzes
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="quiz__head">
        <h1>{quiz.title}</h1>
        <p className="quiz__progressText">
          Question {session.current + 1} of {session.total} · {answered} answered
        </p>
      </header>

      <div className="progress" aria-hidden="true">
        <div className="progress__bar" style={{ width: `${progress}%` }} />
      </div>

      <section className="question">
        <h2 className="question__prompt">{question.prompt}</h2>
        <ul className="choices">
          {question.choices.map((choice, index) => (
            <li key={choice}>
              <button
                type="button"
                className={`choice${chosen === index ? ' choice--selected' : ''}`}
                aria-pressed={chosen === index}
                onClick={() => choose(index)}
              >
                {choice}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="actions">
        <button
          type="button"
          className="btn"
          onClick={prev}
          disabled={session.current === 0}
        >
          Previous
        </button>
        {session.current < session.total - 1 ? (
          <button type="button" className="btn btn--primary" onClick={next}>
            Next
          </button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={finish} disabled={!complete}>
            {complete ? 'See results' : `Answer all ${session.total} to finish`}
          </button>
        )}
      </div>

      <nav className="dots" aria-label="Jump to question">
        {session.answers.map((value, index) => (
          <button
            key={index}
            type="button"
            className={`dot${index === session.current ? ' dot--active' : ''}${
              value !== null ? ' dot--answered' : ''
            }`}
            aria-label={`Go to question ${index + 1}`}
            aria-current={index === session.current ? 'true' : undefined}
            onClick={() => go(index)}
          />
        ))}
      </nav>
    </main>
  );
}
