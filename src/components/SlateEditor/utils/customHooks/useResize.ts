import { useState } from 'react';

interface Size {
    width: number;
    height: number;
}

type UseResizeReturn = [Size, () => void, boolean];

const useResize = (): UseResizeReturn => {
    const [size, setSize] = useState<Size>({ width: 300, height: 300 });
    const [resizing, setResizing] = useState<boolean>(false);
    
    const onMouseDown = (): void => {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        setResizing(true);
    }
    
    const onMouseUp = (): void => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        setResizing(false);
    }
    
    const onMouseMove = (e: MouseEvent): void => {
        setSize(currentSize => ({
            width: currentSize.width + e.movementX,
            height: currentSize.height + e.movementY
        }));
    }

    return [size, onMouseDown, resizing];
}

export default useResize;