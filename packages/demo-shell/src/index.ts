import './index.css';
import { Sigstate } from '@teil-one/sigstate';

document.querySelector('#root')!.innerHTML = `
<div class="content">
  <h1>Sigstate</h1>
  <button id="counter"></button>
</div>
`;

const counter = document.getElementById('counter');

if (counter) {
  const count = Sigstate.set('count', 0);

  counter.addEventListener('click', () => {
    count.set(count.get() + 1);
  });

  Sigstate.effect(() => {
    counter.innerHTML = `count: ${count.get()}`;
  });
}
