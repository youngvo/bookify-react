import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './BackgroundsAndBordersPopup.css';
import IconButton from './../../materials/iconButton/IconButton';
import LocaleUtils from './../../../utils/LocaleUtils';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import './ReactTabsCustom.css';
import BackgroundItem from './BackgroundItem';
import ImageBorderItem from './ImageBorderItem';
import onClickOutsize from 'react-onclickoutside';
import Button, {colorType} from './../../../components/materials/button/Button';
import Assets from './../../../assets/Assets';
import Checkbox from 'rc-checkbox';

let slideConfigBackground = {
    slidesToShow: 6,
    infinite: false,
    swipeToSlide: false,
    swipe: false
};

let slideConfigBorder = {
    slidesToShow: 6,
    infinite: false,
    swipeToSlide: false,
    swipe: false,
    slidesToScroll: 1
};

class BackgroundsAndBordersPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            themeData: [],
            tabIndex: 0,
            changeAllPage: false
        }
        this.getThemeData();
        this.onChangeAllPage = this.onChangeAllPage.bind(this);
    }

    handleClickOutside() {
        this.props.onClose();
    }

    getThemeData() {
        let { themeData } = this.state;
        let {theme, themes} = this.props;
        for (let index = 0; index < themes.length;index++) {
            if (themes[index].$.id === theme) {
                themeData.push(themes[index]);
                return;
            }
        }
    }

    getSlidesToScroll(layoutLength) {
        let mod = layoutLength % 6;
        let origin = layoutLength / 6;
        let result = (mod > origin) ? parseInt(mod) : parseInt(origin);
        return result;
    }

    onChangeAllPage(e) {
        this.setState({
            changeAllPage: e.target.checked
        })
    }

    renderBackgroundItem(Background){
        let result = [];
        let { numPage, isCover, onClose } = this.props;
        for (let index = 0; index < Background.length; index++) {
            if (isCover && Background[index].$.pattern_id) {
                break;
            }
            let backgroundItem = <div><BackgroundItem backgroundData={Background[index]} isCover={isCover} changeAllPage={this.state.changeAllPage} numPage={numPage} onClose={onClose}/></div>;
            result.push(backgroundItem);
        }
        return result;
    }

    renderBorderItem(ImageBorder){
        let result = [];
        result.push(<div><ImageBorderItem/></div>);
        for (let index = 0; index < ImageBorder.length; index++) {
            let borderItem = <div><ImageBorderItem borderData={ImageBorder[index]}/></div>;
            result.push(borderItem);
        }
        return result;
    }

    renderTabsPanel() {
        let tabsPanel = [];
        let { themeData } = this.state;
        let {Backgrounds, ImageBorders} = themeData[0];
        let {Background} = Backgrounds[0];
        let {ImageBorder} = ImageBorders[0];

        slideConfigBackground.slidesToScroll = this.getSlidesToScroll(Background.length);
        let tabPanelBackground = <TabPanel>
                <Slider ref='slider' {...slideConfigBackground}>
                    {this.renderBackgroundItem(Background)}
                </Slider>
        </TabPanel>;

        let tabPanelBorder = <TabPanel>
                <Slider ref='slider' {...slideConfigBorder}>
                    {this.renderBorderItem(ImageBorder)}
                </Slider>
        </TabPanel>;

        tabsPanel.push(tabPanelBackground);
        tabsPanel.push(tabPanelBorder);
        return tabsPanel;
    }

    renderTabs() {
        return (
            <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({tabIndex})}>
                <TabList>
                    <Tab>{LocaleUtils.instance.translate('label.theme_backgrounds')}</Tab>
                    <Tab>{LocaleUtils.instance.translate('label.theme_borders')}</Tab>
                </TabList>
                <div className="swap-sp">    
                <div className="backgrounds-borders-middle-title">
                    <div className="backgrounds-borders-middle-title-title1">{LocaleUtils.instance.translate('label.style') + ':'}</div>
                    <div className="backgrounds-borders-middle-title-title2">{LocaleUtils.instance.translate('theme.name.blurb.viewfinder')}</div>
                </div>
                <div className="backgrounds-borders-slider-custom">
                    <div className="backgrounds-borders-slider-wrapper">
                        {this.renderTabsPanel()}
                    </div>
                </div>
                </div>    
            </Tabs>
        )
    }

    renderMiddle() {
        return (
            <div>
                <hr className="backgrounds-borders-divider"/>
                <div className="backgrounds-borders-middle-group">
                    <div className="gr1">
                    <div className="backgrounds-borders-middle-color-title1">{LocaleUtils.instance.translate('colorpicker.label.pick_color')}</div>
                    <div className="backgrounds-borders-middle-pick-color">
                        <Button type={colorType.textControl}
                                iconImage={Assets.instance.retrieveImageObjectURL('img_colorPicker')}
                        />
                    </div>
                    </div>
                    <div className="gr2">
                    <div className="backgrounds-borders-middle-color-title2">{LocaleUtils.instance.translate('colorpicker.label.sample_color')}</div>
                    <div className="backgrounds-borders-middle-same-color">
                        <Button type={colorType.textControl}
                                iconImage={Assets.instance.retrieveImageObjectURL('img_pickerColor')}
                        />
                    </div>
                    </div>    
                </div>
            </div>
        )
    }

    renderBackgroundsAndBorders() {
        let {display} = this.props;
        let classBackgroundsAndBordersZone = 'backgrounds-borders-zone ' + display;
        return (
            <div className={classBackgroundsAndBordersZone}>
                <IconButton className="backgrounds-borders-close-icon" onClick={this.props.onClose} type="close"/>
                <div className="backgrounds-borders-top">
                    <div className="backgrounds-borders-title">
                        {LocaleUtils.instance.translate('title.page_style')}
                    </div>
                </div>
                <div className="backgrounds-borders-middle">
                    {this.renderTabs()}
                    {this.state.tabIndex === 0 && this.renderMiddle()}
                </div>
                <div className="backgrounds-borders-checkbox">
                    <label>
                        <Checkbox
                            checked={this.state.changeAllPage}
                            onChange={this.onChangeAllPage}
                        />
                        <span className="backgrounds-borders-checkbox-label">{LocaleUtils.instance.translate('label.apply_to_all_pages')}</span>
                    </label>
                </div>
                <div className='triangle' />
            </div>
        )
    }

    renderBackgrounds() {
        let { themeData } = this.state;
        let { Backgrounds } = themeData[0];
        let { Background } = Backgrounds[0];

        let length = Background.length;
        for (let index = 0; index < Background.length; index++) {
            if (Background[index].$.pattern_id) {
                length = length - 1;
            }
        }
        slideConfigBackground.slidesToScroll = this.getSlidesToScroll(length);

        let {display} = this.props;
        let classBackgroundsAndBordersZone = 'backgrounds-borders-zone ' + display;

        let styleBackgroundsZone = {
            height: 285
        }

        let styleMiddle = {
            height: 220
        }

        return (
            <div className={classBackgroundsAndBordersZone} style={styleBackgroundsZone}>
                <IconButton className="backgrounds-borders-close-icon" onClick={this.props.onClose} type="close"/>
                <div className="backgrounds-borders-top">
                    <div className="backgrounds-borders-title">
                        {LocaleUtils.instance.translate('title.cover_style')}
                    </div>
                </div>
                <div className="backgrounds-borders-middle" style={styleMiddle}>
                    <Tabs>
                        <div className="swap-sp">
                            <div className="backgrounds-borders-middle-title">
                                <div className="backgrounds-borders-middle-title-title1">{LocaleUtils.instance.translate('label.style') + ':'}</div>
                                <div className="backgrounds-borders-middle-title-title2">{LocaleUtils.instance.translate('theme.name.blurb.viewfinder')}</div>
                            </div>
                            <div className="backgrounds-borders-slider-custom">
                                <div className="backgrounds-borders-slider-wrapper">
                                    <TabPanel>
                                        <Slider ref='slider' {...slideConfigBackground}>
                                            {this.renderBackgroundItem(Background)}
                                        </Slider>
                                    </TabPanel>
                                </div>
                            </div>
                        </div>
                    </Tabs>
                    {this.renderMiddle()}
                </div>
                <div className='triangle' />
            </div>
        )
    }

    render() {
        if (this.props.isCover) {
            return (
                this.renderBackgrounds()
            )
        }

        return (
           this.renderBackgroundsAndBorders()
        )
    }
}

BackgroundsAndBordersPopup.propTypes = {
    display: PropTypes.string,
    onClose: PropTypes.func,
    numPage: PropTypes.number,
    isCover: PropTypes.bool,
    changeAllPage: PropTypes.bool
};

BackgroundsAndBordersPopup.defaultProps = {
    isCoverPage: false,
    changeAllPage: false
}

const mapStateToProps = (state) => {
    const { themes, project } = state;
    const { book } = project;
    const { theme } = book.bookInfo;
    return { theme, themes };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // onClickChooseLayout: (pagesChoosingList, newLayout) => onChooseLayout(dispatch, pagesChoosingList, newLayout),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(onClickOutsize(BackgroundsAndBordersPopup));