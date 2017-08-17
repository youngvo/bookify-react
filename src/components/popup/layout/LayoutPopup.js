import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './LayoutPopup.css'
import onClickOutsize from 'react-onclickoutside';
import IconButton from './../../materials/iconButton/IconButton';
import LocaleUtils from './../../../utils/LocaleUtils';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import './ReactTabs.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LayoutItem from './LayoutItem';
import {connect} from 'react-redux';

class LayoutPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            tabGoToIndex: 0,
            sliderGoToIndex: 0
        }
    }

    componentWillMount() {
        let {numPage, present, typesOfLayouts} = this.props;
        let presentLayoutId = (typeof(numPage) !== 'undefined') ? present[numPage - 1].page_layout_id : present[0].page_layout_id;
        for (let i = 0; i < typesOfLayouts.length; i++) {
            let layoutItemList = typesOfLayouts[i];
            for (let j = 0; j < layoutItemList.length; j++) {
                if (presentLayoutId === layoutItemList[j].$.id) {
                    this.setState({
                        tabIndex: i,
                        tabGoToIndex: i,
                        sliderGoToIndex: j
                    });
                    return;
                }
            }
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.goToCurrentPageLayout();
        }, 500);

    }

    componentDidUpdate() {
        setTimeout(() => {
            this.goToCurrentPageLayout();
        }, 500);
    }

    goToCurrentPageLayout() {
        const {  tabIndex, tabGoToIndex, sliderGoToIndex } = this.state;
        if (tabGoToIndex === tabIndex && sliderGoToIndex > 5) {
            this.refs.slider.slickGoTo(sliderGoToIndex - 5);
        }
    }

    getSlidesToScroll(layoutLength) {
        let mod = layoutLength % 6;
        let origin = layoutLength / 6;
        let result = (mod > origin) ? parseInt(mod) : parseInt(origin);
        return result;
    }

    handleClickOutside() {
        this.props.onClose();
    }

    renderLayoutItem(layoutItem) {
        return (
            <div><LayoutItem layoutData={layoutItem} onClose={this.props.onClose} numPage={this.props.numPage}/></div>
        );
    }

    renderLayoutsOfTab(layouts) {
        let layoutsOfTab = [];
        for (let index = 0; index < layouts.length; index++) {
            layoutsOfTab.push(this.renderLayoutItem(layouts[index]));
        }
        return layoutsOfTab;
    }

    renderTabsPanel() {
        const { typesOfLayouts } = this.props;
        let tabsPanel = [];
        let slideConfig = {
            variableWidth:false,
            slidesToShow: 6,
            infinite: false,
            swipeToSlide: false,
            swipe: false
        };
        for (let index = 0; index < typesOfLayouts.length; index++) {
            slideConfig.slidesToScroll = this.getSlidesToScroll(typesOfLayouts[index].length);
            let tabPanel = <TabPanel>
                <div className="layout-popup-slider-custom">
                    <Slider ref='slider' {...slideConfig}>
                        {this.renderLayoutsOfTab(typesOfLayouts[index])}
                    </Slider>
                </div>
            </TabPanel>;
            tabsPanel.push(tabPanel);
        }
        return tabsPanel;
    }

    renderTabList() {
        return (
            <TabList>
                <Tab>{LocaleUtils.instance.translate('layout_menu.1photo')}</Tab>
                <Tab>{LocaleUtils.instance.translate('layout_menu.2photo')}</Tab>
                <Tab>{LocaleUtils.instance.translate('layout_menu.3photo')}</Tab>
                <Tab>{LocaleUtils.instance.translate('layout_menu.4photo')}</Tab>
                <Tab>{LocaleUtils.instance.translate('layout_menu.5photo')}</Tab>
                <Tab>{LocaleUtils.instance.translate('layout_menu.textmisc')}</Tab>
            </TabList>
        );
    }

    renderTabs() {
        return (
            <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({tabIndex})}>
                {this.renderTabList()}
                <div className="slider-wrapper">
                    {this.renderTabsPanel()}
                </div>
            </Tabs>
        )
    }

    renderRecentLayoutItems() {
        let recentLayoutList = [];
        const {recentLayouts} = this.props;
        for (let index = recentLayouts.length - 1; index >= 0; index--) {
            let layoutItem =
                <div className="layout-popup-bottom item">
                    <LayoutItem layoutData={recentLayouts[index]} onClose={this.props.onClose}
                                numPage={this.props.numPage} isRecentLayout={true}/>
                </div>
            recentLayoutList.push(layoutItem);
        }
        return recentLayoutList;
    }

    renderBottom() {
        if (this.props.recentLayouts.length !== 0) {
            return (
                <div className="layout-popup-bottom">
                    <div className="layout-popup-bottom-title">
                        {LocaleUtils.instance.translate('label.recent_layouts')}
                    </div>
                    {this.renderRecentLayoutItems()}
                </div>
            )
        }
    }


    // renderLineText(numberLines, divider) {
    //     let divLine = [];
    //     for (let index = 0; index < numberLines; index++) {
    //         let style = {
    //             top: (divider - 3) * (index+1)
    //         }
    //         let div = <div className="layout-item-draw-text-line" style={style}/>
    //         divLine.push(div);
    //     }
    //     return divLine;
    // }
    //
    // renderText(textList) {
    //     let results = [];
    //     for (let index in textList) {
    //         let width = textList[index].$.width;
    //         let height =  textList[index].$.height;
    //         let x =  textList[index].$.x;
    //         let y = textList[index].$.y;
    //         let style = {
    //             width: width,
    //             height: height,
    //             left: x,
    //             top: y
    //         }
    //         let renderLine = this.renderLineText(parseInt(height/29), 29);
    //         let div = <div className="layout-item-draw-text-child" style={style}>
    //             {renderLine}
    //         </div>;
    //         results.push(div);
    //     }
    //     return results;
    // }
    //
    // renderImage(imageList) {
    //     let results = [];
    //     for (let index in imageList) {
    //         let width = imageList[index].$.width;
    //         let height =  imageList[index].$.height;
    //         let x =  imageList[index].$.x;
    //         let y = imageList[index].$.y;
    //         let style = {
    //             width: width,
    //             height: height,
    //             left: x,
    //             top: y
    //         }
    //         let div = <div className="layout-item-draw-image-child" style={style}></div>;
    //         results.push(div);
    //     }
    //     return results;
    // }


    // render() {
    //     let layoutData1 = this.props.typesOfLayouts[5];
    //     let layoutData = layoutData1[1];
    //     console.log('<<<<<<<<<<<<<<<<<textMisc', this.props.typesOfLayouts[5]);
    //     console.log('<<<<<<<<<<<<<<<<<layoutData', layoutData);
    //     // let { layoutData, numPage, isRecentLayout, present } = this.props;
    //     let layoutDataWidth = layoutData.$.width;
    //     let layoutDataHeight = layoutData.$.height;
    //     let style = {
    //         width: layoutDataWidth,
    //         height: layoutDataHeight
    //     }
    //     let imageList = [];
    //     let textList = [];
    //
    //     if (layoutData.hasOwnProperty('ImageContainer')){
    //         let imageContainer = layoutData['ImageContainer'];
    //         for (let index in layoutData['ImageContainer']){
    //             imageList.push(imageContainer[index]);
    //         }
    //     }
    //     if (layoutData.hasOwnProperty('TextContainer')){
    //         let textContainer = layoutData['TextContainer'];
    //         for (let index in textContainer){
    //             textList.push(textContainer[index]);
    //         }
    //     }
    //
    //     let renderText = this.renderText(textList);
    //     let renderImage = this.renderImage(imageList);
    //     return (
    //         <div className="test" style={style}>
    //             {renderImage}
    //             {renderText}
    //         </div>
    //     )
    // }

    render() {
		let {display} = this.props;
		let classPopupZone = 'layout-popup-zone ' + display;
        return (
            <div className={classPopupZone}>
                <div className="layout-popup-top">
                    <IconButton className="layout-popup-close-icon" onClick={this.props.onClose} type="close"/>
                    <div className="layout-popup-title">
                        {LocaleUtils.instance.translate('title.layout_menu')}
                    </div>
                </div>
                <div className="layout-popup-middle">
                    {this.renderTabs()}
                </div>
                {this.renderBottom()}
                <div className='triangle' />
            </div>
        );
    }
}

LayoutPopup.propTypes = {
    display: PropTypes.string,
    numPage: PropTypes.number,
    onClose: PropTypes.func
};

const mapStateToProps = (state) => {
    const {project} = state;
    const {book} = project;
    const {layouts, recentLayouts, pages} = book;
    const {typesOfLayouts} = layouts;
    const {present} = pages;
    return {recentLayouts, present, typesOfLayouts};
};

export default connect(
    mapStateToProps,
)(onClickOutsize(LayoutPopup));
