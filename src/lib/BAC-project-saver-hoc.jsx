import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import Renderer from 'scratch-render';

import {
    getIsUpdatingProject,
    getIsUploadingProject,
    doneUpdateProject,
    doneUploadProject,
    setProjectId as setBACProjectId,
} from '../reducers/BAC-project-state';

const BACProjectSaverHOC = function (WrappedComponent) {
    class BACProjectSaverComponent extends React.Component {
        constructor(props) {
            super(props)
            bindAll(this, [
                'getProjectTitle',
                'updateProject',
                'uploadProject',
            ]);
        }

        componentDidUpdate(prevProps) {
            if (this.props.isUpdatingProject && !prevProps.isUpdatingProject) {
                this.updateProject()
            }
            if (this.props.isUploadingProject && !prevProps.isUploadingProject) {
                this.uploadProject()
            }
        }

        getProjectTitle(curTitle, defaultTitle) {
            var projectTitle = curTitle
            if (!projectTitle || projectTitle.length === 0) {
                projectTitle = defaultTitle
            }
            return projectTitle.substring(0,64)
        }

        updateProject() {
            this.props.saveProjectSb3().then(content => {
                var projectId = this.getProjectTitle(this.props.projectTitle,'Scratch作品')
                this.props.BACUpdateHandler(projectId, content)
            })
            this.props.doneUpdateProject()
        }

        uploadProject() {
            this.props.saveProjectSb3().then(content => {
                var projectId = this.getProjectTitle(this.props.projectTitle,'Scratch作品')
                if (this.props.BACGetSnapshot) {
                    this.props.vm.renderer.requestSnapshot(this.props.BACGetSnapshot)
                }
                this.props.BACUploadHandler(projectId, content)
                this.props.setBACProjectId(projectId)
            })
            this.props.doneUploadProject()
        }

        render() {
            const {
                BACUpdateHandler,
                BACUploadHandler,
                BACGetSnapshot,
                isUpdatingProject,
                isUploadingProject,
                projectTitle,
                saveProjectSb3,
                setBACProjectId,
                doneUpdateProject,
                doneUploadProject,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    BACGetSnapshot={BACGetSnapshot?BACGetSnapshot:null}
                    {...componentProps}
                />
            )
        }
    }

    BACProjectSaverComponent.propTypes = {
        vm: PropTypes.shape({
            loadProject: PropTypes.func
        }),
        saveProjectSb3: PropTypes.func,
        isUpdatingProject: PropTypes.bool,
        isUploadingProject: PropTypes.bool,
        setBACProjectId: PropTypes.func,
        doneUpdateProject: PropTypes.func,
        doneUploadProject: PropTypes.func,
    }

    const mapStateToProps = state => ({
        vm               : state.scratchGui.vm,
        saveProjectSb3   : state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
        projectTitle     : state.scratchGui.projectTitle,
        isUpdatingProject: getIsUpdatingProject(state.scratchGui.BACProjectState.loadingState),
        isUploadingProject: getIsUploadingProject(state.scratchGui.BACProjectState.loadingState),
    });

    const mapDispatchToProps = dispatch => ({
        setBACProjectId  : (projectId) => dispatch(setBACProjectId(projectId)),
        doneUpdateProject: (state) => dispatch(doneUpdateProject(state)),
        doneUploadProject: (state) => dispatch(doneUploadProject(state)),
    });

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