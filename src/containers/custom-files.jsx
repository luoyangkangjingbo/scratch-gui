import React from 'react';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import downloadBlob from '../lib/download-blob';
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
    fileFromCloudNameHandler(e) {
        this.projectFileName = e.target.value
    }

    fileFromCloudPathHandler() {
        return (
            ''
        )
    }

    fileFromCloudDateHandler() {

    }

    fileFromCloudCancelHandler() {
        this.props.onRequestClose()
    }

    fileFromCloudConfirmHandler() {
        this.props.onRequestClose()
        // var ret = confirm("是否选择继续?")
        // if (ret) {
        //     console.log("继续")
        // } else {
        //     console.log("放弃")
        // }
    }

    // load file to computer handler
    fileToComputerNameHandler(e) {
        this.projectFileName=e.target.value
    }

    fileToComputerPathHandler() {
        return (
            ''
        )
    }

    fileToComputerCancelHandler() {
        this.props.onRequestClose()
    }

    fileToComputerConfirmHandler() {
        // download file here
        this.props.saveProjectSb3().then( content => {
            downloadBlob(this.projectFileName.toString()+'.sb3', content)
        })
        this.props.onRequestClose()
    }

    // load file to cloud handler
    fileToCloudNameHandler(e) {
        this.projectFileName = e.target.value
    }

    fileToCloudPathHandler() {
        return (
            ''
        )
    }

    fileToCloudCancelHandler() {
        this.props.onRequestClose()
    }

    fileToCloudConfirmHandler() {
        // check if try to reload them
        this.props.onRequestClose()
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
        filePath: loadingState.path,
        saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
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
