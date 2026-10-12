import { describe, it, expect } from 'vitest';
import { QUIZZES, getQuiz } from './quizzes.js';
import {
  answer,
  answeredCount,
  computeResults,
  createSession,
  goTo,
  grade,
  isComplete,
  nextQuestion,
  previousQuestion,
  submit,
} from '../lib/quiz.js';

const quiz = getQuiz('javascript-basics');

describe('quiz data', () => {
  it('exposes unique ids and well-formed questions', () => {
    const ids = QUIZZES.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of QUIZZES) {
      expect(item.questions.length).toBeGreaterThan(0);
      for (const q of item.questions) {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.choices.length);
      }
    }
  });

  it('returns null for unknown quizzes', () => {
    expect(getQuiz('nope')).toBeNull();
  });
});

describe('quiz engine', () => {
  it('creates an empty session', () => {
    const session = createSession(quiz);
    expect(session.current).toBe(0);
    expect(session.answers).toEqual([null, null, null, null]);
    expect(session.finished).toBe(false);
    expect(answeredCount(session)).toBe(0);
  });

  it('records the selected answer for the current question', () => {
    const session = answer(createSession(quiz), 2);
    expect(session.answers[0]).toBe(2);
    expect(answeredCount(session)).toBe(1);
  });

  it('ignores answers once submitted', () => {
    const finished = submit(answer(createSession(quiz), 0));
    expect(answer(finished, 1).answers[0]).toBe(0);
  });

  it('navigates with clamping at both ends', () => {
    let session = createSession(quiz);
    session = previousQuestion(session);
    expect(session.current).toBe(0);
    session = nextQuestion(session);
    expect(session.current).toBe(1);
    session = goTo(session, 99);
    expect(session.current).toBe(quiz.questions.length - 1);
    session = goTo(session, -5);
    expect(session.current).toBe(0);
  });

  it('knows when every question is answered', () => {
    let session = createSession(quiz);
    quiz.questions.forEach((q, index) => {
      session = answer(goTo(session, index), q.answer);
    });
    expect(isComplete(session)).toBe(true);
  });

  it('scores a session and builds a breakdown', () => {
    let session = createSession(quiz);
    session = answer(session, 2); // correct
    session = answer(goTo(session, 1), 0); // wrong (answer is 1)
    session = answer(goTo(session, 2), 2); // correct
    session = answer(goTo(session, 3), 1); // correct
    const results = computeResults(session, quiz);
    expect(results.correct).toBe(3);
    expect(results.total).toBe(4);
    expect(results.percent).toBe(75);
    expect(results.breakdown[1]).toMatchObject({ isCorrect: false, correctIndex: 1 });
  });

  it('grades by percentage band', () => {
    expect(grade(100)).toBe('Excellent');
    expect(grade(70)).toBe('Good');
    expect(grade(50)).toBe('Pass');
    expect(grade(10)).toBe('Keep practicing');
  });
});
