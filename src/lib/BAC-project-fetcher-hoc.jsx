import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';

import {
    getIsIdleProject,
    getIsFetchingProject,
    fetchProject,
    doneFetchProject
} from '../reducers/BAC-project-state';

const messages = defineMessages({
    loadError: {
        id: 'gui.projectLoader.loadError',
        defaultMessage: 'The project file that was selected failed to load.',
        description: 'An error that displays when a local project file fails to load.'
    }
});

const BACProjectFetcherHOC = function (WrappedComponent) {
    class BACProjectFetcherComponent extends React.Component {
        constructor(props) {
            super(props);
            bindAll(this, [
                'projectJsonProcess',
                'projectImageProcess',
                'projectDataProcess',
                'fetchGET',
                'fetchProjectFromServer',
            ]);
            this.error = false;
            if (
                props.prefixURI !== '' &&
                props.prefixURI !== null &&
                typeof props.prefixURI !== 'undefined'
            ) {
                // only when project is Idle
                this.props.fetchProject(false, false, true, props.prefixURI+props.suffixURI)
            }
        }

        componentDidUpdate(prevProps) {
            if (this.props.isFetchingProject && !prevProps.isFetchingProject) {
                this.fetchProjectFromServer()
            }
        }

        projectJsonProcess(content) {
            return true
        }

        projectImageProcess(content) {
            return true
        }

        projectDataProcess(content) {
            this.props.vm.loadProject(content)
            .then(() => {
                return true
            }).catch(error => {
                return false
            });
        }

        fetchGET(params){
            var retResult = ''
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', params['Content-Type'])
            fetch(params['getURI'], {
              method: 'GET',
              headers: myHeaders,
            }).then(response => {
                if (response.status === 200) {
                    var contentType = response.headers.get('Content-Type')
                    if (contentType === 'application/x.scratch.sb3') {
                        response.arrayBuffer().then(content => {
                            // load sb3 into vm
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
                        response.blob().then(content => {
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

        fetchProjectFromServer() {
            if (this.props.needFetchProjectJson) {
                this.fetchGET({'Content-Type':'application/json', 'getURI':this.props.prefixURI})
                if (this.error) {
                }
            }
            if (this.props.needFetchProjectImage) {
                this.fetchGET({'Content-Type':'image/png', 'getURI':this.props.prefixURI})
                if (this.error) {
                }
            }
            if (this.props.needFetchProjectData) {
                this.fetchGET({'Content-Type':'application/x.scratch.sb3', 'getURI':this.props.prefixURI})
                if (this.error) {
                }
            }
            this.props.doneFetchProject()
        }

        render() {
            const {
                intl,
                prefixURI,
                suffixURI,
                needFetchProjectJson,
                needFetchProjectImage,
                needFetchProjectData,
                isFetchingProject,
                isIdleProject,
                fetchProject,
                doneFetchProject,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    prefixURI={prefixURI}
                    suffixURI={suffixURI}
                    {...componentProps}
                />
            )
        }
    }

    BACProjectFetcherComponent.propTypes = {
        prefixURI: PropTypes.string,
        suffixURI: PropTypes.string,
        needFetchProjectJson: PropTypes.bool,
        needFetchProjectImage: PropTypes.bool,
        needFetchProjectData: PropTypes.bool,
        isFetchingProject: PropTypes.bool,
        isIdleProject: PropTypes.bool,
        fetchProject: PropTypes.func,
        doneFetchProject: PropTypes.func,
        vm: PropTypes.shape({
            loadProject: PropTypes.func
        })
    }

    const mapStateToProps = state => ({
        needFetchProjectJson: state.scratchGui.BACProjectState.projectJson,
        needFetchProjectImage: state.scratchGui.BACProjectState.projectImage,
        needFetchProjectData: state.scratchGui.BACProjectState.projectData,
        isFetchingProject: getIsFetchingProject(state.scratchGui.BACProjectState.loadingState),
        isIdleProject: getIsIdleProject(state.scratchGui.BACProjectState.loadingState),
        vm: state.scratchGui.vm
    });

    const mapDispatchToProps = dispatch => ({
        fetchProject: (projectJson, projectImage, projectData, projectURI) => dispatch(fetchProject(projectJson, projectImage, projectData, projectURI)),
        doneFetchProject: state => dispatch(doneFetchProject(state))
    });

    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );

    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(BACProjectFetcherComponent));
}

export {
    BACProjectFetcherHOC as default
};