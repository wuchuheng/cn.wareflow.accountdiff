import { t } from 'i18next';
import AccountComparisonTool from '../../components/AccountComparisonTool';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">{t('accountComparisonTool')}</h1>
      <AccountComparisonTool />
    </div>
  );
}

export default App;
