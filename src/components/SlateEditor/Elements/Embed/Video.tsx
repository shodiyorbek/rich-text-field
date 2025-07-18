import React from 'react';
import { useSelected, useFocused, RenderElementProps } from "slate-react";
import Icon from '../../common/Icon';
import './Video.css';
import useResize from '../../utils/customHooks/useResize';

interface VideoElement {
  type: 'video';
  url: string;
  attr?: any;
}

const Video: React.FC<RenderElementProps> = ({ attributes, element, children }) => {
  const videoElement = element as VideoElement;
  const { url } = videoElement;
  const selected = useSelected();
  const focused = useFocused();
  const [size, onMouseDown] = useResize();

  return (
    <div
      {...attributes}
      className='embed'
      style={{ display: 'flex', boxShadow: selected && focused ? '0 0 3px 3px lightgray' : undefined }}
      {...(videoElement.attr || {})}
    >
      <div contentEditable={false} style={{ width: `${size.width}px`, height: `${size.height}px` }}>
        <div className='iframeVideoWrapper'>
          <iframe
            className='iframeVideo'
            src={url}
            frameBorder="0"
            title="video"
          />
        </div>
        {selected && (
          <button 
            onMouseDown={onMouseDown} 
            style={{ width: '15px', height: '15px', opacity: 1, background: 'transparent' }}
          >
            <Icon icon='resize' />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default Video;