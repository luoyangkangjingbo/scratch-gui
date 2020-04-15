import React from 'react';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import CustomeLoadFileFromCloud  from '../components/custom-files/custom-load-file-from-cloud.jsx';
import CustomeLoadFileToComputer from '../components/custom-files/custom-load-file-to-computer.jsx';
import CustomeLoadFileToCloud    from '../components/custom-files/custom-load-file-to-cloud.jsx';

class CustomFiles extends React.Component {
    constructor() {
        super()
        bindAll(this, [
            // load file from cloud registe
            'fileFromCloudNameHandler',
            'fileFromCloudPathHandler',
            'fileFromCloudDateHandler',
            'fileFromCloudCancelHandler',
            'fileFromCloudConfirmHandler',
            // load file to computer registe
            'fileToComputerNameHandler',
            'fileToComputerPathHandler',
            'fileToComputerCancelHandler',
            'fileToComputerConfirmHandler',
            // load file to cloud registe
            'fileToCloudNameHandler',
            'fileToCloudPathHandler',
            'fileToCloudCancelHandler',
            'fileToCloudConfirmHandler'
        ]);
    }

    // load file from cloud handlers
    fileFromCloudNameHandler() {

    }

    fileFromCloudPathHandler() {
        return (
            'fileFromCloudPathHandler'
        )
    }

    fileFromCloudDateHandler() {

    }

    fileFromCloudCancelHandler() {

    }

    fileFromCloudConfirmHandler() {
        var ret = confirm("是否选择继续?")
        if (ret) {
            this.props.onRequestClose()
            console.log("继续")
        } else {
            console.log("放弃")
        }
    }

    // load file to computer handler
    fileToComputerNameHandler() {

    }

    fileToComputerPathHandler() {
        return (
            'fileToComputerPathHandler'
        )
    }

    fileToComputerCancelHandler() {

    }

    fileToComputerConfirmHandler() {

    }

    // load file to cloud handler
    fileToCloudNameHandler() {

    }

    fileToCloudPathHandler() {
        return (
            'fileToCloudPathHandler'
        )
    }

    fileToCloudCancelHandler() {

    }

    fileToCloudConfirmHandler() {

    }

    render() {
        const {
            userOperation,
            onRequestClose,
            ...componentProps
        } = this.props

        switch(this.props.userOperation) {
        case 'LoadFileFromCloud':
            return (
                <CustomeLoadFileFromCloud
                    onRequestFilename    = {this.fileFromCloudNameHandler}
                    onRequestFilepath    = {this.fileFromCloudPathHandler}
                    onRequestFiledate    = {this.fileFromCloudDateHandler}
                    onRequestFileCancel  = {this.fileFromCloudCancelHandler}
                    onRequestFileConfirm = {this.fileFromCloudConfirmHandler}
                    {...componentProps}
                />
            )
        case 'LoadFileToComputer':
            return (
                <CustomeLoadFileToComputer
                    onRequestFilename    = {this.fileToComputerNameHandler}
                    onRequestFilepath    = {this.fileToComputerPathHandler}
                    onRequestFileCancel  = {this.fileToComputerCancelHandler}
                    onRequestFileConfirm = {this.fileToComputerConfirmHandler}
                    {...componentProps}
                />
            )
        case 'LoadFileToCloud':
            return (
                <CustomeLoadFileToCloud
                    onRequestFilename    = {this.fileToCloudNameHandler}
                    onRequestFilepath    = {this.fileToCloudPathHandler}
                    onRequestFileCancel  = {this.fileToCloudCancelHandler}
                    onRequestFileConfirm = {this.fileToCloudConfirmHandler}
                    {...componentProps}
                />
            )
        default:
            return (
                null
            )
        }
    }
}

const mapStateToProps = state => {
    const loadingState = state.scratchGui.customFiles;
    return {
        fileOperation: loadingState.operation,
        fileName: loadingState.name,
        filePath: loadingState.path
    };
};

const mapDispatchToProps = dispatch => ({
    setCustomLoadFileFromCloud: (name, path) => dispatch(setCustomLoadFileFromCloud(name, path)),
    setCustomLoadFileToComputer: (name, path) => dispatch(setCustomLoadFileToComputer(name, path)),
    setCustomLoadFileToCloud: (name, path) => dispatch(setCustomLoadFileToCloud(name, path))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps,
)(CustomFiles));
