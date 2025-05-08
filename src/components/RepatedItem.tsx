import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function RepatedItem() {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<string>('');

  // Helper: split by line, trim, remove empty
  const parseList = (str: string): string[] =>
    str
      .split(/\r?\n|,|;/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

  const accountList = parseList(accounts);

  // Find repeated items and their counts
  const findDuplicates = (items: string[]): Map<string, number> => {
    const counts = new Map<string, number>();
    const duplicates = new Map<string, number>();

    // Count occurrences
    items.forEach((item) => {
      counts.set(item, (counts.get(item) || 0) + 1);
    });

    // Filter only items with count > 1
    counts.forEach((count, item) => {
      if (count > 1) {
        duplicates.set(item, count);
      }
    });

    return duplicates;
  };

  const duplicates = findDuplicates(accountList);
  const hasDuplicates = duplicates.size > 0;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">{t('repeatedItems')}</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">{t('currentlyLoggedAccounts')}</label>
        <textarea
          className="border-2 border-gray-300 rounded-md p-2 w-full min-h-[120px]"
          placeholder={t('sourceAccountPlaceholder')}
          value={accounts}
          onChange={(e) => setAccounts(e.target.value)}
        />
      </div>

      <div className="bg-gray-50 rounded-md p-4 mt-4">
        <h3 className="font-semibold mb-2">{t('duplicateInfo')}</h3>
        {accountList.length === 0 ? (
          <div className="text-gray-400">{t('noData')}</div>
        ) : hasDuplicates ? (
          <>
            <p className="mb-2 font-medium">{t('duplicateStoreNames')}</p>
            <ul className="list-disc list-inside mb-4">
              {Array.from(duplicates.entries()).map(([item, count]) => (
                <li key={item} className="text-red-600">
                  {item} - {t('appearsXTimes', { count })}
                </li>
              ))}
            </ul>
            <div className="text-sm text-gray-500">
              {t('totalDuplicates')}:{' '}
              {Array.from(duplicates.values()).reduce((sum, count) => sum + count - 1, 0)}
            </div>
          </>
        ) : (
          <p className="text-green-600">{t('matched')}</p>
        )}
      </div>
    </div>
  );
}

export default RepatedItem;
