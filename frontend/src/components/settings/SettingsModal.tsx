import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import type AceEditor from 'react-ace';
import { Settings, useColorTheme } from 'src/services/settings';
import { initializeAce } from 'src/editor/config';
import { ColorThemeDropdown } from './ColorThemeDropdown';
import { RenderFirstDropdown } from './RenderFirstDropdown';

interface SettingsModalProps {
  code: (React.MutableRefObject<AceEditor | null>) | undefined;
  languageID: number;
  setLanguageID: React.Dispatch<React.SetStateAction<number>> | undefined;
  renderFirst: number;
  setRenderFirst: (renderFirst: number) => void;
  live2DModelEnabled: boolean;
  setLive2DModelEnabled: (live2DModelEnabled: boolean) => void;
  show: boolean;
  onHide: () => void;
}


export default function SettingsModal({ code, languageID, show, onHide, renderFirst, setRenderFirst, live2DModelEnabled, setLive2DModelEnabled }: SettingsModalProps) {
  const [colorTheme, setColorTheme] = useColorTheme();
  const [oldColorTheme, setOldColorTheme] = useState(colorTheme)
  const [oldRenderFirst, setOldRenderFirst] = useState(renderFirst)
  const [oldLive2DModelEnabled, setOldLive2DModelEnabled] = useState(live2DModelEnabled)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (oldColorTheme !== colorTheme) {
      setOldColorTheme(colorTheme)
      if (code) {
        if (!code.current) {
          initializeAce(code, colorTheme, languageID);
        }
        code.current?.editor?.setTheme(`ace/theme/${colorTheme}`);
        localStorage.setItem(Settings.COLOR_THEME, colorTheme);
      }
    }
  }, [colorTheme])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <no need to re render on changing old value>
  useEffect(() => {
    if (oldRenderFirst !== renderFirst) {
      setOldRenderFirst(renderFirst)
      localStorage.setItem(Settings.RENDER_FIRST, JSON.stringify(renderFirst))
    }
  }, [renderFirst])

  useEffect(() => {
    if (oldLive2DModelEnabled !== live2DModelEnabled) {
      setOldLive2DModelEnabled(live2DModelEnabled)
      localStorage.setItem(Settings.LIVE_2D_MODEL_ENABLED, JSON.stringify(live2DModelEnabled))
    }
  }, [live2DModelEnabled, oldLive2DModelEnabled])


  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-[#1e1e1e] border-b border-[#555568] text-[#a0a08b]">
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-[#1e1e1e] text-[#e9efec]">
        <ColorThemeDropdown colorTheme={colorTheme} setColorTheme={setColorTheme} />
        <RenderFirstDropdown renderFirst={renderFirst} setRenderFirst={setRenderFirst} />
        <div className="flex justify-between items-center mt-4">
          <p>Live2D Model <span className="text-sm text-gray-400 ml-2">disabling requires reload</span></p>
          <input type="checkbox" checked={live2DModelEnabled} onChange={() => setLive2DModelEnabled(!live2DModelEnabled)} />
        </div>
        <Button variant="link" style={{ color: '#e9efec' }} className="hover:bg-[#504945] transition-colors duration-200" onClick={() => window.location.reload()}>Reload Page</Button>
      </Modal.Body>

      <Modal.Footer className="bg-[#1e1e1e] border-t border-[#555568]">
        <Button variant="secondary" onClick={onHide} className="text-[#e9efec] bg-[#504945] border-[#555568]">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
