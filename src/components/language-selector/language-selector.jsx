import PropTypes from 'prop-types';
import React from 'react';

import locales from 'scratch-l10n';
import styles from './language-selector.css';
import { MenuItem, MenuSection } from '../menu/menu.jsx';

// supported languages to exclude from the menu, but allow as a URL option
const LanguageSelected = ['zh-cn','en'];

const LanguageSelector = ({currentLocale, onChange}) => (
    <MenuSection>
        {
            Object.keys(locales)
                .filter(l => LanguageSelected.includes(l))
                .map(locale => (
                    <MenuItem
                        key={locale}
                        onClick={()=>{onChange(locale)}}
                    >
                        {locales[locale].name}
                    </MenuItem>
                ))
        }
    </MenuSection>
);

LanguageSelector.propTypes = {
    currentLocale: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func
};

export default LanguageSelector;
