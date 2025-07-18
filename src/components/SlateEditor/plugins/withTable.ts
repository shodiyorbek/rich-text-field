import { Editor, Range, Point, Element } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomElement = Element & {
    type: string;
}

type CustomEditor = Editor & ReactEditor;

const withTable = (editor: CustomEditor): CustomEditor => {
    const { deleteBackward, deleteForward, insertBreak } = editor;

    editor.deleteBackward = (unit: any): void => {
        const { selection } = editor;
        if (selection) {
            const [cell] = Editor.nodes(editor, {
                match: n =>
                    !Editor.isEditor(n) &&
                    Element.isElement(n) &&
                    (n as CustomElement).type === 'table-cell',
            });

            const prevNodePath = Editor.before(editor, selection);

            const [tableNode] = prevNodePath ? Editor.nodes(editor, {
                at: prevNodePath,
                match: n => !Editor.isEditor(n) && 
                    Element.isElement(n) && 
                    (n as CustomElement).type === 'table-cell'
            }) : [];

            if (cell) {
                const [, cellPath] = cell;
                const start = Editor.start(editor, cellPath);
                if (Point.equals(selection.anchor, start)) {
                    return;
                }
            }
            if (!cell && tableNode) {
                return;
            }
        }

        deleteBackward(unit);
    };

    editor.deleteForward = (unit: any): void => {
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: n =>
                    !Editor.isEditor(n) &&
                    Element.isElement(n) &&
                    (n as CustomElement).type === 'table-cell',
            });

            const prevNodePath = Editor.after(editor, selection);
            const [tableNode] = prevNodePath ? Editor.nodes(editor, {
                at: prevNodePath,
                match: n => !Editor.isEditor(n) && 
                    Element.isElement(n) && 
                    (n as CustomElement).type === 'table-cell'
            }) : [];

            if (cell) {
                const [, cellPath] = cell;
                const end = Editor.end(editor, cellPath);

                if (Point.equals(selection.anchor, end)) {
                    return;
                }
            }
            if (!cell && tableNode) {
                return;
            }
        }

        deleteForward(unit);
    };

    return editor;
};

export default withTable;