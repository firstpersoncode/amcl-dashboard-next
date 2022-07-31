export default function cleanObj(obj) {
  for (var propName in obj) {
    if (typeof obj[propName] === "object")
      obj[propName] = cleanObj(obj[propName]);
    else {
      if (
        obj[propName] === "" ||
        obj[propName] === null ||
        obj[propName] === undefined
      ) {
        delete obj[propName];
      }
    }
  }
  return obj;
}
