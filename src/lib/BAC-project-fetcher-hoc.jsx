import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';

import {
    getIsIdleProject,
    getIsFetchingProject,
    setProject,
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
                'fetchProjectFromServer',
                'onLoad',
                'resetReader'
            ]);
            if (
                props.defaultURI !== '' &&
                props.defaultURI !== null &&
                typeof props.defaultURI !== 'undefined'
            ) {
                this.props.setProject(props.defaultURI)
            }
        }
        componentWillMount () {
            this.reader = new FileReader()
            this.reader.onload = this.onLoad
            this.resetReader();
        }
        componentDidUpdate(prevProps) {
            if (this.props.isFetchingProject && !prevProps.isFetchingProject) {
                this.fetchProjectFromServer()
            }
        }
        fetchProjectFromServer() {
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/scratch.sb3')
            fetch(this.props.projectURI, {
              method: 'GET',
              headers: myHeaders,
            }).then(response => {
                if (response.status === 200) {
                    response.blob().then(myBlob => {
                        this.reader.readAsArrayBuffer(myBlob)
                    })
                } else {
                    // TODO: implement error process
                }
            })
        }
        onLoad() {
            this.props.vm.loadProject(this.reader.result)
                .then(() => {
                    this.props.doneFetchProject();
                    this.resetReader();
                })
                .catch(error => {
                    // TODO: impolement error process
                    this.resetReader();
                    this.props.doneFetchProject();
                });
        }
        resetReader () {
        }
        render() {
            const {
                intl,
                defaultURI,
                projectURI,
                isFetchingProject,
                isIdleProject,
                setProject,
                doneFetchProject,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    {...componentProps}
                />
            )
        }
    }

    BACProjectFetcherComponent.propTypes = {
        defaultURI: PropTypes.string,
        projectURI: PropTypes.string,
        isFetchingProject: PropTypes.bool,
        isIdleProject: PropTypes.bool,
        setProject: PropTypes.func,
        doneFetchProject: PropTypes.func,
        vm: PropTypes.shape({
            loadProject: PropTypes.func
        })
    }

    BACProjectFetcherComponent.defaultProps = {
        defaultURI: ''
    }

    const mapStateToProps = state => ({
        projectURI: state.scratchGui.BACProjectState.projectURI,
        isFetchingProject: getIsFetchingProject(state.scratchGui.BACProjectState.loadingState),
        isIdleProject: getIsIdleProject(state.scratchGui.BACProjectState.loadingState),
        vm: state.scratchGui.vm
    });

    const mapDispatchToProps = dispatch => ({
        setProject: projectURI => dispatch(setProject(projectURI)),
        doneFetchProject: () => dispatch(doneFetchProject())
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