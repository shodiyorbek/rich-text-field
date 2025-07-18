import React from 'react';
import { useFocused, useSelected, useSlateStatic, RenderElementProps } from 'slate-react';
import { removeLink } from '../../utils/link';
import unlink from '../../Toolbar/toolbarIcons/unlink.svg';
import './styles.css';

interface LinkElement {
    type: 'link';
    href: string;
    target?: string;
    attr?: any;
}

const Link: React.FC<RenderElementProps> = ({ attributes, element, children }) => {
    const linkElement = element as LinkElement;
    const editor = useSlateStatic();
    const selected = useSelected();
    const focused = useFocused();
    
    return (
        <div className='link'>
            <a 
                href={linkElement.href} 
                {...attributes} 
                {...(linkElement.attr || {})} 
                target={linkElement.target}
            >
                {children}
            </a>
            {selected && focused && (
                <div className='link-popup' contentEditable={false}>
                    <a href={linkElement.href} target={linkElement.target}>
                        {linkElement.href}
                    </a>
                    <button onClick={() => removeLink(editor)}>
                        <img src={unlink} alt="" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Link;