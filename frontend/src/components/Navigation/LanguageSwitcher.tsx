import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
];

interface LanguageSwitcherProps {
    position?: 'up' | 'down';
    className?: string;
    variant?: 'light' | 'dark' | 'transparent';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    position = 'down',
    className = '',
    variant = 'transparent'
}) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const changeLanguage = (lngCode: string) => {
        i18n.changeLanguage(lngCode);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    const getVariantStyles = () => {
        switch (variant) {
            case 'light': return 'bg-[var(--color-parchment)] text-[var(--color-burnt-umber)] border border-[var(--color-muted-gold)] hover:bg-[var(--color-bg-light)]';
            case 'dark': return 'bg-transparent text-[#F5EDD8] border border-[rgba(245,237,216,0.3)] hover:bg-[rgba(10,6,3,0.5)]';
            case 'transparent': return 'bg-transparent text-[var(--color-text-main)] hover:bg-[var(--color-parchment)] hover:text-[var(--color-burnt-umber)]';
            default: return '';
        }
    };

    const getDropdownVariantStyles = () => {
        return 'bg-[var(--color-parchment)] border border-[var(--color-muted-gold)] text-[var(--color-text-main)] shadow-xl';
    };

    return (
        <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[var(--color-muted-gold)] ${getVariantStyles()}`}
                aria-expanded={isOpen}
                aria-haspopup="true"
                style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}
            >
                <FiGlobe className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>{currentLang.label}</span>
                <span className="ml-2 text-xs opacity-70">▼</span>
            </button>

            {isOpen && (
                <div
                    className={`absolute z-50 w-56 rounded-md ${getDropdownVariantStyles()} ring-1 ring-black ring-opacity-5 focus:outline-none ${position === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="language-menu-button"
                    style={{
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        overflow: 'hidden'
                    }}
                >
                    <div className="py-1 max-h-80 overflow-y-auto" role="none" style={{ backgroundColor: 'var(--color-parchment)' }}>
                        {LANGUAGES.map((lang) => {
                            const isActive = i18n.language === lang.code;
                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`block w-full text-left px-4 py-3 text-sm transition-colors decoration-0 
                                    ${isActive
                                            ? 'bg-[var(--color-bg-light)] text-[var(--color-burnt-umber)] font-bold border-l-4 border-[var(--color-terracotta)]'
                                            : 'text-[var(--color-text-main)] hover:bg-[var(--color-bg-light)] hover:text-[var(--color-burnt-umber)] border-l-4 border-transparent'
                                        }`}
                                    role="menuitem"
                                    style={{
                                        fontFamily: 'var(--font-sans)',
                                        borderBottom: '1px solid rgba(176,141,87,0.1)'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{lang.label}</span>
                                        {isActive && <span className="text-[var(--color-terracotta)]">✓</span>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
