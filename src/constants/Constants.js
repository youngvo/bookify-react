export const version = {
    appName: 'Avatar',
    majorRevision: '1',
    minorRevision: '1',
    branchName: 'Bookify-March-23-Release-Candidate',
    commitId: 'fatal: Needed a single revision',
    buildDateTime: '201703230606',
    buildNumber: '25',
    buildJobName: 'Bookify-Local-Profile',
};

version.appVersion = version.majorRevision + '.' + version.minorRevision + '.' + version.buildNumber;

export const bookFormats = {
    SQUARE:             'square',
    PORTRAIT:           'standard_portrait',
    LANDSCAPE:          'standard_landscape',
    LARGE_LANDSCAPE:    'large_landscape',
    LARGE_SQUARE:       'large_square',
    TRADE:              'trade',
    POCKET:             'pocket'
};

export const trimSizes = {
    SQUARE:             { 
        type: "square",
        width: 495,
        height: 495,
        sizeDescription: "7x7",
        coverTrims: {
            softcover:  {
                coverType: "softcover",
                size: { width: 495, height: 495 },
                spineSize: { width: 495, height: 33 }
            },
            imagewrap:  {
                coverType: "imagewrap",
                size: { width: 534, height: 549 },
                spineSize: { width: 549, height: 33 }
            },
            dustjacket:  {
                coverType: "dustjacket",
                size: { width: 534, height: 513 },
                spineSize: { width: 513, height: 33 },
                flapSize: { width: 241, height: 513 }
            }
        }
    },
    PORTRAIT:           {
        type: "standard_portrait",
        width: 567,
        height: 720,
        sizeDescription: "8x10",
        coverTrims: {
            softcover:  {
                coverType: "softcover",
                size: { width: 567, height: 720 },
                spineSize: { width: 720, height: 33 }
            },
            imagewrap:  {
                coverType: "imagewrap",
                size: { width: 606, height: 774 },
                spineSize: { width: 774, height: 33 }
            },
            dustjacket:  {
                coverType: "dustjacket",
                size: { width: 606, height: 738 },
                spineSize: { width: 738, height: 33 },
                flapSize: { width: 303, height: 738 }
            }
        }
    },
    LANDSCAPE:          {
        type: "standard_landscape",
        width: 693,
        height: 594,
        sizeDescription: "10x8",
        coverTrims: {
            softcover:  {
                coverType: "softcover",
                size: { width: 693, height: 594 },
                spineSize: { width: 594, height: 33 }
            },
            imagewrap:  {
                coverType: "imagewrap",
                size: { width: 734, height: 648 },
                spineSize: { width: 648, height: 33 }
            },
            dustjacket:  {
                coverType: "dustjacket",
                size: { width: 734, height: 612 },
                spineSize: { width: 612, height: 33 },
                flapSize: { width: 302, height: 612 }
            }
        }
    },
    LARGE_LANDSCAPE:    {
        type: "large_landscape",
        width: 909,
        height: 783,
        sizeDescription: "13x11",
        coverTrims: {
            // soft cover is not supported
            imagewrap:  {
                coverType: "imagewrap",
                size: { width: 949, height: 837 },
                spineSize: { width: 837, height: 33 }
            },
            dustjacket:  {
                coverType: "dustjacket",
                size: { width: 949, height: 801 },
                spineSize: { width: 801, height: 33 },
                flapSize: { width: 303, height: 801 }
            }
        }
    },
    LARGE_SQUARE:       {
        type: "large_square",
        width: 855,
        height: 864, 
        sizeDescription: "12x12",
        coverTrims: {
            // soft cover is not supported
            imagewrap:  {
                coverType: "imagewrap",
                size: { width: 889, height: 918 },
                spineSize: { width: 918, height: 33 }
            },
            dustjacket:  {
                coverType: "dustjacket",
                size: { width: 889, height: 882 },
                spineSize: { width: 882, height: 33 },
                flapSize: { width: 292, height: 882 }
            }
        }
    },
    TRADE:              {
        type: "trade",
        width: 441,
        height: 666,
        sizeDescription: "6x9",
        coverTrims: {
            softcover:  {
                coverType: "softcover",
                size: { width: 441, height: 666 },
                spineSize: { width: 666, height: 9 }
            },
            imagewrap:  {
                coverType: "imagewrap",
                size: { width: 464, height: 720 },
                spineSize: { width: 720, height: 33 }
            },
            dustjacket:  {
                coverType: "dustjacket",
                size: { width: 464, height: 684 },
                spineSize: { width: 684, height: 33 },
                flapSize: { width: 272, height: 684 }
            }
        }
    },
    POCKET:             {
        type: "pocket",
        width: 369,
        height: 594,
        sizeDescription: "5x8",
        coverTrims: {
            softcover:  {
                coverType: "softcover",
                size: { width: 369, height: 576 },
                spineSize: { width: 594, height: 9 }
            },
            imagewrap:  {
                coverType: "imagewrap",
                size: { width: 409, height: 648 },
                spineSize: { width: 648, height: 33 }
            },
            dustjacket:  {
                coverType: "dustjacket",
                size: { width: 409, height: 612 },
                spineSize: { width: 612, height: 33 },
                flapSize: { width: 272, height: 612 }
            }
        }
    }
};

