import { Element } from 'slate';

interface ParagraphElement extends Element {
    type: 'paragraph';
    children: Array<{ text: string }>;
}

export const createParagraph = (text: string): ParagraphElement => ({
    type: 'paragraph',
    children: [{ text }]
});