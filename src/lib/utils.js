export function minYear(data) {
  let min = data[0].year;
  for (const item of data) {
    if (item.year < min) {
      min = item.year;
    }
  }
  return min;
}
export function maxYear(data) {
  let max = data[0].year;
  for (const item of data) {
    if (item.year > max) {
      max = item.year;
    }
  }
  return max;
}
