import { useEffect, useState } from 'react';
import { Editor, Element } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomEditor = Editor & ReactEditor;
type CustomElement = Element & {
    type: string;
}

// This hook returns if the node in the current selection matches the format passed to it.
const useFormat = (editor: CustomEditor, format: string): boolean => {
    const [isFormat, setIsFormat] = useState<boolean>(false);
    
    useEffect(() => {
        if (editor.selection) {
            // It matches at the editor.selection location by default, so if null handle it separately.
            const [node] = Editor.nodes(editor, {
                match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === format
            });
            
            setIsFormat(!!node);
        }
        else {
            setIsFormat(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor.selection]);

    return isFormat;
};

export default useFormat;