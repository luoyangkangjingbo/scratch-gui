import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import styles from './custom-files.css';

class CustomeLoadFileToCloud extends React.PureComponent {
    constructor() {
        super()
        this.FilenameHandler = this.FilenameHandler.bind(this)
        this.FilepathHandler = this.FilepathHandler.bind(this)
        this.CancelHandler   = this.CancelHandler.bind(this)
        this.ConfirmHandler  = this.ConfirmHandler.bind(this)
    }

    FilenameHandler() {
        // TODO: file name handler
        if (this.props.onRequestFilename) {
            this.props.onRequestFilename()
        }
    }

    FilepathHandler() {
        // TDOD: file path handler
        if (this.props.onRequestFilepath) {
            this.props.onRequestFilepath()
        }
        return ('Cloud File Path')
    }

    FiledateHandler() {
        // TODO: file data handler
        if (this.props.onRequestFiledate) {
            this.props.onRequestFiledate()
        }
    }

    CancelHandler() {
        // TODO: cancel handler
        this.props.onRequestClose()
    }

    ConfirmHandler() {
        // TODO: confirm handler
        var ret = confirm("是否选择继续?")
        if (ret) {
            this.props.onRequestClose()
            console.log("继续")
        } else {
            console.log("放弃")
        }
    }

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
                                    onInput={this.FilenameHandler}
                                />
                            </div>
                            <div className={styles.fileLine}>
                                <div>文件路径</div>
                                <input type="text"
                                    value={this.FilepathHandler()}
                                />
                            </div>
                        </Box>
                        <Box className={styles.buttonRow}>
                            <button
                                className={styles.optOut}
                                onClick={this.CancelHandler}
                            >
                                <p>Cancel</p>
                            </button>
                            <button
                                className={styles.optIn}
                                onClick={this.ConfirmHandler}
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
    onRequestFilename: PropTypes.func,
    onRequestFilepath: PropTypes.func,
    onRequestClose: PropTypes.func.isRequired
};

export default injectIntl(CustomeLoadFileToCloud);
