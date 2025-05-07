import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Header
      accountComparisonTool: 'Account Comparison Tool',

      // Editor Labels
      currentlyLoggedAccounts: 'Currently Logged-in Accounts',
      wishedLoginAccounts: 'Wished Login Accounts',

      // Buttons
      compare: 'Compare',
      showDebug: 'Show Debug Info',
      hide: 'Hide',

      // Stats and Results
      matched: 'Matched',

      // Duplicates
      duplicateStoreNames: 'Duplicate Store Names:',
      inLoggedAccounts: 'In Logged-in Accounts:',
      inWishedAccounts: 'In Wished Login Accounts:',
      appearsXTimes: 'appears {{count}} times',

      // Debug Info
      debugInformation: 'Debug Information:',
      leftNames: 'Left Names',
      rightNames: 'Right Names',
      matchedNames: 'Matched Names',

      // Instructions
      instructions: 'Instructions:',
      leftFormat: 'Left Format:',
      rightFormat: 'Right Format:',
      redHighlightsIndicate: 'Red highlights indicate matching accounts in both lists',
      unhighlightedEntries: 'Un-highlighted entries in either editor need attention',
      duplicateStoreNamesWill: 'Duplicate store names will be shown in the warning section',
      useDebugButton: 'Use the debug button to see detailed matching information',

      // 2.1.1 General UI elements
      title: 'Account Comparison Tool',
      switchLanguage: 'Switch Language',

      // 2.1.2 Duplicate info section
      duplicateInfo: 'Duplicate Information',
      duplicateStores: 'Stores with duplicate names:',
      totalDuplicates: 'Total duplicates:',

      // 2.1.3 Debug section
      debugInfo: 'Debug Information',
      rawData: 'Raw Data:',
      showRawData: 'Show Raw Data',
      hideRawData: 'Hide Raw Data',

      // 2.1.4 Editor placeholders
      sourceAccountPlaceholder: 'Paste source account data here...',
      targetAccountPlaceholder: 'Paste target account data here...',

      // 2.1.5 Instructions
      step1: '1. Paste the source account data into the left editor.',
      step2: '2. Paste the target account data into the right editor.',
      step3: '3. The tool will automatically analyze for duplicates.',
      step4: '4. Review the duplicate information section for results.',

      // 2.1.6 Comparison results
      compareResults: 'Comparison Results',
      noData: 'No data available for comparison.',
      missedAccounts: 'Missed Accounts',
      extraAccounts: 'Extra Accounts',
    },
  },
  zh: {
    translation: {
      // Header
      accountComparisonTool: '账户比较工具',

      // Editor Labels
      currentlyLoggedAccounts: '当前已登录账户',
      wishedLoginAccounts: '期望登录账户',

      // Buttons
      compare: '比较',
      showDebug: '显示调试信息',
      hide: '隐藏',

      // Stats and Results
      matched: '已匹配',

      // Duplicates
      duplicateStoreNames: '重复的店铺名称：',
      inLoggedAccounts: '在已登录账户中：',
      inWishedAccounts: '在期望登录账户中：',
      appearsXTimes: '出现 {{count}} 次',

      // Debug Info
      debugInformation: '调试信息：',
      leftNames: '左侧名称',
      rightNames: '右侧名称',
      matchedNames: '匹配的名称',

      // Instructions
      instructions: '使用说明：',
      leftFormat: '左侧格式：',
      rightFormat: '右侧格式：',
      redHighlightsIndicate: '红色高亮表示两个列表中匹配的账户',
      unhighlightedEntries: '未高亮的条目需要注意',
      duplicateStoreNamesWill: '重复的店铺名称将显示在警告部分',
      useDebugButton: '使用调试按钮查看详细匹配信息',

      // 2.1.1 General UI elements
      title: '账户比较工具',
      switchLanguage: '切换语言',

      // 2.1.2 Duplicate info section
      duplicateInfo: '重复信息',
      duplicateStores: '名称重复的商店:',
      totalDuplicates: '总重复数:',

      // 2.1.3 Debug section
      debugInfo: '调试信息',
      rawData: '原始数据:',
      showRawData: '显示原始数据',
      hideRawData: '隐藏原始数据',

      // 2.1.4 Editor placeholders
      sourceAccountPlaceholder: '在此粘贴源账户数据...',
      targetAccountPlaceholder: '在此粘贴目标账户数据...',

      // 2.1.5 Instructions
      step1: '1. 将源账户数据粘贴到左侧编辑器。',
      step2: '2. 将目标账户数据粘贴到右侧编辑器。',
      step3: '3. 该工具将自动分析重复项。',
      step4: '4. 查看重复信息部分获取结果。',

      // 2.1.6 Comparison results
      compareResults: '比较结果',
      noData: '没有可比较的数据。',
      missedAccounts: '缺失的账户',
      extraAccounts: '多余的账户',
    },
  },
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'zh', // Chinese as fallback
    lng: 'zh', // Default language is Chinese
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
