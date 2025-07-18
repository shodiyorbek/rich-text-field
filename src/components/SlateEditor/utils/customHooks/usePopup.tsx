import React, { useState, useEffect, RefObject, Dispatch, SetStateAction } from 'react';

// This hook returns if the click was inside the popUp ref or outside it.
function usePopup(popupRef: RefObject<HTMLElement>): [boolean, Dispatch<SetStateAction<boolean>>] {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    
    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => {
            const clickedComponent = e.target as HTMLElement;
            if (!popupRef?.current?.contains(clickedComponent)) {
                setShowPopup(false);
            }
        }
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [showPopup, setShowPopup];
}

export default usePopup;

