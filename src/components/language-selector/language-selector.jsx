import PropTypes from 'prop-types';
import React from 'react';

import locales from 'scratch-l10n';
import styles from './language-selector.css';
import { MenuItem, MenuSection } from '../menu/menu.jsx';

const LanguageSupport = ['zh-cn','en']

const LanguageSelector = ({currentLocale, onChange}) => (
    <MenuSection>
        {
            Object.keys(locales)
                .filter(key => LanguageSupport.includes(key))
                .map((locale, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => onChange(locale)}
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
