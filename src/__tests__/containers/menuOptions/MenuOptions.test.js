import { shallow, mount, render } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import LocaleUtils from './../../../utils/LocaleUtils'
import MenuOptionsContainer, {MenuOptions} from './../../../containers/menuOptions/MenuOptions';
import configureStore from 'redux-mock-store';
import {
    SHOW_CHANGE_BOOK_DESIGN,
    SHOW_CHANGE_ORDER_LAYOUT_SCREEN,
    SHOW_PREVIEW_BOOK,
} from './../../../actions/appStatusActions/RootStatusActions';
import {
    SHOW_MENU_MAIN,
} from './../../../actions/appStatusActions/BookDesignHeaderStatusActions';

const mockStore = configureStore();
let state = {
    photoList: {}
};
describe('MenuOptions Container', () => {
    let wrapper, store;

    beforeEach(() =>{
        store = mockStore(state);
        store.dispatch = jest.fn();
        wrapper = shallow(<MenuOptionsContainer store={store}/>);
    });

    it('maps state and dispatch to props', () => {
        expect(wrapper.props()).toEqual(expect.objectContaining({
            photoList: expect.any(Object),
            onClose:                expect.any(Function),
            onChangeDesignClick:    expect.any(Function),
            onAutoCreateClick:      expect.any(Function),
            onPreviewBookClick:     expect.any(Function),
            onFinishClick:          expect.any(Function),
        }));
    });

    describe('Test mapDispatchToProps()', () => {

        it('maps onClose to dispatch toggleMenuOptions action', () => {
            wrapper.props().onClose();
            expect(store.dispatch).toHaveBeenCalledWith({type: SHOW_MENU_MAIN});
        });

        it('maps onChangeDesignClick to dispatch showChangeBookDesign action', () => {
                wrapper.props().onChangeDesignClick();
                expect(store.dispatch).toHaveBeenCalledWith({type: SHOW_CHANGE_BOOK_DESIGN});
        });

        it('maps onAutoCreateClick to dispatch showChangeOrderLayoutScreen action', () => {
                wrapper.props().onAutoCreateClick();
                expect(store.dispatch).toHaveBeenCalledWith({type: SHOW_CHANGE_ORDER_LAYOUT_SCREEN});
        });

        it('maps onPreviewBookClick to dispatch showPreviewBook action', () => {
                wrapper.props().onPreviewBookClick();
                expect(store.dispatch).toHaveBeenCalledWith({type: SHOW_PREVIEW_BOOK});
        });

        it('maps onFinishClick to dispatch onClose action', () => {
                wrapper.props().onFinishClick();
                expect(store.dispatch).toHaveBeenCalledWith({type: SHOW_MENU_MAIN});
        });
    });

});

describe('test MenuOptions component', () => {
    let menuOptions;
    let photoList = {};
    let onClose;
    beforeEach(() => {
        onClose = jest.fn();
        menuOptions = shallow(<MenuOptions onClose={onClose} photoList={photoList}/>);
    });

    it('MenuOptions Snapshot', () => {
        const comp = renderer.create(<MenuOptions onClose={onClose} photoList={photoList}/>)
        const tree = comp.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('have <div  className="main-menu-component"/>', () => {
        expect(menuOptions.find('div').first().hasClass('main-menu-component')).toBe(true);
        expect(menuOptions.find('.main-menu-component').length).toEqual(1);
    });

    it('have <div  className="triangle-on-menu"/>', () => {
        expect(menuOptions.find('.triangle-on-menu').length).toEqual(1);
    });

    it('have <div  className="main-menu-zone"/>', () => {
        expect(menuOptions.find('.main-menu-zone').length).toEqual(1);
    });

    describe('Test RenderIconButton()', () => {
        it('have className="close-main-menu"/>', () => {
            expect(menuOptions.find('IconButton.close-main-menu').length).toEqual(1);
        });

        it('have dispatch event by Click', () => {
            menuOptions.find('IconButton').simulate('click');
            expect(onClose.mock.calls.length).toEqual(1);
            menuOptions.find('IconButton').simulate('click');
            expect(onClose.mock.calls.length).toEqual(2);
        });
    });

    describe('Test renderMenuOptionsRight()', () => {
        it('have <div className="menu-item-zone menu-item-right">', () => {
            expect(menuOptions.find('.menu-item-zone .menu-item-right').length).toEqual(1);
        });

        it('have <p className="title-text"/>', () => {
            console.log(menuOptions.find('.title-text').last().text());
            expect(menuOptions.find('.menu-item-zone .menu-item-right .title-text').length).toEqual(1);
            expect(menuOptions.find('.menu-item-zone .menu-item-right .title-text').text()).toEqual(LocaleUtils.instance.translate('blurb.com'));
        });

        it('have <div className="sd">', () => {
            expect(menuOptions.find('.menu-item-zone .menu-item-right .sd').length).toEqual(1);
        });

        it('have <LinkText/>', () => {
            expect(menuOptions.find('.menu-item-zone .menu-item-right LinkText').length).toEqual(5);
        });

        it('have dispatch event by LinkText onClick', () => {
            menuOptions.find('.menu-item-zone .menu-item-right LinkText').first().simulate('click');
            expect(onClose.mock.calls.length).toEqual(1);
            menuOptions.find('.menu-item-zone .menu-item-right LinkText').first().simulate('click');
            expect(onClose.mock.calls.length).toEqual(2);
        });

    });

    describe('Test renderMenuOptionsLeft()', () => {
        it('have <div className="menu-item-zone menu-item-left">', () => {
            expect(menuOptions.find('.menu-item-zone .menu-item-left').length).toEqual(1);
        });

        it('have <p className="title-text"/>', () => {
            //console.log(menuOptions.find('.title-text').last().text());
            expect(menuOptions.find('.menu-item-zone .menu-item-left .title-text').length).toEqual(1);
            expect(menuOptions.find('.menu-item-zone .menu-item-left .title-text').text()).toEqual(LocaleUtils.instance.translate('default_book_title'));
        });

        it('have <div className="sd">', () => {
            expect(menuOptions.find('.menu-item-zone .menu-item-left .sd').length).toEqual(2);
        });

        it('have <LinkText/>', () => {
            expect(menuOptions.find('.menu-item-zone .menu-item-left LinkText').length).toEqual(4);
        });

        it('have dispatch event by LinkText onClick', () => {
            let onChangeDesignClick = jest.fn();
            let onAutoCreateClick = jest.fn();
            let onPreviewBookClick = jest.fn();
            let onFinishClick = jest.fn();
            menuOptions.setProps({onChangeDesignClick, onAutoCreateClick, onFinishClick, onPreviewBookClick});
            
            menuOptions.find('.menu-item-zone .menu-item-left LinkText').first().simulate('click');
            expect(onChangeDesignClick.mock.calls.length).toEqual(1);
            
            menuOptions.find('.menu-item-zone .menu-item-left LinkText').at(1).simulate('click');
            expect(onAutoCreateClick.mock.calls.length).toEqual(1);
            
            menuOptions.find('.menu-item-zone .menu-item-left LinkText').at(2).simulate('click');
            expect(onPreviewBookClick.mock.calls.length).toEqual(1);
            
            menuOptions.find('.menu-item-zone .menu-item-left LinkText').last().simulate('click');
            expect(onFinishClick.mock.calls.length).toEqual(1);
        });

    });

});
