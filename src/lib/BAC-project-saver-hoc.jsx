import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import {
    getIsApplyingProject,
    getIsSavingProject,
    applyProject,
    saveProject,
    doneApplyProject,
    doneSaveProject
} from '../reducers/BAC-project-state';

const BACProjectSaverHOC = function (WrappedComponent) {
    class BACProjectSaverComponent extends React.Component {
        constructor(props) {
            super(props)
            this.projectData = null
            bindAll(this, [
                'applyProjectFromServer',
                'saveProjectToServer'
            ]);
        }
        componentDidUpdate(prevProps) {
            if (this.props.isApplyingProject && !prevProps.isApplyingProject) {
                this.applyProjectFromServer()
            }
            if (this.props.isSavingProject && !prevProps.isSavingProject) {
                this.saveProjectToServer()
            }
        }
        applyProjectFromServer() {
            this.props.doneApplyProject()
        }
        saveProjectToServer() {
            this.props.doneSaveProject()
        }
        render() {
            const {
                prefixURI,
                suffixURI,
                fullURI,
                isApplyingProject,
                isSavingProject,
                applyProject,
                saveProject,
                doneApplyProject,
                doneSaveProject,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    {...componentProps}
                />
            )
        }
    }

    BACProjectSaverComponent.propTypes = {
        prefixURI: PropTypes.string,
        suffixURI: PropTypes.string,
        fullURI: PropTypes.string,
        isApplyingProject: PropTypes.bool,
        isSavingProject: PropTypes.bool,
        applyProject: PropTypes.func,
        saveProject: PropTypes.func,
        doneApplyProject: PropTypes.func,
        doneSaveProject: PropTypes.func,
        vm: PropTypes.shape({
            loadProject: PropTypes.func
        })
    }
    const mapStateToProps = state => ({
        fullURI: state.scratchGui.BACProjectState.projectURI,
        isApplyingProject: getIsApplyingProject(state.scratchGui.BACProjectState.loadingState),
        isSavingProject: getIsSavingProject(state.scratchGui.BACProjectState.loadingState),
        vm: state.scratchGui.vm
    });
    const mapDispatchToProps = dispatch => ({
        applyProject: projectURI => dispatch(applyProject(projectURI)),
        saveProject: projectURI => dispatch(saveProject(projectURI)),
        doneApplyProject: state => dispatch(doneApplyProject(state)),
        doneSaveProject: state => dispatch(doneSaveProject(state))
    });
    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );
    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(BACProjectSaverComponent));
}

export {
    BACProjectSaverHOC as default
};
