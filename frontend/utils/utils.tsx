export const toggleArrayValue = (array: number[], value: number) => {
    const newState = [...array];
    if (newState.includes(value)) {
      newState.splice(newState.indexOf(value), 1);
    } else {
      newState.push(value);
    }
    return newState;
  };
  