/**
 * Quiz data. Each question has a single correct answer (the index into
 * `choices`) and an explanation shown on the results screen.
 */
export const QUIZZES = [
  {
    id: 'javascript-basics',
    title: 'JavaScript Basics',
    questions: [
      {
        id: 'js-1',
        prompt: 'Which keyword declares a block-scoped variable that cannot be reassigned?',
        choices: ['var', 'let', 'const', 'static'],
        answer: 2,
        explanation: '`const` creates a block-scoped binding that cannot be reassigned.',
      },
      {
        id: 'js-2',
        prompt: 'What does `typeof []` evaluate to?',
        choices: ['"array"', '"object"', '"list"', '"undefined"'],
        answer: 1,
        explanation: 'Arrays are objects in JavaScript, so `typeof []` is `"object"`.',
      },
      {
        id: 'js-3',
        prompt: 'Which method creates a new array with elements that pass a test?',
        choices: ['map', 'forEach', 'filter', 'reduce'],
        answer: 2,
        explanation: '`filter` returns a new array containing only the elements that pass.',
      },
      {
        id: 'js-4',
        prompt: 'What is `2 + "2"` in JavaScript?',
        choices: ['4', '"22"', 'NaN', 'TypeError'],
        answer: 1,
        explanation: 'The number is coerced to a string and concatenated, giving `"22"`.',
      },
    ],
  },
  {
    id: 'web-platform',
    title: 'Web Platform',
    questions: [
      {
        id: 'web-1',
        prompt: 'Which HTTP status code means "Not Found"?',
        choices: ['200', '301', '404', '500'],
        answer: 2,
        explanation: '404 indicates the requested resource could not be found.',
      },
      {
        id: 'web-2',
        prompt: 'Which tag loads JavaScript that runs after HTML parsing?',
        choices: ['<script>', '<script defer>', '<script async>', '<js>'],
        answer: 1,
        explanation: '`defer` downloads in parallel and executes after parsing, in order.',
      },
      {
        id: 'web-3',
        prompt: 'What does CSS stand for?',
        choices: [
          'Computer Styled Sections',
          'Cascading Style Sheets',
          'Creative Style System',
          'Colorful Style Syntax',
        ],
        answer: 1,
        explanation: 'CSS is Cascading Style Sheets.',
      },
    ],
  },
];

export function getQuiz(id) {
  return QUIZZES.find((quiz) => quiz.id === id) ?? null;
}
