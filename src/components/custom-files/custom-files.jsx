import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import ReactModal from 'react-modal';

import Box from '../box/box.jsx';

import styles from './custom-files.css';


class CustomeFiles extends React.PureComponent {
    constructor() {
        super()
        this.LoadFromCloud = this.LoadFromCloud.bind(this)
        this.SaveToComputer = this.SaveToComputer.bind(this)
        this.SaveToCloud = this.SaveToCloud.bind(this)
    }

    handleOptOut() {

    }

    handleOptIn() {

    }

    LoadFromCloud() {
        return (
            <ReactModal
                isOpen
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
                onRequestClose={this.handleCancel}
            >
                <div dir={this.props.isRtl ? 'rtl' : 'ltr'} >
                    <Box className={styles.body}>
                        <Box className={styles.fileInfo}>
                            <div className={styles.fileLine}>
                                <div>文件名称</div>
                                <input type="text"  />
                            </div>
                            <div className={styles.fileLine}>
                                <div>文件路径</div>
                                <input type="text" value="C:\Users\86182\Downloads" />
                            </div>
                            <div className={styles.fileLine}>
                                <div>文件日期</div>
                                <input type="datetime-local" />
                            </div>
                        </Box>
                        <Box className={styles.buttonRow}>
                            <button
                                className={styles.optOut}
                                onClick={this.handleOptOut}
                            >
                                <p>Cancel</p>
                            </button>
                            <button
                                className={styles.optIn}
                                onClick={this.handleOptIn}
                            >
                                <p>Select</p>
                            </button>
                        </Box>
                    </Box>
                </div>
            </ReactModal>
        )
    }

    SaveToComputer() {
        return (
            <ReactModal
                isOpen
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
                onRequestClose={this.handleCancel}
            >
                <div dir={this.props.isRtl ? 'rtl' : 'ltr'} >
                    <Box className={styles.body}>
                        <Box className={styles.fileInfo}>
                            <div className={styles.fileLine}>
                                <div >文件名称</div>
                                <input type="text"  />
                            </div>
                            <div className={styles.fileLine}>
                                <div>文件路径</div>
                                <input type="text" value="C:\Users\86182\Downloads" />
                            </div>
                        </Box>
                        <Box className={styles.buttonRow}>
                            <button
                                className={styles.optOut}
                                onClick={this.handleOptOut}
                            >
                                <p>Cancel</p>
                            </button>
                            <button
                                className={styles.optIn}
                                onClick={this.handleOptIn}
                            >
                                <p>Select</p>
                            </button>
                        </Box>
                    </Box>
                </div>
            </ReactModal>
        )
    }

    SaveToCloud() {
        return (
            <ReactModal
                isOpen
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
                onRequestClose={this.handleCancel}
            >
                <div dir={this.props.isRtl ? 'rtl' : 'ltr'} >
                    <Box className={styles.body}>
                        <Box className={styles.fileInfo}>
                            <div className={styles.fileLine}>
                                <div>文件名称</div>
                                <input type="text"  />
                            </div>
                            <div className={styles.fileLine}>
                                <div>文件路径</div>
                                <input type="text" value="C:\Users\86182\Downloads" />
                            </div>
                        </Box>
                        <Box className={styles.buttonRow}>
                            <button
                                className={styles.optOut}
                                onClick={this.handleOptOut}
                            >
                                <p>Cancel</p>
                            </button>
                            <button
                                className={styles.optIn}
                                onClick={this.handleOptIn}
                            >
                                <p>Select</p>
                            </button>
                        </Box>
                    </Box>
                </div>
            </ReactModal>
        )
    }

    render() {
        return (
            <this.SaveToCloud />
        )
    }
}

export default injectIntl(CustomeFiles);
