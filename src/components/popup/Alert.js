import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './facebookPopup/FacebookPopup.css';
import Button, { colorType } from './../materials/button/Button';

export default class Alert extends Component {

    renderContent() {
      const { content } = this.props;
      return (
          <div className="fb-content-popup content-unsupported-image">{content}</div>
      );
    }

    renderButtons() {
        const { textBtn, onClickBtn } = this.props;
        if (textBtn) {
          return (
              <div className="fb-bottom-popup-zone">
                  <hr className="fb-divider-popup" />
                  <div className="fb-button-item-popup">
                      <Button className="fb-popup-button" type={colorType.blue} text={textBtn} onClick={onClickBtn} />
                  </div>
              </div>
          );
        }
        return;
    }

    render() {
        const { title } = this.props;
        const styles = {
            popup: {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }
        };
        return (
          <div className="fb-popup-wrapper">
                <div className="fb-popup-zone unsupported-image">
                  <div className="fb-top-popup-zone">
                      <div className="fb-popup-item">
                          <div className="fb-title-popup">
                              {title}
                          </div>
                          {this.renderContent()}
                      </div>
                  </div>
                  {this.renderButtons()}
              </div>
          </div>
        );
    }
}

Alert.propTypes = {
    title: PropTypes.string,
    content: PropTypes.any,
    textBtn: PropTypes.string,
    onClickBtn: PropTypes.func,
    attachedData: PropTypes.object
};
