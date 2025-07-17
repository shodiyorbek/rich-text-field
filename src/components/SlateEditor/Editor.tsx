'use client'

import React, { useCallback, useMemo, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from "slate-history";
import { Slate, Editable, withReact, ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';
import Toolbar from './Toolbar/Toolbar'
import { getMarked, getBlock } from './utils/SlateUtilityFunctions.js'
import withLinks from './plugins/withLinks.js'
import withTables from './plugins/withTable.js'
import withEmbeds from './plugins/withEmbeds.js'
import withEquation from './plugins/withEquation.js'
import './Editor.css'
import CodeToText from './Elements/CodeToText/CodeToText'
import { serialize } from './utils/serializer';

// Memoized components to prevent unnecessary re-renders
const Element = React.memo((props: RenderElementProps) => {
    return getBlock(props);
});
Element.displayName = 'Element';

const Leaf = React.memo(({ attributes, children, leaf }: RenderLeafProps) => {
    const markedChildren = getMarked(leaf, children);
    return <span {...attributes}>{markedChildren}</span>;
});
Leaf.displayName = 'Leaf';
const SlateEditor = () => {
    // Create editor instance once and keep it stable
    const editor = useMemo(() => {
        return withEquation(withHistory(withEmbeds(withTables(withLinks(withReact(createEditor()))))));
    }, []);
    
    // Define initial value - keep it simple and stable
    const initialValue = useMemo(() => [
        {
            type: 'paragraph',
            children: [{ text: '' }],
        },
    ], []);

    const handleEditorChange = useCallback((newValue: Descendant[]) => {
        // Handle editor changes for any custom logic if needed
        // In uncontrolled mode, Slate manages the state internally
        console.log('Editor changed:', newValue);
    }, []);

    const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);

    const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);


    const [htmlAction, setHtmlAction] = useState({
        showInput: false,
        html: '',
        action: '',
        location: '',
    });
    
    const handleCodeToText = useCallback((partialState: Partial<{
        showInput: boolean;
        html: string;
        action: string;
        location: string;
    }>) => {
        setHtmlAction(prev => ({
            ...prev,
            ...partialState,
        }));
    }, []);
    
    return (
        <Slate 
            editor={editor} 
            initialValue={initialValue}
            onChange={handleEditorChange}
            key="slate-editor"
        >
            <Toolbar handleCodeToText={handleCodeToText} />
            <div className="editor-wrapper" style={{border:'1px solid #f3f3f3', padding:'0 10px'}}>
                <Editable
                    placeholder='Write something'
                    renderElement={renderElement} 
                    renderLeaf={renderLeaf}
                    spellCheck={false} // Disable spellcheck to prevent DOM issues
                />
            </div>
            {htmlAction.showInput && 
                <CodeToText {...htmlAction} handleCodeToText={handleCodeToText}/>
            }
        </Slate>
    )
}

export default SlateEditor