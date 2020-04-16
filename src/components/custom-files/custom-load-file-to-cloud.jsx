import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import styles from './custom-files.css';

class CustomeLoadFileToCloud extends React.PureComponent {
    render() {
        return(
            <ReactModal
                isOpen
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
                onRequestClose={null}
            >
                <div dir={this.props.isRtl ? 'rtl' : 'ltr'} >
                    <Box className={styles.body}>
                        <Box className={styles.fileInfo}>
                            <div className={styles.fileLine}>
                                <div>文件名称</div>
                                <input type="text"
                                    onInput={this.props.onRequestFilename}
                                />
                            </div>
                            <div className={styles.fileLine}>
                                <div>文件路径</div>
                                <input type="text"
                                    defaultValue={this.props.onRequestFilepath()}
                                    disabled
                                />
                            </div>
                        </Box>
                        <Box className={styles.buttonRow}>
                            <button
                                className={styles.optOut}
                                onClick={this.props.onRequestFileCancel}
                            >
                                <p>Cancel</p>
                            </button>
                            <button
                                className={styles.optIn}
                                onClick={this.props.onRequestFileConfirm}
                            >
                                <p>Confirm</p>
                            </button>
                        </Box>
                    </Box>
                </div>
            </ReactModal>
        )
    }
}

CustomeLoadFileToCloud.propTypes = {
    onRequestFilename: PropTypes.func.isRequired,
    onRequestFilepath: PropTypes.func.isRequired,
    onRequestFileCancel : PropTypes.func.isRequired,
    onRequestFileConfirm: PropTypes.func.isRequired,
};

export default injectIntl(CustomeLoadFileToCloud);
