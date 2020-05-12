// Polyfills
import 'es6-object-assign/auto';
import 'core-js/fn/array/includes';
import 'core-js/fn/promise/finally';
import 'intl'; // For Safari 9

import React from 'react';
import ReactDOM from 'react-dom';

import analytics from '../lib/analytics';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import BrowserModalComponent from '../components/browser-modal/browser-modal.jsx';
import supportedBrowser from '../lib/supported-browser';

import styles from './index.css';

// Register "base" page view
analytics.pageview('/');

function isPC() {
    var clientInfo = navigator.userAgent
    // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36
    if (clientInfo.indexOf('(Windows') !== -1) {
        return true
    } else {
        return false
    }
}

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);
if ((!isPC())  && (document.body.clientWidth < 1024)) {
    appTarget.style.width = '1024px';
    appTarget.style.height = '640px';
    var widthScale  = document.body.clientWidth / 1024
    var heightScale = document.body.clientHeight / 640
    appTarget.style.transform = `scale(${widthScale}, ${heightScale})`
    appTarget.style.webkitTransform = `scale(${widthScale}, ${heightScale})`
} else {
    appTarget.style.minWidth  = '1024px'
    appTarget.style.minHeight = '640px'
}

if (supportedBrowser()) {
    // require needed here to avoid importing unsupported browser-crashing code
    // at the top level
    require('./render-gui.jsx').default(appTarget);

} else {
    BrowserModalComponent.setAppElement(appTarget);
    const WrappedBrowserModalComponent = AppStateHOC(BrowserModalComponent, true /* localesOnly */);
    const handleBack = () => {};
    // eslint-disable-next-line react/jsx-no-bind
    ReactDOM.render(<WrappedBrowserModalComponent onBack={handleBack} />, appTarget);
}
