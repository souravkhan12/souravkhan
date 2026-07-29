const villan = {
  name: "sourav",
};

function SayName() {
  console.log(this.name);
}

function myCall(fn, thisArgs, ...args) {
  thisArgs.fn = fn;
  const result = thisArgs.fn(...args);
  delete thisArgs.fn;
  return result;
}

myCall(SayName, villan);

Function.prototype.myCall = function (thisArgs, ...args) {
  const key = Symbol();
  thisArgs[key] = this;
  const result = thisArgs[key](...args);
  delete thisArgs[key];
  return result;
};

Function.prototype.myCall = function (thisArgs, ...args) {
  const self = thisArgs || globalThis;
  const key = Symbol();
  self[key] = this;
  const result = self[key](...args);
  delete self[key];
  return result;
};

Function.prototype.myCall = function (thisArgs, ...args) {
  return this.apply(thisArgs, args);
};
