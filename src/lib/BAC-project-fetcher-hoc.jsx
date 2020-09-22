import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';

import {
    LoadingStates,
    getIsLoadingUpload,
    defaultProjectId,
    onLoadedProject,
    setProjectId,
    requestProjectUpload,
} from '../reducers/project-state';
import {setProjectTitle} from '../reducers/project-title';

import {
    getIsGettingProject,
    getProject     as getBACProject,
    doneGetProject as doneGetBACProject,
    setProjectId   as setBACProjectId,
} from '../reducers/BAC-project-state';

const BACProjectFetcherHOC = function (WrappedComponent) {
    class BACProjectFetcherComponent extends React.Component {
        constructor(props) {
            super(props);
            this.projectData = null
            bindAll(this, [
                'loadIntoVM',
                'getProjectFromServer',
                'getProjectFromArrayBuffer',
            ]);
        }

        componentDidMount() {
            if (this.props.projectId === 0 || this.props.projectId === null
                || this.props.projectId === '' || (typeof this.props.projectId === 'undefined') || this.props.projectId === defaultProjectId) {
                this.props.setProjectId(defaultProjectId.toString())
                this.props.setBACProjectId(null)
            } else {
                this.props.getBACProject(this.props.projectId)
            }
        }

        componentDidUpdate(prevProps) {
            if (this.props.isGettingProject && !prevProps.isGettingProject) {
                var requestData = this.props.BACGetHandler(this.props.projectId)
                if (typeof requestData === 'string') {
                    this.getProjectFromServer(requestData)
                } else {
                    // 唯一使用场景：用户上传Scratch文件抓取图片，不会往服务器保存，如果保存代码需要进一步优化
                    this.getProjectFromArrayBuffer(requestData)
                }
            }
            if (this.projectData && this.props.isLoadingUpload && !prevProps.isLoadingUpload) {
                this.loadIntoVM(this.projectData)
                this.projectData = null
            }
        }

        loadIntoVM(projectData) {
            if (projectData) {
                this.props.vm.loadProject(projectData)
                    .then(() => {
                        this.props.onLoadingFinished(this.props.loadingState, true)
                        this.props.onReceivedProjectTitle(this.props.projectId)
                        if (this.props.BACGetSnapshot) {
                            this.props.vm.start()
                            this.props.vm.renderer.requestSnapshot(this.props.BACGetSnapshot)
                        }
                    })
                    .catch(error => {
                        this.props.onLoadingFinished(this.props.loadingState, false)
                    })
            }
        }

        getProjectFromServer(requestData) {
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/x.scratch.sb3')
            fetch(requestData, { method: 'GET', headers: myHeaders})
                .then(response=>response.arrayBuffer()).then(response=>{
                    this.getProjectFromArrayBuffer(response)
                    this.props.doneGetBACProject()
                }).catch(error=>{
                    this.props.doneGetBACProject(error)
                    this.projectData = null
                    this.props.doneGetBACProject()
                })
        }

        getProjectFromArrayBuffer(requestData) {
            this.projectData = requestData
            this.props.requestProjectUpload(this.props.loadingState)
        }

        render() {
            const {
                projectId,
                BACGetHandler,
                BACGetSnapshot,
                isGettingProject,
                isLoadingUpload,
                getBACProject,
                doneGetBACProject,
                setProjectId,
                setBACProjectId,
                requestProjectUpload,
                onLoadingFinished,
                onReceivedProjectTitle,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    {...componentProps}
                />
            )
        }
    };
    BACProjectFetcherComponent.PropTypes = {
        isGettingProject: PropTypes.bool,
        vm: PropTypes.shape({
            loadProject: PropTypes.func
        }),
        loadingState: PropTypes.oneOf(LoadingStates),
        isLoadingUpload: PropTypes.bool,
        getProject: PropTypes.func,
        doneGetProject: PropTypes.func,
        setProjectId: PropTypes.func,
        setBACProjectId: PropTypes.func,
        requestProjectUpload: PropTypes.func,
        onLoadingFinished: PropTypes.func,
        onReceivedProjectTitle: PropTypes.func,
    }
    const mapStateToProps = state => ({
        isGettingProject : getIsGettingProject(state.scratchGui.BACProjectState.loadingState),
        vm               : state.scratchGui.vm,
        loadingState     : state.scratchGui.projectState.loadingState,
        isLoadingUpload  : getIsLoadingUpload(state.scratchGui.projectState.loadingState),
    });
    const mapDispatchToProps = dispatch => ({
        getBACProject : (projectId) => dispatch(getBACProject(projectId)),
        doneGetBACProject: (state) => dispatch(doneGetBACProject(state)),
        setProjectId: (projectId) => dispatch(setProjectId(projectId)),
        setBACProjectId: (projectId) => dispatch(setBACProjectId(projectId)),
        requestProjectUpload: loadingState => dispatch(requestProjectUpload(loadingState)),
        onLoadingFinished: (loadingState, success) => dispatch(onLoadedProject(loadingState, false, success)),
        onReceivedProjectTitle: title => dispatch(setProjectTitle(title)),
    });
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );
    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(BACProjectFetcherComponent));
};

export {
    BACProjectFetcherHOC as default
};