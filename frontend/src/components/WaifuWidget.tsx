import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";

interface WaifuWidgetProps {
  cdnPath: string;
}
declare function loadlive2d(elementId: string, modelPath: string): void;
// trimmed version of https://github.com/stevenjoezhang/live2d-widget/blob/master/README.en.md
const WaifuWidget: React.FC<WaifuWidgetProps> = ({ cdnPath }) => {
  const waifuRef = useRef<HTMLDivElement>(null);
  const tipsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const ctx = useAppContext();

  useEffect(() => {
    if (ctx.live2DModelEnabled) {
      // @ts-ignore
      import("@/scripts/live2d.min.js")
        .then(() => {
          ;
          console.log(`
    く__,.ヘヽ.        /  ,ー､ 〉
           ＼ ', !-─‐-i  /  /´
           ／｀ｰ'       L/／｀ヽ､
         /   ／,   /|   ,   ,       ',
       ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
        ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
          !,/7 '0'     ´0iソ|    |
          |.从"    _     ,,,, / |./    |
          ﾚ'| i＞.､,,__  _,.イ /   .i   |
            ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
              | |/i 〈|/   i  ,.ﾍ |  i  |
             .|/ /  ｉ：    ﾍ!    ＼  |
              kヽ>､ﾊ    _,.ﾍ､    /､!
              !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
              ﾚ'ヽL__|___i,___,ンﾚ|ノ
                  ﾄ-,/  |___./
                  'ｰ'    !_,.:
        `);
        }).then(() => {
          const target = "Potion-Maker/Tia";
          loadlive2d("live2d", `${cdnPath}model/${target}/index.json`);
        })
    }
  }, [cdnPath, ctx.live2DModelEnabled]);

  return (
    <>
      <div id="waifu" ref={waifuRef} style={{ bottom: "0px", position: "fixed", right: "0", paddingRight: "450px", lineHeight: "0", marginBottom: "-10px", zIndex: "10000", transform: "translateY(3px)", transition: "transform .3s ease-in-out, bottom 3s ease-in-out" }}>
        <div id="waifu-tips" ref={tipsRef} className="bg-[rgba(236,217,188,0.5)] border border-[rgba(224,186,140,0.62)] rounded-[12px] shadow-[0_3px_15px_2px_rgba(191,158,118,0.2)] text-[14px] leading-[24px] m-[-30px_20px] min-h-[70px] opacity-0 overflow-hidden p-[5px_10px] absolute w-[250px] word-break-[break-word] transition-opacity duration-[1s]" />
        <canvas id="live2d" ref={canvasRef} width={250} height={250} className="w-[300px] h-[300px] relative z-[10000] cursor-grab" />
        <div id="waifu-tool" ref={toolRef} className="text-[#aaa] opacity-0 absolute right-[-10px] top-[70px] transition-opacity duration-[1s]">
          <span className="block h-[30px] text-center">
            <svg className="fill-[#7b8c9d] h-[25px] cursor-pointer transition-fill duration-[.3s] hover:fill-[#0684bd]" />
          </span>
        </div>
      </div>
      <div id="waifu-toggle" className="bg-[#fa0] rounded-[5px] bottom-[66px] text-white cursor-pointer text-[12px] left-0 ml-[-100px] p-[5px_2px_5px_5px] fixed w-[60px] writing-mode-[vertical-rl] transition-margin-left duration-[1s]">
      </div>
    </>
  );
};

export default WaifuWidget;
