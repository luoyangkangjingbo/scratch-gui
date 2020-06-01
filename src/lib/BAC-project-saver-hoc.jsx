import React from 'react';
import sha256 from 'js-sha256';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import Renderer from 'scratch-render';
import {
    getIsSavingProject,
    saveProject,
    doneSaveProject
} from '../reducers/BAC-project-state';

const BACProjectSaverHOC = function (WrappedComponent) {
    class BACProjectSaverComponent extends React.Component {
        constructor(props) {
            super(props)
            this.projectData = null
            bindAll(this, [
                'projectJsonProcess',
                'projectImageProcess',
                'projectDataProcess',
                'fetchPUT',
                'saveProjectToServer'
            ]);
            this.error = false
        }

        componentDidUpdate(prevProps) {
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
            if (this.props.needSaveProjectJson) {
                var projectBody = {
                    'filename': '',
                    'timeStamp': (new Date()).getTime().toString(),
                    'projectId': sha256((new Date()).getTime().toString() + Math.random().toString())
                }
                this.fetchPUT({'Content-Type':'application/json', 'putURI':this.props.prefixURI, 'body':projectBody})
                if (this.error) {}
            }
            if (this.props.needSaveProjectImage) {
                function localCallback(dataURI) {
                    this.fetchPUT({'Content-Type':'image/png', 'putURI':this.props.prefixURI, 'body':dataURI})
                    if (this.error) {}
                }
                this.props.renderer.requestSnapshot(localCallback)
            }
            if (this.props.needSaveProjectData) {
                this.props.saveProjectSb3().then(content => {
                    this.fetchPUT({'Content-Type':'application/x.scratch.sb3', 'putURI':this.props.prefixURI, 'body':content})
                }).catch(error => {
                    this.error = true
                })
                if (this.error) {}
            }
            this.props.doneSaveProject(true)
        }

        render() {
            const {
                prefixURI,
                suffixURI,
                needSaveProjectJson,
                needSaveProjectImage,
                needSaveProjectData,
                isSavingProject,
                saveJSON,
                saveICON,
                saveProject,
                doneSaveProject,
                saveProjectSb3,
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
        needSaveProjectJson: PropTypes.bool,
        needSaveProjectImage: PropTypes.bool,
        needSaveProjectData: PropTypes.bool,
        isSavingProject: PropTypes.bool,
        saveJSON: PropTypes.func,
        saveICON: PropTypes.func,
        saveProject: PropTypes.func,
        doneSaveProject: PropTypes.func,
        vm: PropTypes.shape({
            loadProject: PropTypes.func
        }),
        saveProjectSb3: PropTypes.func,
        renderer: PropTypes.instanceOf(Renderer)
    }
    const mapStateToProps = state => ({
        needSaveProjectJson: state.scratchGui.BACProjectState.projectJson,
        needSaveProjectImage: state.scratchGui.BACProjectState.projectImage,
        needSaveProjectData: state.scratchGui.BACProjectState.projectData,
        isSavingProject: getIsSavingProject(state.scratchGui.BACProjectState.loadingState),
        vm: state.scratchGui.vm,
        saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
        renderer:state.scratchGui.vm.renderer
    });
    const mapDispatchToProps = dispatch => ({
        saveProject: (projectJson, projectImage, projectData, projectURI) => dispatch(saveProject(projectJson, projectImage, projectData, projectURI)),
        doneSaveProject: state => dispatch(doneSaveProject(state)),
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
