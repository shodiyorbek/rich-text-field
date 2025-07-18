import { Transforms, Element, Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import { createParagraph } from './paragraph';

interface EmbedData {
    url: string;
    alt?: string;
}

interface EmbedElement extends Element {
    type: string;
    alt?: string;
    url: string;
    children: Array<{ text: string }>;
}

type CustomEditor = Editor & ReactEditor;

export const createEmbedNode = (type: string, { url, alt }: EmbedData): EmbedElement => ({
    type,
    alt,
    url,
    children: [{ text: "" }]
});

export const insertEmbed = (editor: CustomEditor, embedData: EmbedData, format: string): void => {
    const { url } = embedData;
    if (!url) return;
    
    const embed = createEmbedNode(format, embedData);
    
    Transforms.insertNodes(editor, embed, { select: true });
    Transforms.insertNodes(editor, createParagraph(""));
};