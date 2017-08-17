import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutsize from 'react-onclickoutside';
import Draggable from 'react-draggable';
import LocaleUtils from './../../../utils/LocaleUtils';
import CTEventFactory from './../../../utils/CTEventFactory';
import AppServices from './../../../services/AppServices';
import Tooltip  from 'rc-tooltip';
import './ImageField.css';
import PhotoEditControl from './photoEditControl/PhotoEditControl';
import PhotoDetail      from './../../../components/bookDesign/photoDetail/PhotoDetail';
import { FIT_POLICY } from './../../../constants/Constants';

let positionShift = { x: 0, y: 0 };
let positionDraggable = { x: 0, y: 0};

function getValueFromPhotoToZoomBar(valueShow) {
    let valueReal;
    if (valueShow < 1) {
        valueReal = valueShow - 0.05;
    } else {
        valueReal = (valueShow - 1) / 4 + 1;
    }
    return valueReal;
}

class ImageField extends Component {
    constructor(props) {
        super(props);
        
        if (this.props.imageSource) {
            let imageSource = this.parseImageSource(this.props.imageSource);
            let { positionImage, widthAtFit, heightAtFit, widthAtFill, heightAtFill, valueSlider, sFit, sFill, fit_policy } = imageSource;

            this.state = {
                isFill: fit_policy === FIT_POLICY.FILL || fit_policy === FIT_POLICY.PORTRAIT_FILL,
                isFit: fit_policy === FIT_POLICY.FIT,
                positionImage: positionImage,
                imageSource: imageSource,
                isClickInside: false,
                isNull: false,
                numRotate: parseInt(props.imageSource.rotation),
                isShowInfo: false,
                isDragStart: false,
                widthAtFit: widthAtFit,
                heightAtFit: heightAtFit,
                widthAtFill: widthAtFill,
                heightAtFill: heightAtFill,
                scaleFit: sFit,
                scaleFill: sFill,
                valueSlider: valueSlider,
                currentWidth: 0,
                currentHeight: 0,
                idPage: props.idPage,
                position: {
                    x: 0,
                    y: 0
                }
            };
        } else {
            this.state = {
                isFill: true,
                isFit: false,
                positionImage: {
                    x: -this.props.sizeWidth / 2,
                    y: -this.props.sizeHeight / 2,
                },
                imageSource: null,
                isClickInside: false,
                isNull: true,
                numRotate: 0,
                isShowInfo: false,
                isDragStart: false,
                widthAtFit: 1,
                heightAtFit: 1,
                widthAtFill: 1,
                heightAtFill: 1,
                scaleFit: 1,
                scaleFill: 1,
                valueSlider: 1,
                currentWidth: 0,
                currentHeight: 0,
                idPage: 0,
                position: {
                    x: 0,
                    y: 0
                }
            };
        }
        this.setPositionState = this.setPositionState.bind(this);
        this.clickInside = this.clickInside.bind(this);
        this.onClickImageField = this.onClickImageField.bind(this);
    }

    setPositionState(e) {
        let rect = e.target.getBoundingClientRect();
        let xPos = e.pageX - rect.left - rect.width; //x position within the element
        let yPos = e.pageY - rect.top - rect.height;  //y position within the element
        this.setState({
            position: {
                x: xPos,
                y: yPos
            }
        })
    }

