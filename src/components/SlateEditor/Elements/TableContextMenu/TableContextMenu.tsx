import React, { useEffect, useState } from 'react';
import useContextMenu from '../../utils/customHooks/useContextMenu';
import Icon from '../../common/Icon';
import './styles.css';
import { TableUtil } from '../../utils/table';
import { Transforms, Editor } from 'slate';
import { ReactEditor } from 'slate-react';

interface TableContextMenuProps {
    editor: Editor & ReactEditor;
}

const TableContextMenu: React.FC<TableContextMenuProps> = ({ editor }) => {
    const [selection, setSelection] = useState<any>();
    const [showMenu, { top, left }] = useContextMenu(editor, 'table', setSelection);
    const table = new TableUtil(editor);


    const menu = [
        {
            icon:'insertColumnRight',
            text:'Insert Columns to the Right',
            action:{
                type:'insertColumn',
                position:'after'
            }
        },
        {
            icon:'insertColumnLeft',
            text:'Insert Columns to the Left',
            action:{
                type:'insertColumn',
                position:'at'
            }
        },
        {
            icon:'insertRowAbove',
            text:'Insert Row Above',
            action:{
                type:'insertRow',
                position:'at'
            }
        },
        {
            icon:'insertRowBelow',
            text:'Insert Row Below',
            action:{
                type:'insertRow',
                position:'after'
            }
        },
        {
            icon:'insertColumnRight',
            text:'Remove Columns to the Right',
            action:{
                type:'removeColumn',
                position:'after'
            }
        },
        {
            icon:'insertColumnLeft',
            text:'Remove Columns to the Left',
            action:{
                type:'removeColumn',
                position:'at'
            }
        },
        {
            icon:'insertRowAbove',
            text:'Remove Row Above',
            action:{
                type:'removeRow',
                position:'at'
            }
        },
        {
            icon:'insertRowBelow',
            text:'Remove Row Below',
            action:{
                type:'removeRow',
                position:'after'
            }
        },
        {
            icon:'trashCan',
            text:'Remove Table',
            action:{
                type:'remove'
            }
        }
    ]


    const handleInsert = ({type: any, position}: any) =>{
        Transforms.select(editor,selection)
        switch(type){
            case 'insertRow':
                table.insertRow(position);
                break;
            case 'insertColumn':
                table.insertColumn(position);
                break;
            case 'removeRow':
                table.removeRow(position);
                break;
            case 'removeColumn':
                table.removeColumn(position);
                break;
            case 'remove':
                table.removeTable();
                break;
            default:
                return;

        }
        ReactEditor.focus(editor);
    }

    return (
            showMenu && 
            <div className='contextMenu' style={{top,left}}>
                {
                    menu.map(({icon,text,action},index) => 
                        <div className='menuOption' key={index} onClick={() => handleInsert(action)}>
                            <Icon icon={icon}/>
                            <span>{text}</span>
                        </div>
                    )
                }
            </div> 
    )
}

export default TableContextMenu;