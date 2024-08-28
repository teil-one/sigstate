import './index.css';
import { Sigstate } from '@teil-one/sigstate';

Sigstate.addTrustedOrigins(['http://localhost:3001']);

document.querySelector('#root')!.innerHTML = `
<h1>Sigstate</h1>
<button id="counter"></button>
<div class="content">
  <div id="cart">
    <iframe src="http://localhost:3001"></iframe>
  </div>
</div>
`;

const counter = document.getElementById('counter');

if (counter) {
  const count = Sigstate.set('demo.count', 0);

  counter.addEventListener('click', () => {
    count.set(count.get() + 1);
  });

  Sigstate.effect(() => {
    counter.innerHTML = `count: ${count.get()}`;
  });
}
