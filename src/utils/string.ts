export function camelCaseToUserReadable(data: string): string {
  const words = data.split(/(?=[A-Z])/).map((word) => {
    return word[0].toUpperCase() + word.slice(1);
  });

  return words.join(' ');
}

export function columnToLetter(column: number) {
  let letter = '';
  while (column > 0) {
    const temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}
