import { Editor, Transforms, Path, Range, Element } from 'slate';
import { ReactEditor } from 'slate-react';

interface LinkElement extends Element {
    type: 'link';
    href: string;
    target: '_blank' | '_self';
    children: Array<{ text: string }>;
}

interface InsertLinkOptions {
    url: string;
    showInNewTab: boolean;
}

type CustomElement = Element & {
    type: string;
}

type CustomEditor = Editor & ReactEditor;

export const createLinkNode = (href: string, showInNewTab: boolean, text: string): LinkElement => ({
    type: 'link',
    href,
    target: showInNewTab ? '_blank' : '_self',
    children: [{ text }]
});

export const insertLink = (editor: CustomEditor, { url, showInNewTab }: InsertLinkOptions): void => {
    if (!url) return;

    const { selection } = editor;
    const link = createLinkNode(url, showInNewTab, 'Link');
    
    if (!!selection) {
        const [parent, parentPath] = Editor.parent(editor, selection.focus.path);
        const customParent = parent as CustomElement;
        
        if (customParent.type === 'link') {
            removeLink(editor);
        }

        if (editor.isVoid(parent)) {
            Transforms.insertNodes(editor,
                { type: 'paragraph', children: [link] },
                {
                    at: Path.next(parentPath),
                    select: true
                }
            );
        }
        else if (Range.isCollapsed(selection)) {
            Transforms.insertNodes(editor, link, { select: true });
        }
        else {
            Transforms.wrapNodes(editor, link,
                { split: true }
            );
        }
    }
    else {
        Transforms.insertNodes(editor, { type: 'paragraph', children: [link] });
    }
};

export const removeLink = (editor: CustomEditor): void => {
    Transforms.unwrapNodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'link'
    });
};