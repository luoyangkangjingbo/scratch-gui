import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

class LanguageCustomize extends React.Component {
    constructor (props) {
        super(props);
        this.CustomizeLanguages = {
            'zh-cn':{
                'gui.menuBar.New':  '新建',
                'gui.menuBar.Save': '保存',
                'gui.menuBar.File': '文件',
                'gui.menuBar.SaveToComputer':'保存到电脑',
                'gui.menuBar.SaveToCloud':'保存到云端',
                'gui.menuBar.LoadFromComputer':'从电脑加载',
                'gui.menuBar.LoadFromCloud':'从云端加载',
                'gui.menuBar.Release':'发布',
                'gui.menuBar.Login':'登录',
            },
            'en':{
                'gui.menuBar.New':  'New',
                'gui.menuBar.Save': 'Save',
                'gui.menuBar.File': 'File',
                'gui.menuBar.SaveToComputer':'Save To Computer',
                'gui.menuBar.SaveToCloud':'Save To Cloud',
                'gui.menuBar.LoadFromComputer':'Load From Computer',
                'gui.menuBar.LoadFromCloud':'Load From Cloud',
                'gui.menuBar.Release':'Release',
                'gui.menuBar.Login':'Login',
            }
        }
    }
    render () {
        return (
            <div>
                {this.CustomizeLanguages[this.props.currentLocale][this.props.id]}
            </div>
        );
    }
}

LanguageCustomize.propTypes = {
    currentLocale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    currentLocale: state.locales.locale
});

export default connect(
    mapStateToProps
)(LanguageCustomize);
