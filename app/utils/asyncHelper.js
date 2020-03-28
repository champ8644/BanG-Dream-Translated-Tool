export function timeOut(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
