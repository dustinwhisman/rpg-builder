export const computedStat = (die, modifier) => {
  const highestValue = Number.parseInt(die.substring(1), 10);

  return (highestValue / 2) + modifier;
};
