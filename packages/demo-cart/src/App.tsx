import { signal, effect } from '@preact/signals';
import { Sigstate } from '@teil-one/sigstate';
import './App.css';

const count = Sigstate.set<number>('demo.count', 0);
// const count = new Signal.State(0);

const preactCount = signal(0);

Sigstate.effect(() => {
  const c = count.get();
  preactCount.value = c;

  console.log('!! effect Sigstate demo.count', c);
});

effect(() => {
  count.set(preactCount.value);
});

const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with Preact</h1>
      <button
        onClick={() => {
          console.log('!! click');
          preactCount.value = preactCount.value + 1;
        }}
      >
        {preactCount.value}
      </button>
    </div>
  );
};

export default App;
