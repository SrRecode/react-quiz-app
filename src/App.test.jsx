import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { QUIZZES } from './data/quizzes.js';

const quiz = QUIZZES[0];

describe('App', () => {
  it('shows the quiz picker first', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Quizzes' })).toBeInTheDocument();
    for (const item of QUIZZES) {
      expect(screen.getByRole('button', { name: new RegExp(item.title) })).toBeInTheDocument();
    }
  });

  it('starts a quiz and shows the first question with choices', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: new RegExp(quiz.title) }));
    expect(screen.getByRole('heading', { name: quiz.questions[0].prompt })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('selects an answer and advances through the questions', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: new RegExp(quiz.title) }));

    const firstChoice = quiz.questions[0].choices[quiz.questions[0].answer];
    await user.click(screen.getByRole('button', { name: firstChoice }));
    expect(screen.getByRole('button', { name: firstChoice })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('heading', { name: quiz.questions[1].prompt })).toBeInTheDocument();
    expect(screen.getByText(/Question 2 of/)).toBeInTheDocument();
  });

  it('requires every question to be answered before finishing', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: new RegExp(quiz.title) }));

    // Jump straight to the last question without answering anything.
    await user.click(screen.getByRole('button', { name: `Go to question ${quiz.questions.length}` }));
    expect(screen.getByRole('button', { name: /Answer all/ })).toBeDisabled();
  });

  it('shows results with a review after finishing', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: new RegExp(quiz.title) }));

    // Answer every question correctly.
    for (let i = 0; i < quiz.questions.length; i += 1) {
      const q = quiz.questions[i];
      await user.click(screen.getByRole('button', { name: q.choices[q.answer] }));
      const next = screen.queryByRole('button', { name: 'Next' });
      if (next) await user.click(next);
    }

    await user.click(screen.getByRole('button', { name: 'See results' }));

    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${quiz.questions.length} / ${quiz.questions.length} correct`))).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();

    const review = screen.getByRole('list', { name: 'Answer review' });
    expect(within(review).getAllByRole('listitem')).toHaveLength(quiz.questions.length);
  });

  it('can go back to the quiz list from the results screen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: new RegExp(quiz.title) }));
    for (let i = 0; i < quiz.questions.length; i += 1) {
      const q = quiz.questions[i];
      await user.click(screen.getByRole('button', { name: q.choices[q.answer] }));
      const next = screen.queryByRole('button', { name: 'Next' });
      if (next) await user.click(next);
    }
    await user.click(screen.getByRole('button', { name: 'See results' }));
    await user.click(screen.getByRole('button', { name: 'Back to quizzes' }));

    expect(screen.getByRole('heading', { name: 'Quizzes' })).toBeInTheDocument();
  });
});
