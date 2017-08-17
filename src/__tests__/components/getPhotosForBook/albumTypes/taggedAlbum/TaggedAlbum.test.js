import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import TaggedAlbum from './../../../../../components/getPhotosForBook/albumTypes/taggedAlbum/TaggedAlbum';

describe('Test TaggedAlbum Component', () => {
    let album = {
        name: 'album',
        photoIds: [],
        picUrls: ["http://airbnb.io/enzyme/docs/api/ShallowWrapper/children.html","http://airbnb.io/enzyme/docs/api/ShallowWrapper/children.html"],
    };
    let photoSelectedCount = 0; 
    let onClick;
    let taggedAlbum;
    beforeEach(() => {
        onClick = jest.fn();
        taggedAlbum = shallow(<TaggedAlbum album={album} photoSelectedCount={photoSelectedCount} onClick={onClick} />);
    })

    describe('TaggedAlbum Snapshot', () => {
        it('TaggedAlbum does not change UI ', () => {
            const component = renderer.create(<TaggedAlbum album={album} photoSelectedCount={photoSelectedCount} onClick={onClick} />);
            const tree = component.toJSON();
            expect(tree).toMatchSnapshot();
        });
    });

    describe('TaggedAlbum test DOM', () => {
        it('contains div with className=\"tagged-album\" ', () => {
            expect(taggedAlbum.find('div.tagged-album').length).toEqual(1);
            expect(taggedAlbum.find('div.tagged-album').text()).toEqual("Photos you are tagged ");
        })

        describe('test renderCountPhotosSelected() return', () => {
            it('return div element', () => {
                taggedAlbum.setProps({photoSelectedCount: 10});
                expect(taggedAlbum.find('div').first().text()).toEqual("10Photos you are tagged ");
            });
        });

        describe('test renderPictures() return', () => {
            it('return div element with className="preview-album-zone" ', () => {
                expect(taggedAlbum.find('.preview-album-zone').length).toEqual(1);
            });

            it('return div contains <img/> tag = picUrl.lenght param ', () => {
                expect(taggedAlbum.find('img.image-preview-tagged-album').length).toEqual(album.picUrls.length);
            });
        })
    });

    describe('TaggedAlbum test function', () => {
        it('TaggedAlbum dispatch onClick event when clicked', () => {
            taggedAlbum.simulate('click');
            expect(onClick.mock.calls.length).toEqual(1);
            taggedAlbum.simulate('click');
            expect(onClick.mock.calls.length).toEqual(2);
            taggedAlbum.simulate('click');
            expect(onClick.mock.calls.length).not.toEqual(4);
        })
    });



});