const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

test('clicking practice button adds listening class', () => {
  jest.useFakeTimers();
  const filePath = path.join(__dirname, '..', 'deepseek_html_20250531_d079a6 (3).html');
  let html = fs.readFileSync(filePath, 'utf8');
  // Remove external script to avoid network requests during test
  html = html.replace(/<script src="https:\/\/code\.responsivevoice\.org\/responsivevoice.js"><\/script>/, '');

  const dom = new JSDOM(html, { runScripts: 'dangerously' });
  const { window } = dom;
  const button = window.document.querySelector('.practice-btn');
  expect(button).not.toBeNull();

  // Stub SpeechRecognition so the function does not early-return
  window.SpeechRecognition = class { start() {} };

  // Simulate click event with global event object
  const evt = new window.Event('click', { bubbles: true });
  window.event = evt;
  button.dispatchEvent(evt);

  expect(button.classList.contains('listening')).toBe(true);

  // Run any pending timers to avoid Jest open handles warning
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
