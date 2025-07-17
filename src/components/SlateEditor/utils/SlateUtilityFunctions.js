import { Editor, Transforms, Element as SlateElement, Range } from 'slate'
import {useSlateStatic} from 'slate-react'
import Link from'../Elements/Link/Link'
import Image from '../Elements/Embed/Image'
import Video from '../Elements/Embed/Video'
import Equation from '../Elements/Equation/Equation'
import HtmlCode from '../Elements/CodeToText/HtmlCode'
import Table from '../Elements/Table/Table'

const alignment = ['alignLeft','alignRight','alignCenter']
const list_types = ['orderedList','unorderedList']



export const sizeMap = {
    small:'0.75em',
    normal:'1em',
    medium:'1.75em',
    huge:'2.5em'
}
export const fontFamilyMap = {
    sans:'Helvetica,Arial, sans serif',
    serif:'Georgia, Times New Roaman,serif',
    monospace:'Monaco, Courier New,monospace'
}
export const toggleBlock = (editor,format)=>{   
    const isActive = isBlockActive(editor,format);
    const isList = list_types.includes(format)
    const isIndent = alignment.includes(format)
    const isAligned = alignment.some(alignmentType => isBlockActive(editor,alignmentType))
    
    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    
    // Check if this is a heading format
    const isHeading = ['headingOne', 'headingTwo', 'headingThree'].includes(format)
    
    /*If the node is already aligned and change in indent is called we should unwrap it first and split the node to prevent
    messy, nested DOM structure and bugs due to that.*/
    if(isAligned && isIndent){
        Transforms.unwrapNodes(editor,{
            match:n => alignment.includes(!Editor.isEditor(n) && SlateElement.isElement(n) && n.type),
            split:true
        })
    }
    
    
    /* Wraping the nodes for alignment, to allow it to co-exist with other block level operations*/
    if(isIndent){
        Transforms.wrapNodes(editor,{
            type:format,
            children:[]
        })
        return
    }
    
    // For headings with selection, we need special handling
    if (isHeading && !isActive) {
        // If there's a selection (non-collapsed), we should split the nodes at selection boundaries
        if (!isCollapsed && selection) {
            const [start, end] = Editor.edges(editor, selection)
            const startPoint = Editor.start(editor, start)
            const endPoint = Editor.end(editor, end)
            
            // Get the start and end of the blocks containing the selection
            const [startBlock] = Editor.nodes(editor, {
                at: start,
                match: n => Editor.isBlock(editor, n)
            })
            const [endBlock] = Editor.nodes(editor, {
                at: end,
                match: n => Editor.isBlock(editor, n)
            })
            
            if (startBlock && endBlock) {
                const [startNode, startPath] = startBlock
                const [endNode, endPath] = endBlock
                
                // If selection spans multiple blocks, we need to handle differently
                if (startPath[0] !== endPath[0]) {
                    // Apply heading to all selected blocks
                    Transforms.setNodes(
                        editor,
                        { type: format },
                        { 
                            at: selection,
                            match: n => Editor.isBlock(editor, n) 
                        }
                    )
                    return
                }
                
                // For single block selection, split only if not selecting the entire block
                const blockStart = Editor.start(editor, startPath)
                const blockEnd = Editor.end(editor, endPath)
                
                if (!Editor.isEqual(startPoint, blockStart) || !Editor.isEqual(endPoint, blockEnd)) {
                    // Split at end first (to preserve the start position)
                    if (!Editor.isEqual(endPoint, blockEnd)) {
                        Transforms.splitNodes(editor, { at: end })
                    }
                    // Then split at start
                    if (!Editor.isEqual(startPoint, blockStart)) {
                        Transforms.splitNodes(editor, { at: start })
                    }
                }
            }
        }
    }
    
    Transforms.unwrapNodes(editor,{
        match:n => list_types.includes(!Editor.isEditor(n) && SlateElement.isElement(n) && n.type),
        split:true
    })
    
    
    
    Transforms.setNodes(editor,{
        type:isActive?'paragraph':isList?'list-item':format,
    })
    
    
    if(isList && !isActive){
        Transforms.wrapNodes(editor,{
            type:format,
            children:[]
        })
    }
    
    
    
    
}
export const addMarkData = (editor,data)=>{
    Editor.addMark(editor,data.format,data.value);
}
export const toggleMark = (editor,format)=>{
    const isActive = isMarkActive(editor, format)
    
    if (isActive) {
        Editor.removeMark(editor,format)
    } else {
        Editor.addMark(editor, format, true)
    }
}
export const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    
    return marks ? marks[format] === true : false
}

