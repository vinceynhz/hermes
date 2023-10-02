export const generate = () => {
  let result = "";
  for (let i = 0; i<5; i++) {
    const offset = Boolean(Math.round(Math.random())) ? 65 : 97;
    const char = Math.floor(Math.random() * 26) + offset;
    result += String.fromCharCode(char);
  }
  return result;
};