    parseImageSource(imageSource) {
        let result = { ...imageSource };
        let originImageWidth;
        let originImageHeight;

        if (imageSource.width && imageSource.height) {
            originImageWidth = imageSource.width;
            originImageHeight = imageSource.height;
        } else {
            let image = new Image();
            image.src = imageSource.imageUrl;
            originImageWidth = image.width;
            originImageHeight = image.height;
            result.width = originImageWidth;
            result.height = originImageHeight;
        }

        let sFill = this.props.sizeHeight / originImageHeight;
        let sFit = this.props.sizeWidth / originImageWidth;

        if (sFill < sFit) {
            let swap = sFill;
            sFill = sFit
            sFit = swap;
        }

        let widthAtFit = originImageWidth * sFit;
        let heightAtFit = originImageHeight * sFit;
        let widthAtFill = originImageWidth * sFill;
        let heightAtFill = originImageHeight * sFill;
        let valueSlider;
        let positionImage = {};
        if (imageSource.fit_policy === FIT_POLICY.MANUAL) {
            valueSlider = imageSource.zoom_level * 100 / 10000;
            positionImage.x = -this.props.sizeWidth / 2 - originImageWidth * (1 - valueSlider) / 2 + imageSource.x_shift;
            positionImage.y = -this.props.sizeHeight / 2 - originImageHeight * (1 - valueSlider) / 2 + imageSource.y_shift;
        }
        else if (imageSource.fit_policy === FIT_POLICY.FIT) {
            valueSlider = sFit;
            positionImage.x = -widthAtFit / sFit / 2;
            positionImage.y = -heightAtFit / sFit / 2;
        }
        else if (imageSource.fit_policy === FIT_POLICY.FILL || imageSource.fit_policy === FIT_POLICY.PORTRAIT_FILL) {
            valueSlider = sFill;
            positionImage.x = -widthAtFill / sFill / 2;
            positionImage.y = -heightAtFill / sFill / 2;
        }
        else {
            valueSlider = 1;
            positionImage.x = -this.props.sizeWidth / 2;
            positionImage.y = -this.props.sizeHeight / 2;
        }
        result.positionImage = positionImage;
        result.widthAtFit = widthAtFit;
        result.heightAtFit = heightAtFit;
        result.widthAtFill = widthAtFill;
        result.heightAtFill = heightAtFill;
        result.valueSlider = valueSlider;
        result.sFit = sFit;
        result.sFill = sFill;

        return result;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.imageSource) {
            let imageSource = this.parseImageSource(nextProps.imageSource);
            let { positionImage, widthAtFit, heightAtFit, widthAtFill, heightAtFill, valueSlider, sFit, sFill, fit_policy } = imageSource;

            this.setState({
                isFill: fit_policy === FIT_POLICY.FILL || fit_policy === FIT_POLICY.PORTRAIT_FILL,
                isFit: fit_policy === FIT_POLICY.FIT,
                positionImage: positionImage,
                imageSource: imageSource,
                isNull: false,
                numRotate: parseInt(nextProps.imageSource.rotation),
                isShowInfo: false,
                isDragStart: false,
                widthAtFit: widthAtFit,
                heightAtFit: heightAtFit,
                widthAtFill: widthAtFill,
                heightAtFill: heightAtFill,
                scaleFit: sFit,
                scaleFill: sFill,
                valueSlider: valueSlider,
                currentWidth: 0,
                currentHeight: 0,
                idPage: nextProps.idPage
            });
        } else {
            this.setState({
                isFill: true,
                isFit: false,
                positionImage: {
                    x: -this.props.sizeWidth / 2,
                    y: -this.props.sizeHeight / 2,
                },
                imageSource: null,
                isClickInside: false,
                isNull: true,
                numRotate: 0,
                isShowInfo: false,
                isDragStart: false,
                widthAtFit: 1,
                heightAtFit: 1,
                widthAtFill: 1,
                heightAtFill: 1,
                scaleFit: 1,
                scaleFill: 1,
                valueSlider: 1,
                currentWidth: 0,
                currentHeight: 0,
                idPage: nextProps.idPage
            });
        }
    }

    handleClickOutside() {
        this.setState({
            isClickInside: false
        });
    }

    clickInside() {
        if (!this.state.isClickInside) {
            this.setState({
                isClickInside: true,
            });
        }
    }

    calculatorScale(originImageWidth, originImageHeight) {
        let sFill = this.props.sizeHeight / originImageHeight;
        let sFit = this.props.sizeWidth / originImageWidth;

        if (originImageWidth < originImageHeight) {
            sFit = this.props.sizeHeight / originImageHeight;
            sFill = this.props.sizeWidth / originImageWidth;
        }

        let widthAtFit = originImageWidth * sFit;
        let heightAtFit = originImageHeight * sFit;
        let widthAtFill = originImageWidth * sFill;
        let heightAtFill = originImageHeight * sFill;

        this.setState({
            scaleFill: sFill,
            scaleFit: sFit,
            valueSlider: sFill,
            widthAtFit: widthAtFit,
            heightAtFit: heightAtFit,
            widthAtFill: widthAtFill,
            heightAtFill: heightAtFill
        });
    }

    setDataToState(data) {
        let image = new Image();
        image.src = data.imageUrl;
        let originWidth = image.width;
        let originHeight = image.height;

        this.calculatorScale(originWidth, originHeight);

        this.setState({
            imageSource: data,
            isNull: false,
            positionImage: {
                x: -originWidth / 2,
                y: -originHeight / 2
            }
        });
    }

    preventDefault(event) {
        event.preventDefault();
    }

    drop(event) {
        this.setState({
            isDragStart: false
        });

        event.preventDefault();

        let data;

        try {
            data = JSON.parse(event.dataTransfer.getData('myData'));
        } catch (e) {
            // If the text data isn't parsable we'll just ignore it.
            return;
        }

        this.setDataToState(data);
    }

    handleFill() {
        this.setState({
            isFill: true,
            isFit: false,
            valueSlider: this.state.scaleFill
        });
        this.updateImageField(this.state.imageSource, this.state.numRotate, this.state.scaleFill, true, false);
        this.resetPosition();
    }

    handleFit() {
        this.setState({
            isFit: true,
            isFill: false,
            valueSlider: this.state.scaleFit
        });
        this.updateImageField(this.state.imageSource, this.state.numRotate, this.state.scaleFit, false, true);
        this.resetPosition();
    }

    handleRotate() {
        let newNumRotate = this.state.numRotate === 270 ? 0 : this.state.numRotate + 90;
        this.setState({
            numRotate: newNumRotate
        });

        this.updateImageField(this.state.imageSource, newNumRotate, this.state.valueSlider, this.state.isFill, this.state.isFit);
    }

    handleInfo() {
        this.setState({
            isShowInfo: true
        });
    }

    handleCloseInfo() {
        this.setState({
            isShowInfo: false
        });
    }

    handleRemove() {
        const { idLayout, idPage, idPageLayout, onRemovePhotoInPage } = this.props;

        this.setState({
            imageSource: null
        });
        onRemovePhotoInPage(idLayout, idPage, idPageLayout);
    }

    handleChangeValueSlider(value) {
        this.setState({
            valueSlider: value
        });
    }

    handleMouseUp(value) {
        let {imageSource, numRotate} = this.state;
        positionShift = {
                            x: positionDraggable.x + (this.props.sizeWidth + imageSource.width * (1 - value)) / 2,
                            y: positionDraggable.y + (this.props.sizeHeight + imageSource.height * (1 - value)) / 2
                        };
        this.updateImageField(imageSource, numRotate, value, false, false);
    }

    resetPosition() {
        let xReset = -this.state.widthAtFill / this.state.scaleFill / 2;
        let yReset = -this.state.heightAtFill / this.state.scaleFill / 2;
        positionDraggable = { x: xReset, y: yReset}
        this.setState({
            positionImage: {
                x: xReset,
                y: yReset
            }
        });
    }

    setPositionNull() {
        this.setState({
            positionImage: null
        });
    }

    dragStart(event) {
        this.setState({
            isDragStart: true
        });

        let photo = this.state.imageSource;

        //send data from photo card
        event.dataTransfer.setData('myData', JSON.stringify(photo));
    }

    handleMouseWheel(evt) {
        let { imageSource } = this.state;
        let lastValueSlider;
        if (evt.deltaY > 0) {
            if (this.state.valueSlider > 0.1) {
                lastValueSlider = this.state.valueSlider - 0.05;
                this.setState({
                    valueSlider: lastValueSlider,
                    isFill: false,
                    isFit: false
                });
            }
        } else if (evt.deltaY < 0) {
            if (this.state.valueSlider < 4.95) {
                lastValueSlider = this.state.valueSlider + 0.05;
                this.setState({
                    valueSlider: lastValueSlider,
                    isFill: false,
                    isFit: false
                });
            }
        }

        positionShift = {
                            x: positionDraggable.x + (this.props.sizeWidth + imageSource.width * (1 - lastValueSlider)) / 2,
                            y: positionDraggable.y + (this.props.sizeHeight + imageSource.height * (1 - lastValueSlider)) / 2
                        };

        this.updateImageField(imageSource, this.state.numRotate, lastValueSlider, false, false);
    }

    onStopDrag(event, position) {
        let { imageSource, numRotate, valueSlider} = this.state;
        const { x, y } = position;
        positionDraggable = {x,y};
        positionShift = {
                            x: x + this.props.sizeWidth / 2 + imageSource.width * (1 - valueSlider) / 2,
                            y: y + this.props.sizeHeight / 2 + imageSource.height * (1 - valueSlider) / 2
                        };

        this.setState({
            isFill: false,
            isFit: false
        })

        this.updateImageField(imageSource, numRotate, valueSlider, false, false);
    }

    updateImageField(imageSource, numRotate, valueSlider, isFill, isFit) {
        let imageFieldObject = {};
        let { idLayout, idPage, idPageLayout } = this.props;

        if (imageSource !== null) {
            imageFieldObject = {
                width: imageSource.width,
                height: imageSource.height,
                imageUrl: imageSource.imageUrl,
                x_shift: positionShift.x,
                y_shift: positionShift.y,
                name: imageSource.name,
                rotation: parseInt(numRotate),
                fit_policy: isFill ? FIT_POLICY.FILL : isFit ? FIT_POLICY.FIT : FIT_POLICY.MANUAL,
                zoom_level: valueSlider * 100,
                alpla: "100",
                has_warning: "false"
            }
        }

        this.props.onChangeImageField(imageFieldObject, idLayout, idPage, idPageLayout);
    }

    onClickImageField() {
        const { isLogo, isLogoChanged, toggleShowCustomeLogoPopup } = this.props;
        if (isLogo && !isLogoChanged) {
            toggleShowCustomeLogoPopup();
            AppServices.trackCTEvent(CTEventFactory.instance.createCustomLogoUpgradeActivatedEvent(), null, null);
        } else {
            this.clickInside();
        }
    }

    render() {
        const { idLayout, idPage, idPageLayout, isLogoChanged, isLogo, sizeHeight, sizeWidth, positionX, positionY, unScaleNumber } = this.props;

        let style = { height: sizeHeight, width: sizeWidth };
        let rotateString = 'rotate(';
        let degString = 'deg)';
        let scaleString = ' scale(';
        let scaleValue = (isLogo && !isLogoChanged) ? 0.2 : this.state.valueSlider;
        let styleImage = {
            transform: rotateString + this.state.numRotate.toString() + degString + scaleString + scaleValue + ')'
        };

        let styleWrapper = {
            width: sizeWidth,
			height: sizeHeight,
            left: positionX,
            top: positionY,
            background: 'rgba(220, 240, 240, 0.2)'
        };

        let styleBorderTopBottom = { height: 12, width: sizeWidth };
        let styleBorderLeftRight = { height: sizeHeight - 24, width: 12 };
        let styleBoxImage = {
            height: this.state.isNull ? sizeHeight : 'auto',
            width: this.state.isNull ? sizeWidth : 'auto'
        };

        let stylePhotoEditControl = {
            transform: 'scale(' + unScaleNumber + ')'
        };

        let photoEditControl = <PhotoEditControl
            className="photo-edit-control"
            style={stylePhotoEditControl}
            handleFill={this.handleFill.bind(this)}
            handleFit={this.handleFit.bind(this)}
            handleRotate={this.handleRotate.bind(this)}
            handleInfo={this.handleInfo.bind(this)}
            handleRemove={this.handleRemove.bind(this)}
            handleChangeValueSlider={this.handleChangeValueSlider.bind(this)}
            scaleValue={getValueFromPhotoToZoomBar(this.state.valueSlider)}
            enable={this.state.imageSource}
            handleMouseUp={this.handleMouseUp.bind(this)}
            isEditLogo={isLogo && isLogoChanged}
            handleRevertLogo={this.props.toggleShowCustomeLogoPopup}
        />
        let keyBox = ' keyBoxImage---' + idLayout + '---' + idPage + '---' + idPageLayout;
        let clickedClass = this.state.isClickInside ? ' clicked-image' : '';

        return (
            <div
                id="imageFieldWrapper"
                className={"image-field-wrapper" + keyBox + clickedClass}
                style={styleWrapper}
                onClick={this.onClickImageField}
                onMouseMove={this.state.positionImage !== null ? this.setPositionNull.bind(this) : null}
            >
                <div className={(isLogo && !isLogoChanged) ? '' : !this.state.isClickInside ? "image-field-drag" + keyBox : "image-field-drag image-field-selected" + keyBox}
                    style={style}
                    onDrop={this.drop.bind(this)}
                    onWheel={this.state.isClickInside ? this.handleMouseWheel.bind(this) : null}
                >
                    <Draggable
                        onStart={() => this.state.isNull ? false : this.state.isClickInside}
                        key={this.props.key}
                        onStop={this.onStopDrag.bind(this)}
                        position={this.state.positionImage} >
                        <div className={"box-image" + keyBox} ref="box_image"
                            style={styleBoxImage}
                            draggable={!this.state.isClickInside}
                            onDragStart={this.state.isClickInside ? null : this.dragStart.bind(this)} >
                            <img
                                className={keyBox}
                                ref="myPhoto"
                                style={styleImage}
                                draggable={isLogo && !isLogoChanged ? false : !this.state.isClickInside}
                                src={this.state.imageSource ? this.state.imageSource.imageUrl : null}
                                alt=''
                            />
                        </div>
                    </Draggable>
                </div>
                {
                    //insert photo edit controller
                    this.state.isClickInside && photoEditControl
                }
                <div>
                    {
                        this.state.isShowInfo &&
                        <PhotoDetail
                            photo={this.state.imageSource}
                            onClose={this.handleCloseInfo.bind(this)}
                        >
                            <img src={this.state.imageSource.imageUrl} alt='error' />
                        </PhotoDetail>
                    }
                </div>
                {
                    !this.state.imageSource &&
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                        align={{
                            offset: [this.state.position.x, this.state.position.y],
                        }}
                        overlay={LocaleUtils.instance.translate('ImageContainerComponent.defaultPlaceholderTextResourceId')}>
                        <div className="image-field-placeholder" onMouseEnter={this.setPositionState}>
                            {
                                LocaleUtils.instance.translate('ImageContainerComponent.defaultPlaceholderTextResourceId')
                            }
                        </div>
                    </Tooltip>
                }
            </div>
        );
    }
}

ImageField.propTypes = {
    key: PropTypes.number,
    isLogo: PropTypes.boolean,
    sizeHeight: PropTypes.number,
    sizeWidth: PropTypes.number,
    positionX: PropTypes.number,
    positionY: PropTypes.number,
    idLayout: PropTypes.string,
    idPage: PropTypes.number,
    idPageLayout: PropTypes.string,
    onChangeImageField: PropTypes.func,
    onRemovePhotoInPage: PropTypes.func,
    toggleShowCustomeLogoPopup: PropTypes.func,
}

export default onClickOutsize(ImageField);
