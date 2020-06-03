import React from 'react';
import sha256 from 'js-sha256';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import Renderer from 'scratch-render';
import {
    getIsIdleProject,
    getIsSavingProject,
    getIsCreatingProject,
    getIsFetchingProject,
    saveProject,
    doneSaveProject
} from '../reducers/BAC-project-state';

function fetchPUTToServer(params) {
    var myHeaders = new Headers()
    myHeaders.append('Content-Type', params['Content-Type'])
    fetch(params['putURI'], {
      method: 'PUT',
      body: params['body'],
      headers: myHeaders,
    }).then(response => {
        if (response.status === 200) {
        }
    }).catch(error => {})
}

const BACProjectSaverHOC = function (WrappedComponent) {
    class BACProjectSaverComponent extends React.Component {
        constructor(props) {
            super(props)
            this.projectData = null
            this.jsonContent = null
            bindAll(this, [
                'projectJsonProcess',
                'projectImageProcess',
                'projectDataProcess',
                'fetchGETProjectId',
                'fetchPUT',
                'saveProjectToServer'
            ]);
            this.error = false
        }

        componentDidUpdate(prevProps) {
            // they all need error check
            // update json after new project
            if (this.props.isIdleProject && prevProps.isCreatingProject) {
                this.jsonContent = null
            }
            // update json after fetch project
            if (this.props.isIdleProject && prevProps.isFetchingProject) {
                this.jsonContent = this.props.projectJsonContent
            }
            // update json after save project
            if (this.props.isIdleProject && prevProps.isSavingProject) {
                this.jsonContent = this.props.projectJsonContent
            }
            if (this.props.isSavingProject && !prevProps.isSavingProject) {
                this.saveProjectToServer()
            }
        }

        projectJsonProcess(content) {
            return true
        }

        projectImageProcess(content) {
            return true
        }

        projectDataProcess(content) {
            return true
        }

        fetchGETProjectId(projectId){
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')
            fetch(this.props.prefixURI+"?Id="+projectId, {
              method: 'GET',
              headers: myHeaders,
            }).then(response => {
                if (response.status === 200) {
                    var contentType = response.headers.get('Content-Type')
                    if (contentType === 'application/json') {
                        response.json().then(content => {
                            if (projectId === content.get('projectId','')) {
                                return true
                            }
                        }).catch(error => {})
                    }
                }
            }).catch(error => {})
            return false
        }

        fetchPUT(params) {
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', params['Content-Type'])
            fetch(params['putURI'], {
              method: 'PUT',
              body: params['body'],
              headers: myHeaders,
            }).then(response => {
                if (response.status === 200) {
                    var contentType = response.headers.get('Content-Type')
                    if (contentType === 'application/x.scratch.sb3') {
                        response.text().then(content => {
                            this.error = !this.projectDataProcess(content)
                        }).catch(error => {
                            this.error = true
                        })
                    } else if (contentType === 'application/json') {
                        response.json().then(content => {
                            this.error = !this.projectJsonProcess(content)
                        }).catch(error => {
                            this.error = true
                        })
                    } else if (contentType === 'image/png') {
                        response.text().then(content => {
                            this.error = !this.projectImageProcess(content)
                        }).catch(error => {
                            this.error = true
                        })
                    } else {
                        this.error = true
                    }
                } else {
                    this.error = true
                }
            }).catch(error => {
                this.error = true
            })
        }

        saveProjectToServer() {
            if (this.jsonContent && this.jsonContent['projectTitle'] === this.props.projectTitle) {
                this.props.saveProjectSb3().then(content => {
                    this.fetchPUT({'Content-Type':'application/x.scratch.sb3', 'putURI':this.props.prefixURI+"?Id="+this.jsonContent['projectId'], 'body':content})
                }).catch(error => {
                    this.error = true
                })
                this.props.doneSaveProject(true, this.jsonContent)
            } else {
                var applyProjectId = sha256((new Date()).getTime().toString() + Math.random().toString())
                if (this.fetchGETProjectId(applyProjectId)) {
                    console.log("Invalid Apply ProjectId")
                    this.error = true
                } else {
                    // put project json
                    var projectInfo = {
                        'projectTitle': this.props.projectTitle,
                        'timeStamp': (new Date()).getTime().toString(),
                        'projectId': applyProjectId
                    }
                    this.fetchPUT({'Content-Type':'application/json', 'putURI':this.props.prefixURI+"?Id="+applyProjectId, 'body':JSON.stringify(projectInfo)})
                    // put project png
                    var localPrefixURI=this.props.prefixURI
                    function localCallback(dataURI) {
                        // fetchPUTToServer({'Content-Type':'text/plain', 'putURI':localPrefixURI+"?Id="+applyProjectId, 'body':dataURI.replace("data:image/png;base64,", '')})
                        fetchPUTToServer({'Content-Type':'text/plain', 'putURI':localPrefixURI+"?Id="+applyProjectId, 'body':dataURI})
                    }
                    this.props.renderer.requestSnapshot(localCallback)
                    // put project data
                    this.props.saveProjectSb3().then(content => {
                        this.fetchPUT({'Content-Type':'application/x.scratch.sb3', 'putURI':this.props.prefixURI+"?Id="+applyProjectId, 'body':content})
                    }).catch(error => {
                        this.error = true
                    })
                    this.props.doneSaveProject(true, projectInfo)
                }
            }
        }

        render() {
            const {
                prefixURI,
                suffixURI,
                isIdleProject,
                isCreatingProject,
                isFetchingProject,
                isSavingProject,
                projectJsonContent,
                saveJSON,
                saveICON,
                saveProject,
                doneSaveProject,
                saveProjectSb3,
                projectTitle,
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
        isIdleProject: PropTypes.bool,
        isCreatingProject: PropTypes.bool,
        isFetchingProject: PropTypes.bool,
        isSavingProject: PropTypes.bool,
        saveJSON: PropTypes.func,
        saveICON: PropTypes.func,
        saveProject: PropTypes.func,
        doneSaveProject: PropTypes.func,
        projectJsonContent: PropTypes.object,
        vm: PropTypes.shape({
            loadProject: PropTypes.func
        }),
        saveProjectSb3: PropTypes.func,
        renderer: PropTypes.instanceOf(Renderer),
        projectTitle: PropTypes.string,
    }
    const mapStateToProps = state => ({
        isIdleProject: getIsIdleProject(state.scratchGui.BACProjectState.loadingState),
        isCreatingProject: getIsCreatingProject(state.scratchGui.BACProjectState.loadingState),
        isFetchingProject: getIsFetchingProject(state.scratchGui.BACProjectState.loadingState),
        isSavingProject: getIsSavingProject(state.scratchGui.BACProjectState.loadingState),
        projectJsonContent: state.scratchGui.BACProjectState.projectJsonContent,
        vm: state.scratchGui.vm,
        saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
        renderer:state.scratchGui.vm.renderer,
        projectTitle: state.scratchGui.projectTitle,
    });
    const mapDispatchToProps = dispatch => ({
        saveProject: () => dispatch(saveProject()),
        doneSaveProject: (state, projectJsonContent) => dispatch(doneSaveProject(state, projectJsonContent)),
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
