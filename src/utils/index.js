const shuffleArray = (array) =>
  array
    .map((x) => [Math.random(), x])
    .sort(([a], [b]) => a - b)
    .map(([_, x]) => x);

export { shuffleArray };
