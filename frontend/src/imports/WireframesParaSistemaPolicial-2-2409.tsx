import svgPaths from "./svg-l6xs2vz834";

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
    <div className="h-[16px] relative shrink-0 w-[373.625px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[12px] text-white">SIDPOL v1.0 - CONFIRMACIÓN DE ENVÍO (SISTEMA VULNERABLE)</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[395.625px]" data-name="Container">
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
    <div className="h-[20px] relative shrink-0 w-[44px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-start relative size-full">
        <Container5 />
        <Container6 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#000080] h-[28px] items-center justify-between left-0 px-[12px] to-[#1084d0] top-0 w-[736px]" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Icon1() {
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

function Container10() {
  return (
    <div className="h-[15px] relative shrink-0 w-[97.688px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-r-[1.333px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pr-[1.333px] relative size-full">
        <Icon1 />
        <Text1 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[527.854px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#1e2939] text-[12px]">{`http://192.168.1.10/registro/confirmar.php?status=success&id=20261142&admin_pass=policia2026`}</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-white flex-[1_0_0] h-[26.667px] min-h-px min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#6a7282] border-[1.333px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pl-[9.333px] pr-[1.333px] py-[1.333px] relative size-full">
          <Container10 />
          <Text2 />
        </div>
      </div>
    </div>
  );
}

function Icon2() {
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

function Button() {
  return (
    <div className="bg-[#e5e7eb] relative shrink-0 size-[28.667px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-[1.333px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[1.333px] pt-[7.333px] px-[7.333px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[28.667px] relative shrink-0 w-[720px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container9 />
        <Button />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[#f0f0f0] content-stretch flex flex-col h-[46px] items-start left-0 pb-[1.333px] pl-[8px] pt-[8px] top-[28px] w-[736px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-[1.333px] border-solid inset-0 pointer-events-none" />
      <Container8 />
    </div>
  );
}

function Icon3() {
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
    <div className="h-[15px] relative shrink-0 w-[238.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#4a5565] text-[10px]">Transacción completada | Cache: Habilitado (Inseguro)</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[15px] relative shrink-0 w-[258.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon3 />
        <Text3 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[15px] relative shrink-0 w-[86.521px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[15px] relative shrink-0 text-[#e7000b] text-[10px]">SESIÓN EXPUESTA</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[15px] relative shrink-0 w-[93.625px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#4a5565] text-[10px]">IP Local: 192.168.1.10</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[15px] relative shrink-0 w-[196.146px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start relative size-full">
        <Text4 />
        <Text5 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[#f0f0f0] content-stretch flex h-[24.333px] items-center justify-between left-0 pt-[1.333px] px-[12px] top-[388.5px] w-[736px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-solid border-t-[1.333px] inset-0 pointer-events-none" />
      <Container12 />
      <Container13 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[547.53px] relative w-[1257.751px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Tinos:Bold',sans-serif] leading-[300px] left-[7.48px] not-italic text-[#0a0a0a] text-[200px] top-[0.21px]">UNSECURE</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex h-[314.5px] items-center justify-center left-0 opacity-3 top-0 w-[736px]" data-name="Container">
      <div className="flex h-[797.066px] items-center justify-center relative shrink-0 w-[1344.104px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21.328125" } as React.CSSProperties}>
        <div className="flex-none rotate-12">
          <Heading />
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[24px] size-[64px] top-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="Icon">
          <path d={svgPaths.p1b47d580} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d={svgPaths.pffc74c0} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_12.5%_8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-9.09%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 10.8333">
            <path d={svgPaths.p22c1500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.31%_29.58%_54.17%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-11.1%_-10.1%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.91683 9.17087">
            <path d={svgPaths.p3fe1680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-[#e7000b] content-stretch flex flex-col items-start left-[92px] pt-[4px] px-[4px] rounded-[44739200px] size-[28px] top-[-12.57px]" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[#dcfce7] border-4 border-[#00c950] border-solid left-[276px] rounded-[44739200px] size-[120px] top-0" data-name="Container">
      <Icon4 />
      <Container19 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[120px] relative shrink-0 w-full" data-name="Container">
      <Container18 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Heading 2">
      <p className="flex-[1_0_0] font-['Tinos:Bold',sans-serif] leading-[36px] min-h-px min-w-px not-italic relative text-[#101828] text-[30px] text-center tracking-[-1.5px] uppercase whitespace-pre-wrap">¡Denuncia Registrada con Éxito!</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Tinos:Bold',sans-serif] leading-[0] left-[336.15px] not-italic text-[#364153] text-[18px] text-center top-px w-[317px] whitespace-pre-wrap">
        <span className="leading-[28px]">{`Código de Registro: `}</span>
        <span className="[text-decoration-skip-ink:none] decoration-solid leading-[28px] text-[#e7000b] underline">2026-SG-0142</span>
      </p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-0 size-[20px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p377dab00} id="Vector" stroke="var(--stroke-0, #C10007)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 7.5V10.8333" id="Vector_2" stroke="var(--stroke-0, #C10007)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 14.1667H10.0083" id="Vector_3" stroke="var(--stroke-0, #C10007)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[29.333px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#ffc9c9] border-b-[1.333px] border-solid inset-0 pointer-events-none" />
      <Icon6 />
      <p className="-translate-x-1/2 absolute font-['Tinos:Bold',sans-serif] leading-[20px] left-[271.5px] not-italic text-[#c10007] text-[14px] text-center top-[-0.67px] uppercase">Fallas de Seguridad Detectadas en esta Transacción:</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd1f0180} id="Vector" stroke="var(--stroke-0, #9F0712)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 5.25V7.58333" id="Vector_2" stroke="var(--stroke-0, #9F0712)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 9.91667H7.00583" id="Vector_3" stroke="var(--stroke-0, #9F0712)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="flex-[1_0_0] h-[32px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Tinos:Bold',sans-serif] leading-[16px] left-0 not-italic text-[#9f0712] text-[12px] top-[0.33px] w-[588px] whitespace-pre-wrap">IDOR (Insecure Direct Object Reference): El ID de la denuncia es secuencial y visible en la URL. Cualquiera puede ver otras denuncias cambiando el número.</p>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-start relative shrink-0 w-full" data-name="List Item">
      <Icon7 />
      <Text6 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p1aca3780} id="Vector" stroke="var(--stroke-0, #9F0712)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p112c6200} id="Vector_2" stroke="var(--stroke-0, #9F0712)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="flex-[1_0_0] h-[32px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Tinos:Bold',sans-serif] leading-[16px] left-0 not-italic text-[#9f0712] text-[12px] top-[0.33px] w-[589px] whitespace-pre-wrap">Credenciales Expuestas: La contraseña del administrador se está enviando por el método GET y es visible en el historial del navegador.</p>
      </div>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-start relative shrink-0 w-full" data-name="List Item">
      <Icon8 />
      <Text7 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2_2456)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #9F0712)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p21d23a70} id="Vector_2" stroke="var(--stroke-0, #9F0712)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.16667 7H12.8333" id="Vector_3" stroke="var(--stroke-0, #9F0712)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2_2456">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="flex-[1_0_0] h-[32px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Tinos:Bold',sans-serif] leading-[16px] left-0 not-italic text-[#9f0712] text-[12px] top-[0.33px] w-[555px] whitespace-pre-wrap">Sin Cifrado: Los datos del ciudadano se guardaron en la base de datos sin encriptar (Texto Plano).</p>
      </div>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-start relative shrink-0 w-full" data-name="List Item">
      <Icon9 />
      <Text8 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[112px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-[#fef2f2] h-[208px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e7000b] border-[1.333px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-[1.333px] pt-[25.333px] px-[25.333px] relative size-full">
        <Container21 />
        <List />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[44.96px] size-[18px] top-[17.33px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1c7ad000} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M5.25 7.5L9 11.25L12.75 7.5" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 11.25V2.25" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#e5e7eb] flex-[1_0_0] h-[52.667px] min-h-px min-w-px relative" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.333px] border-black border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon10 />
        <p className="-translate-x-1/2 absolute font-['Tinos:Bold',sans-serif] leading-[16px] left-[176.96px] not-italic text-[#0a0a0a] text-[12px] text-center top-[18.67px] uppercase">{` Descargar Constancia (PDF)`}</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#e7000b] flex-[1_0_0] h-[52.667px] min-h-px min-w-px relative" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.333px] border-black border-solid inset-0 pointer-events-none shadow-[4px_4px_0px_0px_black]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Tinos:Bold',sans-serif] leading-[16px] left-[164.88px] not-italic text-[12px] text-center text-white top-[18.67px] uppercase">Volver al Inicio del Laboratorio</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[16px] h-[52.667px] items-start relative shrink-0 w-full" data-name="Container">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Tinos:Bold',sans-serif] leading-[13.5px] left-[336.23px] not-italic text-[#99a1af] text-[9px] text-center top-[-0.67px] tracking-[0.9px] uppercase w-[670px] whitespace-pre-wrap">Nota: En un sistema real, este flujo permitiría a un atacante comprometer la privacidad de miles de ciudadanos en minutos.</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[599.667px] items-start left-[32px] top-[-142.58px] w-[672px]" data-name="Container">
      <Container17 />
      <Heading1 />
      <Paragraph />
      <Container20 />
      <Container22 />
      <Paragraph1 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-white h-[314.5px] left-0 overflow-clip top-[74px] w-[736px]" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[#f0f0f0] border-[#99a1af] border-[1.333px] border-solid h-[415.5px] left-[16px] overflow-clip rounded-[6px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] top-[201.58px] w-[738.667px]" data-name="Container">
      <Container2 />
      <Container7 />
      <Container11 />
      <Container14 />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#3a6ea5] h-[818.667px] relative shrink-0 w-[770.667px]" data-name="Container">
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
    <div className="absolute bg-white content-stretch flex flex-col h-[819px] items-start left-0 top-0 w-[771px]" data-name="Body">
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