import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

import './ScrollBar.css';

class ScrollBar extends Component{
    constructor(props){
        super(props)

        let { type, childSize, parentSize, width, height } = this.props;

        if (type === ScrollBar.type.horizontal) {
            width = width - 2*height - 20;
        } else {
            height = height - 2*width - 20;
        }

        let ratio = childSize / parentSize;

        this.state = {
            activeDrags : 0,
            sizeThump : (type === ScrollBar.type.horizontal) ?
                            (childSize - parentSize) >= 0 ?
                                width ?
                                width / ratio
                                : 100
                            : width
                        :   (childSize - parentSize) > 0 ?
                                height ?
                                height / ratio
                                : 100
                            : height,
            sizeTrack : (type === ScrollBar.type.horizontal) ?
                            width > 0 ?
                            width
                            : 100
                        : height ?
                            height
                            : 100,
            deltaPosition : {
                x : 0, y : 0
            },
            positionTrack : {
                x : 0, y : 0
            }
        }
    }

    onStart() {
        this.setState({activeDrags: ++this.state.activeDrags});
    }

    onStop() {
        this.setState({activeDrags: --this.state.activeDrags});
    }

    handleDrag(e, ui) {
        const {x, y} = this.state.deltaPosition;
        const { sizeThump, sizeTrack } = this.state;
        const { type, childSize, parentSize } = this.props;

        let newX = x + ui.deltaX;
        let newY = y + ui.deltaY;

        this.setState({
            deltaPosition: {
                x: newX,
                y: newY,
            }
        });

        let ratio = (childSize - parentSize) / (sizeTrack - sizeThump);
        let positionChildren =  ratio * (-1.005) * (type === ScrollBar.type.horizontal ? newX : newY);
        this.props.onScrollThump(positionChildren);
    }

    onMouseMoveTrack(e) {
        this.setState({
            positionTrack: {
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY
            }
        });
    }

    onClicktrack() {
        console.log(this.state.deltaPosition.x + " vs "+this.state.positionTrack.x);
        let x = 0; let y = 0;
        let deltaX = this.state.positionTrack.x - this.state.deltaPosition.x - this.state.sizeThump;
        let deltaY = this.state.positionTrack.y - this.state.deltaPosition.y - this.state.sizeThump;

        if (this.props.type === ScrollBar.type.horizontal) {
            if (deltaX > 0) {
                if (deltaX > 50) {
                    x = 50;
                } else {
                    x = deltaX;
                }
            } else {
                if (deltaX < -50) {
                    x = -50;
                } else {
                    x = deltaX;
                }
            }
            this.handleDrag(null,{deltaX:x,deltaY:0});
        } else {
            if (deltaY > 0) {
                if (deltaY > 50) {
                    y = 50;
                } else {
                    y = deltaY;
                }
            } else {
                if (deltaY < -50) {
                    y = -50;
                } else {
                    y = deltaY;
                }
            }
            this.handleDrag(null,{deltaX:0,deltaY:y});
        }
    }

    onClickLeftUp() {
        let { x, y } = this.state.deltaPosition;

        if (this.props.type === ScrollBar.type.horizontal) {
            if (x > 50) {
                this.handleDrag(null,{deltaX:-50,deltaY:0});
            } else {
                this.handleDrag(null,{deltaX:-x,deltaY:0});
            }
        } else {
            if (y > 50) {
                this.handleDrag(null,{deltaX:0,deltaY:-50});
            } else {
                this.handleDrag(null,{deltaX:0,deltaY:-y});
            }
        }

    }

    onClickRightDown() {
        const { sizeThump, sizeTrack } = this.state;
        let { x, y } = this.state.deltaPosition;
        let maxPositionThump = sizeTrack - sizeThump - 1;
        console.log(sizeTrack,"vs",sizeThump)
        console.log(maxPositionThump);
        console.log(x);
        if (this.props.type === ScrollBar.type.horizontal) {
            if (maxPositionThump - x >= 50) {
                this.handleDrag(null,{deltaX:50,deltaY:0});
            } else {
                this.handleDrag(null,{deltaX:maxPositionThump - x,deltaY:0});
            }
        } else {
            if (maxPositionThump - y >= 50) {
                this.handleDrag(null,{deltaX:0,deltaY:50});
            } else {
                this.handleDrag(null,{deltaX:0,deltaY:maxPositionThump - y});
            }
        }

    }