export const metadataConstants = {
    PROJECT_ID:'projectid',
    QUERY:'query',

    SOURCENAME_BOOKIFY: 'bookify',
    SOURCENAME_MSWORDPLUGIN: 'Word Plugin'
};

export const bffVersion = {
    version: '1.0',
    version_withLineWrapMarkers: '1.0_lw'
};

export const themesOriginal = {
    VIEW_FINDER: 'blurb.viewfinder',
    DARK_ROOM: 'blurb.darkroom',
    GIRLIE: 'blurb.girlie',
    ELEGANT: 'blurb.elegant'
};

export const photoTypes = {
    FACEBOOK: "facebook",
    INSTAGRAM: "instagram",
    SMUGSMUG: "smugSmug",
    PX500: "500px",
    FLICKR: "flickr",
    PICASA: "picasa",
    COMPUTER: "computer",
}

export const showTypes = {
    SHOW_ALL_PHOTOS: "show all photos",
    SHOW_PHOTOS_USED: "show photos are used",
    SHOW_PHOTOS_NOT_USED: "show photos are not used"
};

export const sortingTypes = {
    MY_SORTING: "My sorting",
    OLDEST_DATE: "Oldest date",
    RECENT_DATE: "Recent date",
    FILE_NAME_AZ: "Filename AZ"
};


export const photoOrderTypes = {
    NEWEST_FIRST: 'order_photos_by_newest_first',
    OLDEST_FIRST: 'order_photos_by_oldest_first',
    FILENAME: 'order_photos_by_filename',
    MANUAL: 'order_photos_by_manual'
};

export const validThemes = [
    'blurb.viewfinder',
    'blurb.elegant',
    'blurb.girlie',
    'blurb.darkroom'
];

//will edit layout's name later
export const photoLayoutTypes = {
    layout_type_1: 'layout_type_1',
    layout_type_2: 'layout_type_2',
    layout_type_3: 'layout_type_3',
    layout_type_4: 'layout_type_4'
};

export const FIELD_TYPE = {
    IMAGE:  "ImageContainer",
    LOCK_IMAGE: "LockedImageContainer",
    TEXT:   "TextContainer"
}

export const FIT_POLICY = {
    FIT: 'fit',
    FILL: 'fill',
    PORTRAIT_FILL: 'portrait_fill',
    MANUAL: 'manual',
    MAXIMIZE: 'maximize'
}

export const COVER_SECTION = {
    FRONT_FLAP: "frontFlap",
    BACK_FLAP: "backFlap",
    FRONT_COVER: "frontCover",
    BACK_COVER: "backCover",
    SPINE: "spine"
}

export const COVER_TYPE = {
    HARDCOVER_IMAGEWRAP: "imagewrap",
    HARDCOVER_DUST_JACKET: "dustjacket",
    SOFTCOVER: "softcover"
}

export const LEFT_TRIM_PERCENT_WIDTH = 0.073033707865;
export const TOP_TRIM_PERCENT_HEIGHT = 0.035087719298;

export const LAYOUT_TYPE_TEXT_MISC = {
    BLANK: 'blank',
    COPYRIGHT: 'copyright',
    TEXT_ONLY: 'text_only',
    TITLE: 'title',
    TWO_COLUMNS: 'two_column',
    THREE_COLUMNS: 'three_column',
    LOGO: 'logo',
    CHAPTER: 'chapter'
}

export const FRONT_COVER_TYPES = {
    DUST_JACKET: 'dustjacket',
    IMAGE_WRAP: 'imagewrap',
    SOFT_COVER:'softcover'
}