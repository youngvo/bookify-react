import React from 'react';
import PhotoCell from './../../../../components/getPhotosForBook/photoCell/PhotoCell';
import renderer from 'react-test-renderer';
import { shallow, mount, render } from 'enzyme';

describe('Test PhotoCell component', () => {
    let onClick;
    let photo;
    let photoCell;

    beforeEach(() => {
        onClick = jest.fn();
        photo = {
                    isSelected: false,
                    picUrl: '',
                };

        photoCell = shallow(<PhotoCell onClick={onClick} photo={photo}/>);
    });

    describe('PhotoCell snapshot', () => {
        it('PhotoCell render right', () => {
            const component = renderer.create(<PhotoCell onClick={onClick} photo={photo}/>);
            const tree = component.toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
    // describe('PhotoCell state', () => {
    //     it('PhotoCell local State', () => {
    //         expect(photoCell.instance().state.isHovering).toEqual(false);
    //         expect(photoCell.instance().state.isOpenPhotoDetail).toEqual(false);
    //     })
    // });

    describe('PhotoCell renders', () => {
        it('render button', () => {
            const button = photoCell.find('button').first();
            expect(button).toBeDefined();
            expect(button.text()).toBe('View');
        });

        it('render image', () => {
            const img = photoCell.find('img').first();
            expect(img).toBeDefined();
        });

        it('render picture', () => {
            expect(photoCell.find('preview-photo')).toBeDefined();
        })

    });

    describe('PhotoCell functions', () => {
        it('PhotoCell onHover()', () => {
            photoCell.instance().onHover();
            expect(photoCell.instance().state.isHovering).not.toEqual(false);
            photoCell.instance().onHover();
            expect(photoCell.instance().state.isHovering).toEqual(false);
        });

        it('PhotoCell closePhotoDetail()', () => {
            photoCell.instance().closePhotoDetail();
            expect(photoCell.instance().state.isOpenPhotoDetail).toEqual(false);
        });

        it('PhotoCell showPhotoDetail()', () => {
            photoCell.instance().showPhotoDetail();
            expect(photoCell.instance().state.isOpenPhotoDetail).toEqual(true);
        });

        it('PhotoCell canClick', () => {
            let onClick = true;
            let result = photoCell.instance().canClick(onClick);
            expect(result).toEqual(true);
            onClick = false;
            result = photoCell.instance().canClick(onClick);
            expect(result).not.toEqual(true);
        });

        it('PhotoCell onPhotoClick()', () => {  
            let isSelected = true;
            photoCell.instance().onPhotoClick(photo, onClick);
            expect(onClick.mock.calls.length).not.toBe(2);
        });

    });


})










































