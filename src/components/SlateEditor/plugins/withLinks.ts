import { Editor, Element } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomElement = Element & {
    type: string;
}

type CustomEditor = Editor & ReactEditor;

const withLinks = (editor: CustomEditor): CustomEditor => {
    const { isInline } = editor;
    
    editor.isInline = (element: Element): boolean => {
        const customElement = element as CustomElement;
        return customElement.type === 'link' ? true : isInline(element);
    };
    
    return editor;
};

export default withLinks;