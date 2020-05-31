import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';

import {
    getIsIdleProject,
    getIsFetchingJSON,
    getIsFetchingICON,
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
                'fetchProjectJSONFromServer',
                'fetchProjectIconFromServer',
                'fetchProjectFromServer',
                'onLoad',
            ]);
            if (
                props.prefixURI !== '' &&
                props.prefixURI !== null &&
                typeof props.prefixURI !== 'undefined'
            ) {
                // only when project is Idle
                if (props.isIdleProject) {
                    this.props.fetchProject(props.prefixURI+props.suffixURI)
                }
            }
        }
        componentWillMount () {
            this.reader = new FileReader()
            this.reader.onload = this.onLoad
        }
        componentDidUpdate(prevProps) {
            if (this.props.isFetchingJSON && !prevProps.isFetchingJSON) {
                this.fetchProjectJSONFromServer()
            }
            if (this.props.isFetchingICON && !prevProps.isFetchingICON) {
                this.fetchProjectIconFromServer()
            }
            if (this.props.isFetchingProject && !prevProps.isFetchingProject && this.reader) {
                this.fetchProjectFromServer()
            }
        }
        fetchProjectJSONFromServer() {
            // fetch project information
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')
            fetch(this.props.fullURI, {
              method: 'GET',
              headers: myHeaders,
            }).then(response => {
                if (response.status === 200) {
                    response.blob().then(myBlob => {
                        this.reader.readAsArrayBuffer(myBlob)
                    }).catch(error => {
                        // read blob into arrayBuffer fail
                        this.props.doneFetchProject(false)
                    })
                } else {
                    // fetch project from server error
                    this.props.doneFetchProject(false)
                }
            }).catch(error => {
                // fetch project from server net error
                this.props.doneFetchProject(false)
            })
        }
        fetchProjectIconFromServer() {
            // fetch project icon
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/image')
            fetch(this.props.fullURI, {
              method: 'GET',
              headers: myHeaders,
            }).then(response => {
                if (response.status === 200) {
                    response.blob().then(myBlob => {
                        this.reader.readAsArrayBuffer(myBlob)
                    }).catch(error => {
                        // read blob into arrayBuffer fail
                        this.props.doneFetchProject(false)
                    })
                } else {
                    // fetch project from server error
                    this.props.doneFetchProject(false)
                }
            }).catch(error => {
                // fetch project from server net error
                this.props.doneFetchProject(false)
            })
        }
        fetchProjectFromServer() {
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/x.scratch.sb3')
            fetch(this.props.fullURI, {
              method: 'GET',
              headers: myHeaders,
            }).then(response => {
                if (response.status === 200) {
                    response.blob().then(myBlob => {
                        this.reader.readAsArrayBuffer(myBlob)
                    }).catch(error => {
                        // read blob into arrayBuffer fail
                        this.props.doneFetchProject(false)
                    })
                } else {
                    // fetch project from server error
                    this.props.doneFetchProject(false)
                }
            }).catch(error => {
                // fetch project from server net error
                this.props.doneFetchProject(false)
            })
        }
        onLoad() {
            this.props.vm.loadProject(this.reader.result)
                .then(() => {
                    this.props.doneFetchProject(true);
                }).catch(error => {
                    // load file into scratch vm fail
                    this.props.doneFetchProject(false);
                });
        }

        render() {
            const {
                intl,
                prefixURI,
                suffixURI,
                fullURI,
                isFetchingJSON,
                isFetchingICON,
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
        fullURI: PropTypes.string,
        isFetchingJSON: PropTypes.bool,
        isFetchingICON: PropTypes.bool,
        isFetchingProject: PropTypes.bool,
        isIdleProject: PropTypes.bool,
        fetchProject: PropTypes.func,
        doneFetchProject: PropTypes.func,
        vm: PropTypes.shape({
            loadProject: PropTypes.func
        })
    }

    const mapStateToProps = state => ({
        fullURI: state.scratchGui.BACProjectState.projectURI,
        isFetchingJSON: getIsFetchingJSON(state.scratchGui.BACProjectState.loadingState),
        isFetchingICON: getIsFetchingICON(state.scratchGui.BACProjectState.loadingState),
        isFetchingProject: getIsFetchingProject(state.scratchGui.BACProjectState.loadingState),
        isIdleProject: getIsIdleProject(state.scratchGui.BACProjectState.loadingState),
        vm: state.scratchGui.vm
    });

    const mapDispatchToProps = dispatch => ({
        fetchProject: projectURI => dispatch(fetchProject(projectURI)),
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