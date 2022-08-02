export default function generateUID() {
  let firstPart = (Math.random() * 46656) | 0;
  let secondPart = (Math.random() * 46656) | 0;
  firstPart = ("0000" + firstPart.toString(36)).slice(-4);
  secondPart = ("0000" + secondPart.toString(36)).slice(-4);
  return (firstPart + secondPart).toUpperCase();
}
