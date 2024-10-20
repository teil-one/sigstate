import { effect, computed } from '@preact/signals';
import { sigstate } from '@sigstate/preact';
import { addTrustedOrigins } from '@sigstate/cross-iframe';
import './App.css';

addTrustedOrigins(['http://localhost:3000']);

const count = sigstate('demo.count', 0);

const doubleCount = computed(() => count.value * 2);

effect(() => {
  console.log('!! Preact effect on count', count.value);
});

const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with Preact</h1>
      <button
        onClick={() => {
          count.value = count.value + 1;
        }}
      >
        count: {count.value}, double: {doubleCount.value}
      </button>
    </div>
  );
};

export default App;
