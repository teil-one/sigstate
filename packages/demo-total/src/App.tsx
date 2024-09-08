import { sigstate } from '@sigstate/react';
import { computed, signal, effect } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';

import './App.css';

const count = sigstate('demo.count', 0);
// const count = signal(0);

const tripleCount = computed(() => count.value * 3);

// effect(() => {
//   countCore.set(count.value);
// });

// effectCore(() => {
//   count.value = countCore.get();
// });

export function App() {
  useSignals();

  return (
    <div className="content">
      <button
        onClick={() => {
          count.value = count.value + 1;
        }}
      >
        count: {count.value}, triple: {tripleCount.value}
      </button>
    </div>
  );
}

export default App;
