# React Quiz

A multiple-choice quiz app built with React hooks. Pick a topic, answer the
questions, and get an instant score with a per-question review. The quiz engine
is written as pure functions so it can be tested without a browser, and the UI is
covered with [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

## Features

- Quiz picker with multiple topics
- One question at a time with a progress bar and answered-count indicator
- Previous / Next navigation plus clickable dot indicators to jump around
- Finishing is gated until every question is answered
- Results screen with score, percentage, a grade band and a full review
  (your answer, the correct answer and an explanation per question)
- "Try again" and "Back to quizzes" actions

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm test         # run the test suite once
npm run build    # production build into dist/
```

## Project layout

```
src/data/quizzes.js      Quiz content: topics, questions, answers, explanations
src/lib/quiz.js          Pure engine: createSession, answer, goTo, next/previous,
                         answeredCount, isComplete, submit, computeResults, grade
src/hooks/useQuiz.js     Session state for a single quiz (start/reset/exit + actions)
src/App.jsx              Picker, question view, and results view
src/styles.css           Styling (progress bar, choices, review cards)
vite.config.js           Vite + Vitest configuration
```

### Design notes

- `src/lib/quiz.js` is framework-free. A session is a plain object
  (`{ quizId, total, current, answers, finished }`) and every transition returns
  a **new** session, which makes scoring and navigation easy to reason about and test.
- `computeResults` returns `{ correct, total, percent, breakdown }`, where each
  breakdown entry records the chosen index, the correct index and whether it was right.
- Adding a quiz is just adding an object to `QUIZZES` in `src/data/quizzes.js`.

## Tests

```bash
npm test
```

Covers data integrity (unique ids, valid answer indexes), the engine (answer
recording, submit lock, clamped navigation, completion detection, scoring and
grade bands) and the component (picker, answering, navigation, finish gating,
results review and returning to the list).

## License

MIT
