import { useCallback, useMemo, useState } from 'react';
import {
  answer,
  computeResults,
  createSession,
  goTo,
  nextQuestion,
  previousQuestion,
  submit,
} from '../lib/quiz.js';

/**
 * Drives a single quiz session. Pass a quiz to start immediately, or call
 * `start(quiz)` later (e.g. from a quiz picker).
 */
export function useQuiz(initialQuiz = null) {
  const [quiz, setQuiz] = useState(initialQuiz);
  const [session, setSession] = useState(() => (initialQuiz ? createSession(initialQuiz) : null));

  const start = useCallback((nextQuiz) => {
    setQuiz(nextQuiz);
    setSession(createSession(nextQuiz));
  }, []);

  const reset = useCallback(() => {
    if (quiz) setSession(createSession(quiz));
  }, [quiz]);

  const exit = useCallback(() => {
    setQuiz(null);
    setSession(null);
  }, []);

  const choose = useCallback((choice) => {
    setSession((current) => (current ? answer(current, choice) : current));
  }, []);

  const go = useCallback((index) => {
    setSession((current) => (current ? goTo(current, index) : current));
  }, []);

  const next = useCallback(() => {
    setSession((current) => (current ? nextQuestion(current) : current));
  }, []);

  const prev = useCallback(() => {
    setSession((current) => (current ? previousQuestion(current) : current));
  }, []);

  const finish = useCallback(() => {
    setSession((current) => (current ? submit(current) : current));
  }, []);

  const results = useMemo(
    () => (session && quiz ? computeResults(session, quiz) : null),
    [session, quiz],
  );

  return { quiz, session, results, start, reset, exit, choose, go, next, prev, finish };
}
