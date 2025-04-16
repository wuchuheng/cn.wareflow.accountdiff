import { Suspense } from 'react';
import AccountComparisonTool from './components/AccountComparisonTool';

function App() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback="Loading...">
        <AccountComparisonTool />
      </Suspense>
    </div>
  );
}

export default App;
