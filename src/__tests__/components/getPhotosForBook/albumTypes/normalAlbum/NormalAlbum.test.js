import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import NormalAlbum from './../../../../../components/getPhotosForBook/albumTypes/normalAlbum/NormalAlbum';

describe('Test NormalAlbum Component', () => {
    let album = {
        name: 'album',
        photoIds: [],
        picUrls: ["http://airbnb.io/enzyme/docs/api/ShallowWrapper/children.html"],
    };
    let photoSelectedCount = 0; 
    let onClick;
    let normalAlbum;
    beforeEach(() => {
        onClick = jest.fn();
        normalAlbum = shallow(<NormalAlbum album={album} photoSelectedCount={photoSelectedCount} onClick={onClick}/>)
    })

    describe('NormalAlbum Snapshot', () => {
        it('NormalAlbum does not change UI', () => {
            const component = renderer.create(<NormalAlbum album={album} photoSelectedCount={photoSelectedCount} onClick={onClick}/>);
            const tree = component.toJSON();
            expect(tree).toMatchSnapshot();
        });
    });

    describe('NormalAlbum DOM renders', () => {
        
        it('Cotains div with className="album active" if photoSelectedCount > 0 ', () => {
            normalAlbum.setProps({ photoSelectedCount: 10 });
            expect(normalAlbum.find('.album .active').length).toEqual(1);

        }); 

        it('Cotains div with className="album" if photoSelectedCount = 0', () => {
            expect(normalAlbum.find('.album').length).toEqual(1);
        }); 

        describe('test renderCountPhotosSelected() return ', () => {
            it('Contain div with BadgeNotification if photoSelectedCount > 0 ', () => {
                normalAlbum.setProps({ photoSelectedCount: 10 });
                expect(normalAlbum.find('BadgeNotification').length).toEqual(1);
            });

            it(' Not Contain div with BadgeNotification if photoSelectedCount = 0 ', () => {
                normalAlbum.setProps({ photoSelectedCount: 0 });
                expect(normalAlbum.find('BadgeNotification').length).toEqual(0);
            });
        })

        describe('test renderInfo() return ',() => {
            it('renderInfo(), render album name', () => {
                expect(normalAlbum.find('p.name-album').length).toEqual(1);
                expect(normalAlbum.find('p.name-album').text()).toEqual(album.name);
            });
            
            it('renderInfo(), render amount of Photo', () => {
                expect(normalAlbum.find('p.amount-of-photo').length).toEqual(1);
                expect(normalAlbum.find('p.amount-of-photo').text()).toEqual(album.photoIds.length + ' photos');
            });
        });

        describe('test renderPicture() return ', () => {
            it('return div with className="preview-album-zone"', () => {
                expect(normalAlbum.find('.preview-album-zone').length).toEqual(1);
            })
            it('it contains <img/> with className="image-preview-album" tag', () => {
                expect(normalAlbum.find('img.image-preview-album').length).toEqual(1);
            })
        });

    })

    describe('NormalAlbum test funtion', () => {
        it('test onAlbumClick() will be dispatch onClick()', () => {
            normalAlbum.simulate('click');
            //normalAlbum.instance().onAlbumClick(album, onClick);
            expect(onClick.mock.calls.length).toBe(1);
            normalAlbum.simulate('click');
            expect(onClick.mock.calls.length).toBe(2);
        });
    })

});


