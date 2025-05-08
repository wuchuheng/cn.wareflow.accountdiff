import { t } from 'i18next';
import { useState } from 'react';
import AccountComparisonTool from '../../components/AccountComparisonTool';
import RepatedItem from '../../components/RepatedItem';

function App() {
  const Tabs = [
    {
      label: t('accountComparisonTool', { defaultValue: 'Account Comparison Tool' }),
      component: <AccountComparisonTool />,
    },
    // These tabs will be fond the repleated items.
    {
      label: t('repeatedItems', { defaultValue: 'Repeated Items' }),
      component: <RepatedItem />,
    },
  ];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">{t('accountComparisonTool')}</h1>

      <div className="flex justify-center mb-4">
        {Tabs.map((tab, index) => (
          <button
            key={index}
            className={`mx-2 px-4 py-2 rounded-md ${
              activeTab === index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">{Tabs[activeTab].component}</div>
    </div>
  );
}

export default App;
