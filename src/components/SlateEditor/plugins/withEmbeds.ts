import { Transforms, Path, Node, Editor, Element } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomElement = Element & {
  type: string;
}

type CustomEditor = Editor & ReactEditor;

const withEmbeds = (editor: CustomEditor): CustomEditor => {
    const { isVoid, insertBreak } = editor;

    editor.isVoid = (element: Element): boolean => {
        const customElement = element as CustomElement;
        return ['video', 'image', 'htmlCode'].includes(customElement.type) ? true : isVoid(element);
    };

    editor.insertBreak = (...args: any[]): void => {
        if (!editor.selection) {
            insertBreak(...args);
            return;
        }

        const parentPath = Path.parent(editor.selection.focus.path);
        const parentNode = Node.get(editor, parentPath) as Element;
        
        if (editor.isVoid(parentNode)) {
            const nextPath = Path.next(parentPath);
            Transforms.insertNodes(
                editor,
                {
                    type: 'paragraph',
                    children: [{ text: '' }]
                },
                {
                    at: nextPath,
                    select: true // Focus on this node once inserted
                }
            );
        } else {
            insertBreak(...args);
        }
    };

    return editor;
};

export default withEmbeds;