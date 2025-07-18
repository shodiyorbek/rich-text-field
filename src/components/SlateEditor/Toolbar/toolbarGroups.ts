interface DropdownOption {
    text: string;
    value: string;
}

interface ToolbarItem {
    id: number;
    format?: string;
    type: 'dropdown' | 'font-size' | 'mark' | 'color-picker' | 'block' | 'link' | 'embed' | 'table';
    options?: DropdownOption[];
}

type ToolbarGroup = ToolbarItem[];
type ToolbarGroups = ToolbarGroup[];

const toolbarGroups: ToolbarGroups = [
    [
        {
            id: 1,
            format: 'fontFamily',
            type: 'dropdown',
            options: [
                { text: 'Sans Serif', value: 'sans' },
                { text: 'Serif', value: 'serif' },
                { text: 'MonoSpace', value: 'monospace' }
            ]
        },
        {
            id: 2,
            format: 'fontSize',
            type: 'font-size'
        }
    ],
    [
        {
            id: 3,
            format: 'bold',
            type: 'mark',
        },
        {
            id: 4,
            format: 'italic',
            type: 'mark',
        },
        {
            id: 5,
            format: 'underline',
            type: 'mark',
        },
        {
            id: 6,
            format: 'strikethrough',
            type: 'mark',
        },
    ],
    [
        {
            id: 7,
            format: 'color',
            type: 'color-picker',
        },
        {
            id: 8,
            format: 'bgColor',
            type: 'color-picker',
        }
    ],
    [
        {
            id: 9,
            format: 'superscript',
            type: 'mark',
        },
        {
            id: 10,
            format: 'subscript',
            type: 'mark',
        },
    ],
    [
        {
            id: 11,
            format: 'headingOne',
            type: 'block',
        },
        {
            id: 12,
            format: 'headingTwo',
            type: 'block',
        },
        {
            id: 13,
            format: 'headingThree',
            type: 'block',
        },
        {
            id: 14,
            format: 'blockquote',
            type: 'block',
        },
    ],
    [
        {
            id: 15,
            format: 'orderedList',
            type: 'block'
        },
        {
            id: 16,
            format: 'unorderedList',
            type: 'block'
        }
    ],
    [
        {
            id: 17,
            format: 'alignLeft',
            type: 'block'
        },
        {
            id: 18,
            format: 'alignCenter',
            type: 'block'
        },
        {
            id: 19,
            format: 'alignRight',
            type: 'block'
        },
        {
            id: 77,
            format: 'justify',
            type: 'block'
        }
    ],
    [
        {
            id: 20,
            format: 'link',
            type: 'link',
        },
        {
            id: 21,
            format: 'image',
            type: 'embed'
        },
        {
            id: 22,
            format: 'video',
            type: 'embed'
        },
        {
            id: 23,
            type: 'table'
        }
    ]
];

export default toolbarGroups;
export type { ToolbarItem, ToolbarGroup, ToolbarGroups, DropdownOption };