    componentWillReceiveProps(nextProps) {
        let { type, childSize, parentSize, width, height} = nextProps;
        if (type === ScrollBar.type.horizontal) {
            width = width - 2*height - 20;
        } else {
            height = height - 2*width - 20;
        }

        this.setState({
            sizeThump : (type === ScrollBar.type.horizontal) ?
                            (childSize - parentSize) > 0 ?
                                width ?
                                width / (childSize / parentSize)
                                : 100 / (childSize / parentSize)
                            : 100
                        :   (childSize - parentSize) > 0 ?
                                height ?
                                height / (childSize / parentSize)
                                : 100 / (childSize / parentSize)
                            : 100,
            sizeTrack : (type === ScrollBar.type.horizontal) ?
                            width ?
                            width
                            : 100
                        : height ?
                            height
                            : 100,
        })
    }

    render() {
        const dragHandlers = {onStart: this.onStart.bind(this), onStop: this.onStop.bind(this)};
        let { width, height, enable, childSize, parentSize, type } = this.props;

        if (type === ScrollBar.type.horizontal) {
            width = width - 2*height - 20;
        } else {
            height = height - 2*width - 20;
        }

        let styleScrollBarBody = {
            // opacity:    enable ? 1 : 0.3,
            width:      width,
            height:     height,
            position: "relative"
        }

        let ratio = childSize / parentSize;

        let autoSizeThumpHorizontal =   ratio > 1 ?
                                            width ?
                                            width/ratio
                                            : 100/ratio
                                        : width;

        let autoSizeThumpVertical =   ratio > 1 ?
                                            height ?
                                            height/ratio
                                            : 100/ratio
                                        : height;

        let styleThumpHorizontal = {
            width:      autoSizeThumpHorizontal,
            height:     height,
        }

        let styleThumpVertical = {
            height:     autoSizeThumpVertical,
            width:      width,
        }

        let classNameThump = enable ? "enable-scroolbar scrollbar-thump" : "disable-scrollbar scrollbar-thump";

        let axis = type === ScrollBar.type.horizontal ? "x" : "y";

        let styleScroolBarZone = {
            display: !enable ? 'none' : type === ScrollBar.type.horizontal ? "flex" : "block",
            pointerEvents:  enable ? "auto" : "none"
        }

        let classNameTrack = "scrollbar-track";
        if (type === ScrollBar.type.horizontal) {
            classNameTrack += " horizontal"
        }
        else classNameTrack += " vertical";

        let styleArrow = {
            // margin : type === ScrollBar.type.horizontal ? "0 5px" : "5px 0"
        }

        return (
            <div className="scrollbar-zone" style={styleScroolBarZone}>
                <div className="scrollbar-arrow icon-ArrowLeft" style={styleArrow} onClick={this.onClickLeftUp.bind(this)} />
                <div className="scrollbar-body" style={styleScrollBarBody}>
                    <div className={classNameTrack}
                        onClick={this.onClicktrack.bind(this)}
                        onMouseMove={this.onMouseMoveTrack.bind(this)}
                    />
                    <Draggable
                        {...dragHandlers}
                        position={this.state.deltaPosition}
                        axis={axis}
                        bounds="parent"
                        onDrag={ enable ? this.handleDrag.bind(this) : ()=>{}} >
                        <div className={classNameThump}
                            style={type === ScrollBar.type.horizontal ? styleThumpHorizontal : styleThumpVertical} />
                    </Draggable>
                </div>
                <div className="scrollbar-arrow icon-ArrowRight" style={styleArrow} onClick={this.onClickRightDown.bind(this)} />
            </div>
        )
    }
}

export default ScrollBar;

ScrollBar.type = {
    horizontal:     'horizontal',
    vertical:       'vertical'
}

ScrollBar.propTypes = {
    type:           PropTypes.string,
    parentSize:     PropTypes.number,
    childSize:      PropTypes.number,
    width:          PropTypes.number,
    height:         PropTypes.number,
    onScrollThump:  PropTypes.object,
    enable:         PropTypes.bool
}

ScrollBar.defaultProps = {
    type:   ScrollBar.type.horizontal,
    parentSize:     200,
    childSize:      800,
    width:          0,
    height:         0,
    onScrollThump:  () => { console.log("Scroll") },
    enable:         true
}
