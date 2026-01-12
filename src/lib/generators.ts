export const generateMeetCode = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const part = (n: number) =>
    Array.from({ length: n }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
  return `${part(3)}-${part(3)}-${part(3)}`;
};
