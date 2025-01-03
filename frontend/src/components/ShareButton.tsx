import React, { useState, useRef, useEffect } from 'react';
import { Share, Copy } from 'lucide-react';

interface ShareButtonProp {
  uri: string
}

const ShareButton = (props: ShareButtonProp) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="text-sm text-[#a0a08b]">
      <Share className='h-4 w-4 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div
          ref={popoverRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            marginTop: '8px',
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            padding: '8px',
            zIndex: 1000,
          }}
        >
          <div className="d-flex gap-2" style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={props.uri}
              readOnly
              style={{
                flex: 1,
                backgroundColor: '#2a2a2a',
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '13px',
                width: '100%',
                outline: 'none',
              }}
            />
            <button
              type='button'
              className="btn p-1"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: copied ? '#4caf50' : 'rgba(255,255,255,0.6)',
                minWidth: '32px',
                height: '32px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={handleCopy}
            >
              {copied ? (
                <span style={{ fontSize: '13px' }}>✓</span>
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;