export const isBlockActive = (editor,format)=>{
    
    const [match] = Editor.nodes(editor,{
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
    })
    
    
    return !!match;
}

export const activeMark = (editor,format) =>{
    const defaultMarkData = {
        color:'black',
        bgColor:'black',
        fontSize:'16px',
        fontFamily:'sans'
    } 
    const marks = Editor.marks(editor);
    const defaultValue = defaultMarkData[format];
    return marks?.[format] ?? defaultValue;
}

export const getMarked = (leaf,children) =>{
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }
    
    if (leaf.code) {
        children = <code>{children}</code>
    }
    
    if (leaf.italic) {
        children = <em>{children}</em>
    }
    if(leaf.strikethrough){
        children = <span style={{textDecoration:'line-through'}}>{children}</span>
    }
    if (leaf.underline) {
        children = <u>{children}</u>
    }
    if(leaf.superscript){
        children = <sup>{children}</sup>
    }
    if(leaf.subscript){
        children = <sub>{children}</sub>
    }
    if(leaf.color){
        children = <span style={{color:leaf.color}}>{children}</span>
    }
    if(leaf.bgColor){
        children = <span style={{backgroundColor:leaf.bgColor}}>{children}</span>
    }
    if(leaf.fontSize){
        // Check if it's a pixel value or old format
        const isPixelValue = typeof leaf.fontSize === 'string' && leaf.fontSize.includes('px');
        const size = isPixelValue ? leaf.fontSize : sizeMap[leaf.fontSize] || leaf.fontSize;
        children = <span style={{fontSize:size}}>{children}</span>
    }
    if(leaf.fontFamily){
        const family = fontFamilyMap[leaf.fontFamily]
        children = <span style={{fontFamily:family}}>{children}</span>
    }
    return children;
}

export const getBlock = (props) => {
    const {element, children, attributes} = props;
    
    // Ensure we have valid props
    if (!element) {
        return <div {...attributes}>{children}</div>;
    }

    switch(element.type){
        case 'headingOne':
            return <h1 {...attributes} {...element.attr}>{children}</h1>
        case 'headingTwo':
            return <h2 {...attributes} {...element.attr}>{children}</h2>
        case 'headingThree':
            return <h3 {...attributes} {...element.attr}>{children}</h3>
        case 'blockquote':
            return <blockquote {...attributes} {...element.attr}>{children}</blockquote>
        case 'alignLeft':
            return <div style={{listStylePosition:'inside'}} {...attributes} {...element.attr}>{children}</div>
        case 'alignCenter':
            return <div style={{display:'flex',alignItems:'center',listStylePosition:'inside',flexDirection:'column'}} {...attributes} {...element.attr}>{children}</div>
        case 'alignRight':
            return <div style={{display:'flex',alignItems:'flex-end',listStylePosition:'inside',flexDirection:'column'}} {...attributes} {...element.attr}>{children}</div>
        case 'list-item':
            return  <li {...attributes} {...element.attr}>{children}</li>
        case 'orderedList':
            return <ol type='1' {...attributes}>{children}</ol>
        case 'unorderedList':
            return <ul {...attributes}>{children}</ul>
        case 'link':
            return <Link {...props}/>
        case 'table':
            return <Table {...props} />
        case 'table-row':
            return <tr {...attributes}>{children}</tr>
        case 'table-cell':
            return <td {...element.attr} {...attributes}>{children}</td>
        case 'image':
            return <Image {...props}/>
        case 'video':
            return <Video {...props}/>
        case 'equation':
            return <Equation {...props}/>
        case 'htmlCode':
            return <HtmlCode {...props}/>
        case 'paragraph':
            return <p {...attributes} {...(element.attr || {})}>{children}</p>
        default :
            return <div {...(element.attr || {})} {...attributes}>{children}</div>
    }
} 