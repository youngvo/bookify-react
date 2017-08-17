import React, { Component }  from 'react';
import PropTypes from 'prop-types';

import './Pagination.css';
import IconButton   from '../../materials/iconButton/IconButton';
import Assets     from './../../../assets/Assets';
import PageItem     from './pageItem/PageItem';

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            positionOfListPage: 0,
            isMinimize: false,
            currentPage: props.currentPage
        }

        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.reRenderPagination = this.reRenderPagination.bind(this);
    }

    onHidePagination() {
        this.setState({
            isMinimize: !this.state.isMinimize
        })
    }

    reRenderPagination(currentPage) {
        let positionOfCurrentPage = (currentPage + 4) / 2 * 68;           //68 is width of the PageItem -- (currentPage + 4) / 2: position of PageItem
        let positonEnd = (positionOfCurrentPage - this.refs.list_page_zone.offsetWidth);
        if (positonEnd >= 0) {
            this.setState({ positionOfListPage: -positonEnd });
        } else {
            this.setState({ positionOfListPage: 0 });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentPage != this.state.currentPage) {
            this.reRenderPagination(nextProps.currentPage);
        }
    }

    renderOnePage() {
        const { amountPage, currentPage } = this.props;
        let pageType = (currentPage < 0 || currentPage > amountPage) ? PageItem.pageTypes.cover : PageItem.pageTypes.page;

        return (
            <div className='list-page-hide'>
                <PageItem
                    pageType={pageType}
                    numPage={currentPage}
                    currentChoosingPage={currentPage}
                />
            </div>
        );
    }

    renderPages() {
        const { currentPage, amountPage, onClickChoosePage } = this.props;
        let pages = [];
        let newAmountPage = amountPage + 2;

        //add front-cover page
        pages.push(
            <PageItem
                key={"front-cover"}
                numPage={-1}
                onClick={onClickChoosePage}
                pageType={PageItem.pageTypes.cover}
                currentChoosingPage={currentPage}
            />
        );
        //add pages content
        for (let i = 0; i < newAmountPage; i = i + 2) {
            pages.push(
                <PageItem
                    key={i}
                    numPage={i}
                    onClick={onClickChoosePage}
                    pageType={PageItem.pageTypes.page}
                    currentChoosingPage={currentPage}
                    isEmptyPage={i === amountPage}
                />
            );
        }

        //add back-cover page
        pages.push(
            <PageItem
                key={"back-cover"}
                numPage={amountPage + 2}
                onClick={onClickChoosePage}
                pageType={PageItem.pageTypes.cover}
                currentChoosingPage={currentPage}
            />
        );

        let styleOfListPage = {
            transform: 'translate(' + this.state.positionOfListPage + 'px,0)'
        }

        // pages.map
        return (
            <div className="list-page-zone" ref="list_page_zone">
                <div className="list-page" ref="list_page" style={styleOfListPage}>
                    {pages}
                </div>
            </div>
        );
    };

    renderMinimizeMode() {
        return (
            <div className='pagination-zone pagination-zone-hide'>
                {
                    this.renderOnePage()
                }
                <div className='unhide-button'>
                    <IconButton
                        onClick={this.onHidePagination.bind(this)}
                        type={IconButton.type.arrowPagination}
                        className='icon-DoubleArrowRight hide-arrow'
                    />
                </div>
            </div>
        );
    };

    previous() {
        if (this.state.positionOfListPage < 0) {
            let nextPositon = this.state.positionOfListPage + this.refs.list_page_zone.offsetWidth;
            if (nextPositon > 0) {
                this.setState({
                    positionOfListPage: 0
                });
            } else {
                this.setState({
                    positionOfListPage: this.state.positionOfListPage + this.refs.list_page_zone.offsetWidth
                });
            }
        } else {
            this.setState({
                positionOfListPage: 0
            });
        }
    };

    next() {
        let positonEnd = - (this.refs.list_page.offsetWidth - this.refs.list_page_zone.offsetWidth);

        if (this.state.positionOfListPage * (-1) < this.refs.list_page.offsetWidth && positonEnd < 0) {
            let nextPositon = this.state.positionOfListPage - this.refs.list_page_zone.offsetWidth;
            if (this.refs.list_page_zone.offsetWidth > -1 * positonEnd) {
                this.setState({
                    positionOfListPage: positonEnd
                });
            }
            else if (nextPositon < positonEnd) {
                this.setState({
                    positionOfListPage: positonEnd
                });
            } else {
                this.setState({
                    positionOfListPage: this.state.positionOfListPage - this.refs.list_page_zone.offsetWidth
                });
            }
        }
    }

    renderFullMode() {
        return (
            <div className='pagination-zone pagination-zone-show'>
                <div className='left-button'>
                    <IconButton
                        onClick={this.previous}
                        type={IconButton.type.arrowPagination}
                        className="icon-ArrowLeft left-arrow"
                    />

                </div>
                {
                    this.renderPages()
                }
                <div className='right-button'>
                    <IconButton
                        onClick={this.next}
                        type={IconButton.type.arrowPagination}
                        className='icon-ArrowRight right-arrow'
                    />
                </div>
                <div className='hide-button'>
                    <IconButton
                        onClick={this.onHidePagination.bind(this)}
                        type={IconButton.type.arrowPagination}
                        className='icon-DoubleArrowLeft hide-arrow'
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            this.state.isMinimize ? this.renderMinimizeMode() : this.renderFullMode()
        );
    };
}

Pagination.propTypes = {
    amountPage: PropTypes.numPage,
    currentPage: PropTypes.numPage,
    onClickChoosePage: PropTypes.func,
}

export default Pagination;
