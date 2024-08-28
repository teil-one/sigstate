import { effect, computed } from '@preact/signals';
import { PreactSigstate } from '@teil-one/sigstate-preact-adapter';
import './App.css';

const count = PreactSigstate.get<number>('demo.count');

const doubleCount = computed(() => (count.value ?? 0) * 2);

effect(() => {
  console.log('!! Preact effect on count', count.value);
});

const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with Preact</h1>
      <button
        onClick={() => {
          count.value = (count.value ?? 0) + 1;
        }}
      >
        count: {count.value ?? 'undefined'}, double: {doubleCount.value}
      </button>
    </div>
  );
};

export default App;
