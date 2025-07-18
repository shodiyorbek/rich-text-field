import { Transforms, Editor, Range, Element, Path } from 'slate'


export class TableUtil{
    constructor(editor){
        this.editor = editor;
    }

    insertTable = (rows,columns)=>{

        const [tableNode] = Editor.nodes(this.editor,{
            match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
            mode:'highest',
        })
        
        if(tableNode) return;
        if(!rows || !columns){
            return;
        }
        //Creating a 2-d array of blank string as default text for the table
        const cellText = Array.from({ length: rows }, () => Array.from({ length: columns }, () => ""))
        const newTable = createTableNode(cellText,rows,columns);
        
    
    
        Transforms.insertNodes(this.editor,newTable,{
            mode:'highest'
        });
        Transforms.insertNodes(this.editor,{type:'paragraph',children:[{text:""}]},{mode:'highest'})
    }


    removeTable = () => {
        Transforms.removeNodes(this.editor,{
            match:n=> !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
            // mode:'highest'
        })
    }

    insertRow = (action)=>{
        const {selection} = this.editor;

        if(!!selection && Range.isCollapsed(selection)){
            const [tableNode] = Editor.nodes(this.editor,{
                match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table-row',
            })
            if(tableNode){
                const [[table,tablePath]] = Editor.nodes(this.editor,{
                    match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
                })
                const [,currentRow] = tableNode

                
                const path = action === 'after' ? Path.next(currentRow) : currentRow;


                Transforms.insertNodes(this.editor,createRow(Array(table.columns).fill('')),{
                    at:path,
                })
                Transforms.setNodes(this.editor,{rows:table.rows + 1},
                    {
                        at:tablePath
                });
            }
        }
    }

    insertColumn = (action)=>{
        const { selection } = this.editor
        if(!!selection && Range.isCollapsed(selection)){
            const [tableNode] = Editor.nodes(this.editor,{
                match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table-cell',
            })
            if(tableNode){
                const [[table,tablePath]] = Editor.nodes(this.editor,{
                    match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
                })
                const [,currentCell] = tableNode
                const startPath = action === 'after' ? Path.next(currentCell) : currentCell;

                // The last two indices of the path represents the row and column. We need to add one cell to each row starting from the first row
                startPath[startPath.length - 2] = 0;
                for(let row = 0;row<table.rows;row++){
                    Transforms.insertNodes(this.editor,createTableCell(''),{
                        at:startPath
                    })
                    startPath[startPath.length - 2]++
                }

                Transforms.setNodes(this.editor,{columns:table.columns + 1},
                    {
                        at:tablePath
                });

            }
        }
    }

    removeRow = (action)=>{
        const {selection} = this.editor;
        if(!!selection && Range.isCollapsed(selection)){
            const [tableNode] = Editor.nodes(this.editor,{
                match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table-row',
            })
            if(tableNode){
                const [[table,tablePath]] = Editor.nodes(this.editor,{
                    match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
                })
                const [,currentRow] = tableNode
                const path = action === 'after' ? Path.next(currentRow) : currentRow;

                Transforms.removeNodes(this.editor,{
                    at:path
                })
                Transforms.setNodes(this.editor,{rows:table.rows - 1},
                    {
                        at:tablePath
                    }
                );
            }
        }
    }

    removeColumn = (action)=>{
        const {selection} = this.editor;
        if(!selection || !Range.isCollapsed(selection)){
            return;
        }

        const [cellNode] = Editor.nodes(this.editor,{
            match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table-cell',
        })
        
        if(!cellNode){
            return;
        }

        const [[table, tablePath]] = Editor.nodes(this.editor,{
            match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
        })

        if(!table || table.columns <= 1){
            // Don't allow removing the last column
            return;
        }

        const [, currentCellPath] = cellNode;
        // Get the column index (last element of the path)
        const currentColumnIndex = currentCellPath[currentCellPath.length - 1];
        
        // Determine which column to remove based on action
        const columnToRemove = action === 'after' ? 
            Math.min(currentColumnIndex + 1, table.columns - 1) : 
            currentColumnIndex;

        // Remove the cell at the target column index from each row
        // Start from the last row to avoid path shifting issues
        for(let row = table.rows - 1; row >= 0; row--){
            const cellPath = [...tablePath, row, columnToRemove];
            Transforms.removeNodes(this.editor, {
                at: cellPath
            });
        }

        // Update the table column count
        Transforms.setNodes(this.editor, {columns: table.columns - 1}, {
            at: tablePath
        });
    }
}




const createRow = (cellText)=>{
    const newRow = Array.from(cellText,(value)=> createTableCell(value));
    return {
        type:'table-row',
        children:newRow
    };
}

export const createTableCell = (text)=>{
    return {
        type:'table-cell',
        children:[ {
            type:'paragraph',
            children:[{text}]
        } ]
    }
}

const createTableNode = (cellText,rows,columns)=>{
    const tableChildren = Array.from( cellText,(value) => createRow(value))
    let tableNode = {
        type:'table',
        children:tableChildren,
        rows,
        columns
    }
    return tableNode;
}
