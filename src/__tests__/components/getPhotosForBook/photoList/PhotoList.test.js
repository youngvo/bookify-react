import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import PhotoList from './../../../../components/getPhotosForBook/photoList/PhotoList';
//import PhotoCell from './../../../../components/getPhotosForBook/photoCell/PhotoCell';
describe('test PhotoList component', () => {
    const photo = {
            id: '',
            name: '',
            picUrl: '',
            imageUrl: '',
            width: 0,
            height: 0,
            createdTime: '',
            updatedTime: '',
            albumId: ''
        };
    let photos = [{id:1}, {id:2}];
    let posX, posY, scaleX, scaleY ; 
    let onPhotoCellClick;
    let photoList;
    beforeEach(() => {
        onPhotoCellClick = jest.fn();
        photoList = shallow(<PhotoList photos={photos} onPhotoCellClick={onPhotoCellClick} />);
    });

    describe('PhotoList snapshot', () => {
        it('PhotoList does not change layout', () => {
            const component = renderer.create(<PhotoList photos={photos} onPhotoCellClick={onPhotoCellClick} />);
            const tree = component.toJSON();
            expect(tree).toMatchSnapshot();
        });
    });

    describe('PhotoList DOM test', () => {

        it('PhotoList contains div with className="photo-list-content"', () => {
            expect(photoList.find('div.photo-list-content').length).toEqual(1);
        });

        it('renderPhotoList return right', () => {
            expect(photoList.find('PhotoCell').length).toEqual(2);
        })
    })
});