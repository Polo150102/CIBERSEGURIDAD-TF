import svgPaths from "./svg-qrxseengja";

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[16px] relative shrink-0 w-[316.125px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[12px] text-white">SIDPOL v1.0 - Captura de Datos (CONEXIÓN INSEGURA)</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[338.125px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon />
        <Text />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#c0c0c0] relative shrink-0 size-[20px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.333px] border-solid border-white inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.333px] relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[12px] text-black">_</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#c0c0c0] relative shrink-0 size-[20px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.333px] border-solid border-white inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.333px] relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[12px] text-black">□</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[#e7000b] flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.333px] border-solid border-white inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.333px] relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[12px] text-white">X</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[68px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-start relative size-full">
        <Container5 />
        <Container6 />
        <Container7 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#000080] h-[28px] items-center justify-between left-0 px-[12px] to-[#1084d0] top-0 w-[932.333px]" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[20.83%] left-[20.83%] right-1/2 top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-14.29%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10.6667">
            <path d={svgPaths.p3f446380} id="Vector" stroke="var(--stroke-0, #1E2939)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.67px_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 1.33333">
            <path d="M10 0.666667H0.666667" id="Vector" stroke="var(--stroke-0, #1E2939)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f3f4f6] relative shrink-0 size-[26.667px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[1.333px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[1.333px] pt-[5.333px] px-[5.333px] relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.67px_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 1.33333">
            <path d="M0.666667 0.666667H10" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[20.83%] left-1/2 right-[20.83%] top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-14.29%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10.6667">
            <path d={svgPaths.p3f0cc030} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#f3f4f6] relative shrink-0 size-[26.667px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[1.333px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[1.333px] pt-[5.333px] px-[5.333px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[26.667px] relative shrink-0 w-[55.333px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[2px] items-start relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 4.66667V7" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 9.33333H7.00583" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[15px] relative shrink-0 w-[70.354px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Tinos:Bold',sans-serif] leading-[15px] left-0 not-italic text-[#e7000b] text-[10px] top-[-0.67px] uppercase">Not Secure</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[15px] relative shrink-0 w-[97.688px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-r-[1.333px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pr-[1.333px] relative size-full">
        <Icon3 />
        <Text1 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[389.271px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#1e2939] text-[12px]">{`http://192.168.1.10/registro/nueva_denuncia.php?user_id=1&debug=true`}</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-white flex-[1_0_0] h-[26.667px] min-h-px min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#6a7282] border-[1.333px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pl-[9.333px] pr-[1.333px] py-[1.333px] relative size-full">
          <Container12 />
          <Text2 />
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
            <path d={svgPaths.p3abc4500} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_12.5%_66.67%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-20%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08333 4.08333">
            <path d="M3.5 0.583333V3.5H0.583333" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#e5e7eb] relative shrink-0 size-[28.667px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-[1.333px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[1.333px] pt-[7.333px] px-[7.333px] relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[28.667px] relative shrink-0 w-[916.333px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container10 />
        <Container11 />
        <Button2 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-[#f0f0f0] content-stretch flex flex-col h-[46px] items-start left-0 pb-[1.333px] pl-[8px] pt-[8px] top-[28px] w-[932.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-[1.333px] border-solid inset-0 pointer-events-none" />
      <Container9 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_1_195)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p31d5da00} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1 6H11" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_1_195">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[15px] relative shrink-0 w-[116.563px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#4a5565] text-[10px]">Listo | Protocolo: HTTP/1.1</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[15px] relative shrink-0 w-[136.563px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon5 />
        <Text3 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[15px] relative shrink-0 w-[124.083px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[15px] relative shrink-0 text-[#e7000b] text-[10px]">MODO DEBUG: ACTIVADO</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[15px] relative shrink-0 w-[134.417px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#4a5565] text-[10px]">Intranet Comisaría San Genaro</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[15px] relative shrink-0 w-[291.833px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-l-[1.333px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start pl-[17.333px] relative size-full">
        <Text4 />
        <Text5 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-[#f0f0f0] content-stretch flex h-[24.333px] items-center justify-between left-0 pt-[1.333px] px-[12px] top-[498.94px] w-[932.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-solid border-t-[1.333px] inset-0 pointer-events-none" />
      <Container14 />
      <Container15 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[72.48px] size-[14px] top-[8.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3ba1200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 5.25V7.58333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 9.91667H7.00583" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#e7000b] h-[31px] opacity-70 relative shrink-0 w-[932.333px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon6 />
        <p className="absolute font-['Tinos:Bold',sans-serif] leading-[15px] left-[102.48px] not-italic text-[10px] text-white top-[7.33px]">ADVERTENCIA: LAS CONTRASEÑAS Y DATOS PERSONALES ESTÁN VIAJANDO EN TEXTO PLANO POR LA RED LOCAL. SNIFFING DETECTADO.</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-[#006045] h-[34.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.333px] border-black border-solid inset-0 pointer-events-none" />
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[16px] left-[9.33px] text-[12px] text-white top-[8.33px]">1. IDENTIDAD</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="bg-[#e5e7eb] h-[34.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.333px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[16px] left-[9.33px] text-[#6a7282] text-[12px] top-[8.33px]">2. INCIDENTE</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="bg-[#e5e7eb] h-[34.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.333px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[16px] left-[9.33px] text-[#6a7282] text-[12px] top-[8.33px]">3. ACTA / FIRMA</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-[#e5e7eb] h-[34.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.333px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[16px] left-[9.33px] text-[#6a7282] text-[12px] top-[8.33px]">4. CONSTANCIA</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[33.75px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[11.25px] left-0 text-[#733e0a] text-[9px] top-[-2.33px] w-[136px] whitespace-pre-wrap">{`TIP: Use el botón "RENIEC" para autocompletar. (No requiere Token)`}</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="bg-[#fef9c2] h-[52.417px] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d08700] border-[1.333px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col items-start pb-[1.333px] pt-[9.333px] px-[9.333px] relative size-full">
        <Paragraph />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-[#d4d4d4] h-[393.938px] relative shrink-0 w-[192px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-r-[1.333px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start pl-[16px] pr-[17.333px] pt-[16px] relative size-full">
        <Container20 />
        <Container21 />
        <Container22 />
        <Container23 />
        <Container24 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[28px] relative shrink-0 w-[373.563px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Tinos:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#0a0a0a] text-[20px] top-[-0.33px] tracking-[-1px] uppercase">Fase 1: Recepción del Ciudadano</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Tinos:Bold',sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[0.33px]">OPERADOR: S1 PNP GARCIA</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[16px] relative shrink-0 w-[204.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon7 />
        <Text6 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[37.333px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-b-[1.333px] border-black border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[1.333px] relative size-full">
          <Heading />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute decoration-solid font-['Tinos:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[-0.67px] underline">Datos del Denunciante</p>
    </div>
  );
}

function Label() {
  return (
    <div className="absolute content-stretch flex h-[12px] items-start left-0 top-[8px] w-[120.75px]" data-name="Label">
      <p className="flex-[1_0_0] font-['Tinos:Bold',sans-serif] leading-[15px] min-h-px min-w-px not-italic relative text-[#364153] text-[10px] uppercase whitespace-pre-wrap">DNI del Ciudadano:</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-[#fefce8] flex-[1_0_0] h-[38.667px] min-h-px min-w-px relative" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] py-[6px] relative size-full">
          <p className="font-['Tinos:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px]">10223344</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#1e2939] border-[1.333px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#096] h-[38.667px] relative shrink-0 w-[69.083px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.333px] border-black border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Tinos:Bold',sans-serif] leading-[15px] left-[34.83px] not-italic text-[10px] text-center text-white top-[11.17px] uppercase">RENIEC</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[38.667px] items-start left-0 top-[24px] w-[312.167px]" data-name="Container">
      <TextInput />
      <Button3 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[12px] left-0 top-[66.67px] w-[312.167px]" data-name="Paragraph">
      <p className="absolute font-['Tinos:Bold_Italic',sans-serif] italic leading-[12px] left-0 text-[#096] text-[8px] top-[-0.67px]">Acceso Público a RENIEC: Activo (Sin Captcha)</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[78.667px] relative shrink-0 w-full" data-name="Container">
      <Label />
      <Container32 />
      <Paragraph1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="absolute content-stretch flex h-[12px] items-start left-0 top-[8px] w-[117.5px]" data-name="Label">
      <p className="flex-[1_0_0] font-['Tinos:Bold',sans-serif] leading-[15px] min-h-px min-w-px not-italic relative text-[#364153] text-[10px] uppercase whitespace-pre-wrap">Nombre Completo:</p>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="absolute h-[38.667px] left-0 top-[24px] w-[312.167px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[8px] py-[6px] relative rounded-[inherit] size-full">
        <p className="font-['Tinos:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px]">JUAN PEREZ GONZALES</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#1e2939] border-[1.333px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[62.667px] relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <TextInput1 />
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[193.333px] items-start left-0 top-0 w-[312.167px]" data-name="Container">
      <Heading1 />
      <Container31 />
      <Container33 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute decoration-solid font-['Tinos:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[-0.67px] underline">Carga de Evidencias (Files)</p>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[144.08px] size-[24px] top-[17.33px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p2d557600} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M17 8L12 3L7 8" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 3V15" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[15px] left-[17.33px] top-[49.33px] w-[277.5px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Tinos:Bold',sans-serif] leading-[15px] left-[138.77px] not-italic text-[#6a7282] text-[10px] text-center top-[-0.67px]">Suba fotos, audios o ejecutables de respaldo.</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#d1d5dc] border-[1.333px] border-black border-solid h-[25.667px] left-[109.46px] top-[73.67px] w-[93.229px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Tinos:Bold',sans-serif] leading-[15px] left-[45px] not-italic text-[#0a0a0a] text-[10px] text-center top-[3.33px] uppercase">Browse...</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[12px] left-[17.33px] top-[107.33px] w-[277.5px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Tinos:Bold',sans-serif] leading-[12px] left-[139.1px] not-italic text-[#fb2c36] text-[8px] text-center top-[-0.67px]">Allowed types: .jpg, .pdf, .exe, .php, .sh (NO VALIDATION)</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-[#f9fafb] h-[136.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-[1.333px] border-solid inset-0 pointer-events-none" />
      <Icon8 />
      <Paragraph2 />
      <Button4 />
      <Paragraph3 />
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[193.333px] items-start left-[344.17px] top-0 w-[312.167px]" data-name="Container">
      <Heading2 />
      <Container35 />
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[193.333px] relative shrink-0 w-full" data-name="Container">
      <Container30 />
      <Container34 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute decoration-solid font-['Tinos:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[-0.67px] underline">Redacción del Acta Inicial (Relato)</p>
    </div>
  );
}

function TextArea() {
  return <div className="absolute bg-[#fdfdfd] border-[1.333px] border-black border-solid h-[171.167px] left-0 top-0 w-[656.333px]" data-name="Text Area" />;
}

function Container38() {
  return (
    <div className="absolute bg-[#ffe2e2] border-[#e7000b] border-[1.333px] border-solid h-[22.667px] left-[564.6px] top-[8px] w-[83.729px]" data-name="Container">
      <p className="absolute font-['Tinos:Bold',sans-serif] leading-[12px] left-[4px] not-italic text-[#e7000b] text-[8px] top-[3.33px]">XSS DETECTADO</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[177.833px] relative shrink-0 w-full" data-name="Container">
      <TextArea />
      <Container38 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[205.833px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Container37 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[45.63px] size-[16px] top-[13.33px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_213)" id="Icon">
          <path d={svgPaths.p3397ec80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4adfe2c} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p27a74a00} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_1_213">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#c0c0c0] flex-[1_0_0] h-[42.667px] min-h-px min-w-px relative" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.333px] border-solid border-white inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon9 />
        <p className="-translate-x-1/2 absolute font-['Tinos:Bold',sans-serif] leading-[16px] left-[171.63px] not-italic text-[12px] text-black text-center top-[13.67px] uppercase">{` Generar Acta y Constancia`}</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#006045] flex-[1_0_0] h-[42.667px] min-h-px min-w-px relative" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.333px] border-black border-solid inset-0 pointer-events-none shadow-[4px_4px_0px_0px_black]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Tinos:Bold',sans-serif] leading-[16px] left-[160.31px] not-italic text-[12px] text-center text-white top-[13.67px] uppercase w-[233px] whitespace-pre-wrap">{`Guardar y Avanzar a Gestión >`}</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[42.667px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[16px] items-start relative size-full">
        <Button5 />
        <Button6 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] h-[583.167px] items-start relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Container29 />
      <Container36 />
      <Container39 />
    </div>
  );
}

function Container25() {
  return (
    <div className="flex-[1_0_0] h-[393.938px] min-h-px min-w-px relative" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[32px] pr-[52px] pt-[32px] relative size-full">
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[932.333px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <Container19 />
        <Container25 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[424.938px] items-start left-0 overflow-clip top-[74px] w-[932.333px]" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[#f0f0f0] border-[#99a1af] border-[1.333px] border-solid h-[525.938px] left-[16px] overflow-clip rounded-[6px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] top-[146.35px] w-[935px]" data-name="Container">
      <Container2 />
      <Container8 />
      <Container13 />
      <Container16 />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#3a6ea5] h-[818.667px] relative shrink-0 w-[967px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Pq() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex h-[818.667px] items-start overflow-clip relative shrink-0 w-full" data-name="pq">
      <Container />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[819px] items-start left-0 top-0 w-[967px]" data-name="Body">
      <Pq />
    </div>
  );
}

export default function WireframesParaSistemaPolicial() {
  return (
    <div className="bg-white relative size-full" data-name="Wireframes para sistema policial">
      <Body />
    </div>
  );
}