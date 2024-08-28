import './index.css';
import { sigstate, effect, addTrustedOrigins } from '@sigstate/core';

addTrustedOrigins(['http://localhost:3001', 'http://localhost:4200']);

document.querySelector('#root')!.innerHTML = `
<h1>Sigstate</h1>
<button id="counter"></button>
<div class="content">
  <div id="cart">
    <iframe src="http://localhost:3001"></iframe>
  </div>
  <div id="payment">
    <iframe src="http://localhost:4200"></iframe>
  </div>
</div>
`;

const counter = document.getElementById('counter');

if (counter) {
  const count = sigstate('demo.count', 0);

  counter.addEventListener('click', () => {
    count.set(count.get() + 1);
  });

  effect(() => {
    counter.innerHTML = `count: ${count.get()}`;
  });
}
