import React from 'react';
import sha256 from 'js-sha256';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import {
    getIsSavingJSON,
    getIsSavingICON,
    getIsSavingProject,
    saveJSON,
    saveICON,
    saveProject,
    doneSaveProject
} from '../reducers/BAC-project-state';

const BACProjectSaverHOC = function (WrappedComponent) {
    class BACProjectSaverComponent extends React.Component {
        constructor(props) {
            super(props)
            this.projectData = null
            bindAll(this, [
                'saveProjectJSONToServer',
                'saveProjectICONToServer',
                'saveProjectToServer'
            ]);
        }
        componentDidUpdate(prevProps) {
            if (this.props.isSavingJSON && !prevProps.isSavingJSON) {
                this.saveProjectJSONToServer()
            }
            if (this.props.isSavingICON && !prevProps.isSavingICON) {
                this.saveProjectICONToServer()
            }
            if (this.props.isSavingProject && !prevProps.isSavingProject) {
                this.saveProjectToServer()
            }
        }
        saveProjectJSONToServer() {
            // get project Title, timeStamp, projectId...
            var applyId = sha256((new Date()).getTime().toString() + Math.random().toString())
            var projectJSON = {
                'title': 'this is title demo',
                'timeStamp': (new Date()).getTime().toString(),
                'projectId': applyId
            }
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')
            fetch(this.props.fullURI, {
              method: 'POST',
              body: JSON.stringify(projectJSON),
              headers: myHeaders,
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(myBlob => {
                        // double verify json
                        this.props.doneSaveProject(true)
                    }).catch(error => {
                        // read json from server fail
                        this.props.doneSaveProject(false)
                        console.log("saveProjectJSONToServer response error-json")
                    })
                } else {
                    // save projectJSON to server error
                    this.props.doneSaveProject(false)
                    console.log("saveProjectJSONToServer response error-status", response.status)
                }
            }).catch(error => {
                // save projectJSON to server net error
                console.log("saveProjectJSONToServer error-net")
                this.props.doneSaveProject(false)
            })
        }
        saveProjectICONToServer() {
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')
            fetch(this.props.fullURI, {
              method: 'POST',
              body: '',
              headers: myHeaders,
            }).then(response => {
                if (response.status === 200) {
                    response.blob().then(myBlob => {
                        this.reader.readAsArrayBuffer(myBlob)
                    }).catch(error => {
                        // read blob into arrayBuffer fail
                        this.props.doneSaveProject(false)
                    })
                } else {
                    // fetch project from server error
                    this.props.doneSaveProject(false)
                }
            }).catch(error => {
                // fetch project from server net error
                this.props.doneSaveProject(false)
            })
        }
        saveProjectToServer() {
            this.props.saveProjectSb3().then(content => {
                var myHeaders = new Headers()
                myHeaders.append('Content-Type', 'application/x.scratch.sb3')
                fetch(this.props.prefixURI+"?setType=SCRATCH", {
                  method: 'POST',
                  body: content,
                  headers: myHeaders,
                }).then(response => {
                    if (response.status === 200) {
                        response.text().then(myBlob => {
                            console.log(myBlob)
                            this.props.doneSaveProject()
                        }).catch(error => {
                            // read blob into arrayBuffer fail
                            this.props.doneSaveProject(false)
                        })
                    } else {
                        // fetch project from server error
                        this.props.doneSaveProject(false)
                    }
                }).catch(error => {
                    // fetch project from server net error
                    this.props.doneSaveProject(false)
                })
            });
        }

        render() {
            const {
                prefixURI,
                suffixURI,
                fullURI,
                isSavingJSON,
                isSavingICON,
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
        fullURI: PropTypes.string,
        isSavingJSON: PropTypes.bool,
        isSavingICON: PropTypes.bool,
        isSavingProject: PropTypes.bool,
        saveJSON: PropTypes.func,
        saveICON: PropTypes.func,
        saveProject: PropTypes.func,
        doneSaveProject: PropTypes.func,
        vm: PropTypes.shape({
            loadProject: PropTypes.func
        }),
        saveProjectSb3: PropTypes.func
    }
    const mapStateToProps = state => ({
        fullURI: state.scratchGui.BACProjectState.projectURI,
        isSavingJSON: getIsSavingJSON(state.scratchGui.BACProjectState.loadingState),
        isSavingICON: getIsSavingICON(state.scratchGui.BACProjectState.loadingState),
        isSavingProject: getIsSavingProject(state.scratchGui.BACProjectState.loadingState),
        vm: state.scratchGui.vm,
        saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm)
    });
    const mapDispatchToProps = dispatch => ({
        saveJSON: projectURI => dispatch(saveJSON(projectURI)),
        saveICON: projectURI => dispatch(saveICON(projectURI)),
        saveProject: projectURI => dispatch(saveProject(projectURI)),
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
