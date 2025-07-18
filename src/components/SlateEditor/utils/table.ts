import { Transforms, Editor, Range, Element, Path } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomEditor = Editor & ReactEditor;

interface TableElement extends Element {
    type: 'table';
    rows: number;
    columns: number;
    children: TableRowElement[];
}

interface TableRowElement extends Element {
    type: 'table-row';
    children: TableCellElement[];
}

interface TableCellElement extends Element {
    type: 'table-cell';
    children: Element[];
}

interface ParagraphElement extends Element {
    type: 'paragraph';
    children: Array<{ text: string }>;
}

type CustomElement = Element & {
    type: string;
    rows?: number;
    columns?: number;
}

export class TableUtil {
    private editor: CustomEditor;

    constructor(editor: CustomEditor) {
        this.editor = editor;
    }

    insertTable = (rows: number, columns: number): void => {
        const [tableNode] = Editor.nodes(this.editor, {
            match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table',
            mode: 'highest',
        });

        if (tableNode) return;
        if (!rows || !columns) {
            return;
        }

        // Creating a 2-d array of blank string as default text for the table
        const cellText = Array.from({ length: rows }, () => Array.from({ length: columns }, () => ""));
        const newTable = createTableNode(cellText, rows, columns);

        Transforms.insertNodes(this.editor, newTable, {
            mode: 'highest'
        });
        Transforms.insertNodes(this.editor, { type: 'paragraph', children: [{ text: "" }] }, { mode: 'highest' });
    }

    removeTable = (): void => {
        Transforms.removeNodes(this.editor, {
            match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table',
        });
    }

    insertRow = (action: 'before' | 'after'): void => {
        const { selection } = this.editor;

        if (!!selection && Range.isCollapsed(selection)) {
            const [tableNode] = Editor.nodes(this.editor, {
                match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table-row',
            });
            
            if (tableNode) {
                const [[table, tablePath]] = Editor.nodes(this.editor, {
                    match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table',
                }) as any;
                const [, currentRow] = tableNode;

                const path = action === 'after' ? Path.next(currentRow) : currentRow;

                Transforms.insertNodes(this.editor, createRow(Array(table.columns).fill('')), {
                    at: path,
                });
                Transforms.setNodes(this.editor, { rows: table.rows + 1 }, {
                    at: tablePath
                });
            }
        }
    }

    insertColumn = (action: 'before' | 'after'): void => {
        const { selection } = this.editor;
        if (!!selection && Range.isCollapsed(selection)) {
            const [tableNode] = Editor.nodes(this.editor, {
                match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table-cell',
            });
            
            if (tableNode) {
                const [[table, tablePath]] = Editor.nodes(this.editor, {
                    match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table',
                }) as any;
                const [, currentCell] = tableNode;
                const startPath = action === 'after' ? Path.next(currentCell) : currentCell;

                // The last two indices of the path represents the row and column. We need to add one cell to each row starting from the first row
                startPath[startPath.length - 2] = 0;
                for (let row = 0; row < table.rows; row++) {
                    Transforms.insertNodes(this.editor, createTableCell(''), {
                        at: startPath
                    });
                    startPath[startPath.length - 2]++;
                }

                Transforms.setNodes(this.editor, { columns: table.columns + 1 }, {
                    at: tablePath
                });
            }
        }
    }

    removeRow = (): void => {
        const { selection } = this.editor;

        if (!!selection && Range.isCollapsed(selection)) {
            const [tableNode] = Editor.nodes(this.editor, {
                match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table-row',
            });
            
            if (tableNode) {
                const [[table, tablePath]] = Editor.nodes(this.editor, {
                    match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table',
                }) as any;
                const [, currentRowPath] = tableNode;

                if (table.rows === 1) {
                    this.removeTable();
                    return;
                }

                Transforms.removeNodes(this.editor, {
                    at: currentRowPath
                });

                Transforms.setNodes(this.editor, { rows: table.rows - 1 }, {
                    at: tablePath
                });
            }
        }
    }

    removeColumn = (action: 'before' | 'after'): void => {
        const { selection } = this.editor;
        
        if (!!selection && Range.isCollapsed(selection)) {
            const [cellNode] = Editor.nodes(this.editor, {
                match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table-cell',
            });
            
            if (!cellNode) return;
            
            const [, cellPath] = cellNode;
            const [[table, tablePath]] = Editor.nodes(this.editor, {
                match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table',
            }) as any;
            
            if (table.columns === 1) {
                this.removeTable();
                return;
            }

            const currentColumnIndex = cellPath[cellPath.length - 1];
            
            // Determine which column to remove based on action
            const columnToRemove = action === 'after' ? 
                Math.min(currentColumnIndex + 1, table.columns - 1) : 
                currentColumnIndex;

            // Remove the cell at the target column index from each row
            // Start from the last row to avoid path shifting issues
            for (let row = table.rows - 1; row >= 0; row--) {
                const cellPath = [...tablePath, row, columnToRemove];
                Transforms.removeNodes(this.editor, {
                    at: cellPath
                });
            }

            // Update the table column count
            Transforms.setNodes(this.editor, { columns: table.columns - 1 }, {
                at: tablePath
            });
        }
    }
}

const createRow = (cellText: string[]): TableRowElement => {
    const newRow = Array.from(cellText, (value) => createTableCell(value));
    return {
        type: 'table-row',
        children: newRow
    };
}

export const createTableCell = (text: string): TableCellElement => {
    return {
        type: 'table-cell',
        children: [{
            type: 'paragraph',
            children: [{ text }]
        }]
    };
}

const createTableNode = (cellText: string[][], rows: number, columns: number): TableElement => {
    const tableChildren = Array.from(cellText, (value) => createRow(value));
    const tableNode: TableElement = {
        type: 'table',
        children: tableChildren,
        rows,
        columns
    };
    return tableNode;
};