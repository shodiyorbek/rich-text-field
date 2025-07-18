import React from 'react';
import { RenderElementProps } from 'slate-react';

interface TableElement {
    type: 'table';
    rows?: number;
    columns?: number;
}

const Table: React.FC<RenderElementProps> = ({ attributes, children, element }) => {
    return (
        <table>
            <tbody {...attributes}>
                {children}
            </tbody>
        </table>
    );
};

export default Table;