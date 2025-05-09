import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function AccountComparisonTool() {
  const { t } = useTranslation();
  const [currentAccounts, setCurrentAccounts] = useState<string>('');
  const [expectedAccounts, setExpectedAccounts] = useState<string>('');
  const [expectedAccountsList, setExpectedAccountsList] = useState<string>('');

  // Helper: split by line, trim, remove empty
  const parseList = (str: string): string[] =>
    str
      .split(/\r?\n|,|;/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

  const currentList = parseList(currentAccounts);
  const expectedList = parseList(expectedAccountsList);

  // Find missing and extra
  const missing = expectedList.filter((acc: string) => !currentList.includes(acc));
  const extra = currentList.filter((acc: string) => !expectedList.includes(acc));

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">{t('accountComparisonTool')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">{t('currentlyLoggedAccounts')}</label>
          <textarea
            className="border-2 border-gray-300 rounded-md p-2 w-full min-h-[120px]"
            placeholder={t('sourceAccountPlaceholder')}
            value={currentAccounts}
            onChange={(e) => setCurrentAccounts(e.target.value)}
          />
          <div className="text-sm text-gray-500">共计:{currentList.length}条</div>
        </div>
        <div>
          <label className="block mb-1 font-medium">{t('wishedLoginAccounts')}</label>
          <textarea
            className="border-2 border-gray-300 rounded-md p-2 w-full min-h-[120px]"
            placeholder={t('targetAccountPlaceholder')}
            value={expectedAccounts}
            onChange={(e) => {
              // If the format is like this:
              // name#accountName#password
              // then remove the `#accountName#password` part
              const value = e.target.value;
              const lines = value.split('\n');

              const formattedLines = lines.map((line) => {
                if (line.includes('#')) {
                  return line.split('#')[0];
                }
                return line;
              });
              setExpectedAccounts(value);
              setExpectedAccountsList(formattedLines.join('\n'));
            }}
          />
          <div className="text-sm text-gray-500">共计:{expectedList.length}条</div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-md p-4 mt-4">
        <h3 className="font-semibold mb-2">{t('compareResults')}</h3>
        {currentList.length === 0 && expectedList.length === 0 ? (
          <div className="text-gray-400">{t('noData')}</div>
        ) : (
          <>
            <div className="mb-2">
              <span className="font-medium text-red-600">{t('missedAccounts')}</span>
              <ul className="list-disc list-inside">
                {missing.length === 0 ? (
                  <li className="text-green-600">{t('matched')}</li>
                ) : (
                  missing.map((acc: string) => <li key={acc}>{acc}</li>)
                )}
              </ul>
            </div>
            <div>
              <span className="font-medium text-blue-600">{t('extraAccounts')}</span>
              <ul className="list-disc list-inside">
                {extra.length === 0 ? (
                  <li className="text-green-600">{t('matched')}</li>
                ) : (
                  extra.map((acc: string) => <li key={acc}>{acc}</li>)
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AccountComparisonTool;
