import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import decksLibraryContent from '../lib/libraries/decks/index.jsx';
import tutorialTags from '../lib/libraries/tutorial-tags';

import analytics from '../lib/analytics';
import {notScratchDesktop} from '../lib/isScratchDesktop';

import LibraryComponent from '../components/library/library.jsx';

import {connect} from 'react-redux';

import {
    closeBACProjectLibrary
} from '../reducers/modals';

import {
    getIsProjectLibraryIdle,
    getIsProjectLibraryBusy,
    getIsProjectLibraryError,
    loadProjectLibrary,
    doneLoadProjectLibrary
} from '../reducers/BAC-project-library';

const messages = defineMessages({
    BACProjectLibraryTitle: {
        defaultMessage: 'Choose a Project',
        description: 'Heading for the project library',
        id: 'gui.BACProjectLibrary.tutorials'
    }
});

class BACProjectLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect',
            'fetchProjectLibrary',
            'fetchProjectLibraryProcess',
        ]);
        this.projectLoading = false
        this.projectLibrary = []
    }

    componentDidUpdate(prevProps) {
        if (this.props.isProjectBusy && prevProps.isProjectIdle) {
            this.fetchProjectLibrary()
        }
    }

    fetchProjectLibrary() {
        var myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        fetch("http://106.15.127.56:8881/BilinearCommon/projectAsset?Id=", {
          method: 'GET',
          headers: myHeaders,
        }).then(response => {
            if (response.status === 200) {
                var contentType = response.headers.get('Content-Type')
                if (contentType === 'application/json') {
                    response.text().then(content => {
                        this.fetchProjectLibraryProcess(content)
                    })
                } else {
                    this.props.doneLoadProjectLibrary(false)
                }
            } else {
                this.props.doneLoadProjectLibrary(false)
            }
        }).catch(error => {
            this.props.doneLoadProjectLibrary(false)
        })
    }

    fetchProjectLibraryProcess(params) {
        var localProjectAll = JSON.parse(params)['projectAll']
        for (var i in localProjectAll) {
            this.projectLibrary.push({
                rawURL: localProjectAll[i]['projectDataURI'],
                id: localProjectAll[i]['projectId'],
                name: localProjectAll[i]['projectTitle'],
                featured: true,
                urlId: localProjectAll[i]['projectId'],
                hidden: false
            })
        }
        this.props.doneLoadProjectLibrary(true)
    }

    handleItemSelect (item) {
        console.log("handleItemSelect", item.id)
        // this.props.onActivateDeck(item.id);
    }

    render () {
        if (!this.props.visible) return null;
        if (!this.projectLoading) {
            this.props.loadProjectLibrary()
            this.projectLoading = true
        }

        return (
            <LibraryComponent
                filterable={false}
                data={this.projectLibrary}
                id={'BACProjectLibrary'}
                title={this.props.intl.formatMessage(messages.BACProjectLibraryTitle)}
                visible={this.props.visible}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

BACProjectLibrary.propTypes = {
    intl: intlShape.isRequired,
    isProjectIdle: PropTypes.bool,
    isProjectBusy: PropTypes.bool,
    isProjectError: PropTypes.bool,
    isProjectLibraryOpen: PropTypes.bool,
    onLoadProjectLibrary: PropTypes.func,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool
};

const mapStateToProps = state => ({
    isProjectIdle: getIsProjectLibraryIdle(state.scratchGui.BACProjectLibraryState.loadingState),
    isProjectBusy: getIsProjectLibraryBusy(state.scratchGui.BACProjectLibraryState.loadingState),
    isProjectError: getIsProjectLibraryError(state.scratchGui.BACProjectLibraryState.loadingState),
    visible: state.scratchGui.modals.BACProjectLibrary,
});

const mapDispatchToProps = dispatch => ({
    loadProjectLibrary: () => dispatch(loadProjectLibrary()),
    doneLoadProjectLibrary: (state) => dispatch(doneLoadProjectLibrary(state)),
    onRequestClose: () => dispatch(closeBACProjectLibrary())
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(BACProjectLibrary));
