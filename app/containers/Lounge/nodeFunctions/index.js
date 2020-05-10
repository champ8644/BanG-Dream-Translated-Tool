// import assAnalzer from './assAnalyzer';
import speedTester from './speedTester';

let readyToTest = true;

export default async function tester() {
  if (!readyToTest) return;
  // eslint-disable-next-line no-console
  console.log('start Testing');
  readyToTest = false;

  // assAnalzer();
  speedTester();

  // eslint-disable-next-line no-console
  console.log('end of Testing');
  readyToTest = true;
}
