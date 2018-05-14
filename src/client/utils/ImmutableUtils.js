export const sum = (attr, parser = x => x) => (sum, obj) =>
  sum + parser(obj[attr] || (obj.asImmutable ? obj.get(attr) : 0)) || 0;
export const sumInt = (attr, radix = 10) => sum(attr, x => parseInt(x, radix));
export const sumFloat = (attr, radix = 10) =>
  sum(attr, x => parseFloat(x, radix));
