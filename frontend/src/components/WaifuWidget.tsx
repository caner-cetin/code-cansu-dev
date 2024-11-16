import { useAppStore } from "@/stores/AppStore";
import { useEffect, useRef } from "react";
import type { Application, Renderer } from 'pixi.js';

const WaifuWidget: React.FC = () => {
  const waifuRef = useRef<HTMLDivElement>(null);
  const tipsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live2DModelEnabled = useAppStore(state => state.live2DModelEnabled);

  useEffect(() => {
    if (live2DModelEnabled) {
      const loadScripts = async () => {
        // Load Cubism4 first
        await new Promise((resolve, reject) => {
          const l2dcb = document.createElement('script');
          l2dcb.src = "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js";
          l2dcb.onload = resolve;
          l2dcb.onerror = reject;
          document.body.appendChild(l2dcb);
        });

        // Then load Cubism2
        await new Promise((resolve, reject) => {
          const l2d = document.createElement('script');
          l2d.src = "https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js";
          l2d.onload = resolve;
          l2d.onerror = reject;
          document.body.appendChild(l2d);
        });

        // Then load PIXI
        await new Promise((resolve, reject) => {
          const pixi = document.createElement('script');
          pixi.src = "https://cdn.jsdelivr.net/npm/pixi.js@6.5.2/dist/browser/pixi.min.js";
          pixi.onload = resolve;
          pixi.onerror = reject;
          document.body.appendChild(pixi);
        });

        // Then load live2d display plugin
        await new Promise((resolve, reject) => {
          const l2dd = document.createElement('script');
          l2dd.src = "https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js";
          l2dd.onload = resolve;
          l2dd.onerror = reject;
          document.body.appendChild(l2dd);
        });

        const loadModel = async () => {
          // @ts-ignore
          const app: Application<Renderer> = new window.PIXI.Application({
            view: canvasRef.current,
            autoStart: true,
            backgroundAlpha: 0,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            width: 550,  // Reduced width
            height: 550, // Reduced height to maintain proportion
          });



          // @ts-ignore
          const model = await window.PIXI.live2d.Live2DModel.from("https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/Sacred%20Sword%20princesses/char_cg_live2d_049/.model.json");
          model.scale.set(0.23); // Slightly smaller scale
          model.x = 0; // Center horizontally
          model.y = 0; // Center vertically

          app.stage.addChild(model);
        };

        await loadModel();
      };

      loadScripts().catch(console.error);

      return () => {
        const scripts = document.querySelectorAll('script[src*="live2d"], script[src*="pixi.js"]');
        scripts.forEach(script => script.parentNode?.removeChild(script));
      };
    }
  }, [live2DModelEnabled]);

  return (
    <>
      <div id="waifu" ref={waifuRef} className="w-[550px] h-[550px] right-0 bottom-0 absolute z-10 pointer-events-none">
        <div id="waifu-tips" ref={tipsRef} className="bg-[rgba(236,217,188,0.5)] border border-[rgba(224,186,140,0.62)] rounded-[12px] shadow-[0_3px_15px_2px_rgba(191,158,118,0.2)] text-[14px] leading-[24px] min-h-[70px] opacity-0 overflow-hidden p-[5px_10px] absolute w-[250px] word-break-[break-word] transition-opacity duration-[1s]" />
        <canvas
          id="live2d"
          ref={canvasRef}
          className="w-full h-full"
          style={{
            touchAction: 'none',
            willChange: 'transform',
            imageRendering: 'auto',
          }}
        />
      </div>
    </>
  );
};

export default WaifuWidget;