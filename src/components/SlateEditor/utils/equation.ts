import { Transforms, Range, Element, Editor } from "slate";
import { ReactEditor } from 'slate-react';

interface EquationElement extends Element {
    type: 'equation';
    inline: boolean;
    math: string;
    children: Array<{ text: string }>;
}

type CustomEditor = Editor & ReactEditor;

const createEquationNode = (math: string, inline: boolean): EquationElement => ({
    type: 'equation',
    inline,
    math,
    children: [{ text: '' }]
});

export const insertEquation = (editor: CustomEditor, math: string, inline: boolean): void => {
    const equation = createEquationNode(math, inline);

    const { selection } = editor;
    if (!!selection) {
        if (Range.isExpanded(selection)) {
            Transforms.collapse(editor, { edge: 'end' });
        }

        Transforms.insertNodes(editor, equation, { select: true });
    }
};