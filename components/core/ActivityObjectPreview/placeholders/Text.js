import * as React from "react";
/** NOTE(amine): split string into lines of 45 chars, (maximum 9 lines) */
const parseTextToArray = (text) => text?.match(/.{1,45}/g)?.slice(0, 20) || [];

function SvgComponent({ text, ...props }) {
  const lines = parseTextToArray(text);
  return (
    <svg
      width={123}
      height={151}
      viewBox="0 6 123 151"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 157h105a8 8 0 008-8V42.314a8 8 0 00-2.343-5.657L90.343 8.343A8 8 0 0084.686 6H8a8 8 0 00-8 8v135a8 8 0 008 8z"
        fill="#fff"
      />
      <text
        fill="#8E8E93"
        style={{
          whiteSpace: "pre",
        }}
        fontFamily="Inter"
        fontSize={4}
        letterSpacing={0}
      >
        {lines.map((line, i) => (
          <tspan key={i} x={15} y={i * 5 + 25}>
            {i < 4 ? line.slice(0, 40) : line}
          </tspan>
        ))}
      </text>
      <g filter="url(#prefix__filter0_d)">
        <path d="M98 37h21L90 8v21a8 8 0 008 8z" fill="#D1D1D6" />
      </g>
      <defs>
        <filter
          id="prefix__filter0_d"
          x={74}
          y={0}
          width={69}
          height={69}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset dx={4} dy={12} />
          <feGaussianBlur stdDeviation={10} />
          <feColorMatrix values="0 0 0 0 0.780392 0 0 0 0 0.780392 0 0 0 0 0.8 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

export default SvgComponent;
