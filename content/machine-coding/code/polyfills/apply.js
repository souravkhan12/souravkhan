const first = {
  name: "sourav",
};

function printNames(a, b) {
  return this.name + " " + a + " " + b;
}
Function.prototype.myApply = function (thisArgs, args = []) {
  const self = thisArgs || globalThis;
  const key = Symbol();
  self[key] = this;

  const result = self[key](...args);
  delete self[key];
  return result;
};

console.log(printNames.myApply(first, ["hi", "there"]));
