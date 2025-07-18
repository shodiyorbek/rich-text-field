import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    format?: string;
    active?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
    const { children, format, active, ...rest } = props;
    return (
        <button 
            className={active ? 'btnActive' : ''} 
            title={format} 
            {...rest} 
            style={{ width: '30px', height: '20px', margin: '0 2px' }}
        >
            {children}
        </button>
    );
};

export default Button;