import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <span>{t('switchLanguage')}: </span>
      <button
        onClick={() => changeLanguage('zh')}
        className={i18n.language === 'zh' ? 'active' : ''}
        style={{
          fontWeight: i18n.language === 'zh' ? 'bold' : 'normal',
          marginRight: '8px',
          padding: '5px 10px',
          cursor: 'pointer',
          border: i18n.language === 'zh' ? '2px solid #1890ff' : '1px solid #d9d9d9',
          borderRadius: '4px',
          backgroundColor: i18n.language === 'zh' ? '#e6f7ff' : 'white',
        }}
      >
        中文
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'active' : ''}
        style={{
          fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
          padding: '5px 10px',
          cursor: 'pointer',
          border: i18n.language === 'en' ? '2px solid #1890ff' : '1px solid #d9d9d9',
          borderRadius: '4px',
          backgroundColor: i18n.language === 'en' ? '#e6f7ff' : 'white',
        }}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;
