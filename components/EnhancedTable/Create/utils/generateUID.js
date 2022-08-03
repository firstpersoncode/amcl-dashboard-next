function generateRandom(min = 46656, max = 99999) {
  let difference = max - min;
  let rand = Math.random();
  rand = Math.floor(rand * difference);
  rand = rand + min;

  return rand;
}

export default function generateUID() {
  let firstPart = (Math.random() * generateRandom()) | 0;
  let secondPart = (Math.random() * generateRandom()) | 0;
  firstPart = ("0000" + firstPart.toString(36)).slice(-4);
  secondPart = ("0000" + secondPart.toString(36)).slice(-4);
  return (firstPart + secondPart).toUpperCase();
}
