import * as React from "react";

const SVGComponent = ({ discount = 0, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={200}
    zoomAndPan="magnify"
    viewBox="0 0 150 149.999998"
    height={200}
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <defs>
      <g />
      <clipPath id="0931fd3af2">
        <path
          d="M 18.808594 18.339844 L 131.664062 18.339844 L 131.664062 131.191406 L 18.808594 131.191406 Z M 18.808594 18.339844 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="7efd0719cb">
        <path
          d="M 75.234375 18.339844 C 44.070312 18.339844 18.808594 43.601562 18.808594 74.765625 C 18.808594 105.929688 44.070312 131.191406 75.234375 131.191406 C 106.398438 131.191406 131.664062 105.929688 131.664062 74.765625 C 131.664062 43.601562 106.398438 18.339844 75.234375 18.339844 Z M 75.234375 18.339844 "
          clipRule="nonzero"
        />
      </clipPath>
    </defs>

    {/* Path representing SVG element */}
    <path
      fill="#f20028"
      d="M 150.765625 74.585938 C 150.765625 79.996094 141.511719 84.296875 140.355469 89.359375 C 139.164062 94.585938 145.605469 102.453125 143.320312 107.167969 C 140.996094 111.960938 130.785156 111.839844 127.488281 115.957031 C 124.171875 120.09375 126.550781 129.980469 122.398438 133.285156 C 118.265625 136.574219 109.121094 132.074219 104.3125 134.386719 C 99.578125 136.660156 97.425781 146.609375 92.179688 147.796875 C 87.101562 148.949219 80.84375 140.945312 75.410156 140.945312 C 69.980469 140.945312 63.722656 148.949219 58.640625 147.800781 C 53.394531 146.613281 51.238281 136.664062 46.503906 134.386719 C 41.691406 132.078125 32.550781 136.574219 28.417969 133.289062 C 24.261719 129.984375 26.640625 120.097656 23.324219 115.960938 C 20.023438 111.84375 9.8125 111.964844 7.492188 107.171875 C 5.210938 102.457031 11.644531 94.585938 10.453125 89.359375 C 9.296875 84.296875 0.0429688 79.996094 0.0429688 74.585938 C 0.0429688 69.175781 9.296875 64.871094 10.453125 59.808594 C 11.644531 54.582031 5.207031 46.714844 7.492188 41.996094 C 9.8125 37.203125 20.023438 37.324219 23.324219 33.207031 C 26.640625 29.070312 24.261719 19.183594 28.414062 15.878906 C 32.546875 12.589844 41.691406 17.089844 46.503906 14.777344 C 51.238281 12.5 53.390625 2.554688 58.640625 1.367188 C 63.71875 0.214844 69.980469 8.222656 75.410156 8.222656 C 80.84375 8.222656 87.101562 0.214844 92.179688 1.367188 C 97.429688 2.554688 99.582031 12.503906 104.3125 14.777344 C 109.125 17.089844 118.269531 12.59375 122.402344 15.882812 C 126.554688 19.1875 124.171875 29.074219 127.488281 33.210938 C 130.789062 37.328125 141 37.207031 143.320312 42 C 145.605469 46.714844 139.164062 54.582031 140.359375 59.808594 C 141.507812 64.871094 150.765625 69.175781 150.765625 74.585938 Z M 150.765625 74.585938 "
      fillOpacity={1}
      fillRule="nonzero"
    />

    {/* Discount Text with line break */}
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      alignmentBaseline="middle"
      fontSize="30"
      fontWeight="bold"
      fill="white"
    >
      <tspan x="50%" dx="8" dy="-5">{discount}%</tspan> {/* First line */}
      <tspan x="50%" dy="30">OFF</tspan> {/* Second line */}
    </text>
  </svg>
);

export const FaCheckCircle = ({ className = "" }) => {
  return (
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-check" className={`svg-inline--fa fa-circle-check text-blue-700 ${className}`} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      {/* Define the gradient */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60A5FA" /> {/* Blue-400 */}
          <stop offset="100%" stopColor="#9333EA" /> {/* Purple-600 */}
        </linearGradient>
      </defs>

      {/* Apply the gradient to the icon */}
      <path 
        d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
        fill="url(#gradient1)"
      />
    </svg>
  );
};

export const FaAddress =({className="", currentColor})=>{
  return(
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" className={`svg-inline--fa fa-location-dot text-blue-700 ${className}`} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      {/* Define the gradient */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60A5FA" /> {/* Blue-400 */}
          <stop offset="100%" stopColor="#9333EA" /> {/* Purple-600 */}
        </linearGradient>
      </defs>

      {/* Apply the gradient to the icon */}
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
        fill={currentColor === "white" ? "white" : "url(#gradient1)"}
      />
    </svg>
  );
}

export const FaPlusMinus = ({ className = "", currentColor, mode }) => {
  let pathData = ""; // Store the correct path based on mode

  if (mode === "plus") {
    pathData =
      "M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z";
  } else if (mode === "minus") {
    pathData =
      "M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z";
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon={mode}
      className={`svg-inline--fa fa-${mode} text-blue-700 ${className}`}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      {/* Define the gradient */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60A5FA" /> {/* Blue-400 */}
          <stop offset="100%" stopColor="#9333EA" /> {/* Purple-600 */}
        </linearGradient>
      </defs>

      {/* Apply the correct path based on mode */}
      {pathData && (
        <path
          d={pathData}
          fill={currentColor === "white" ? "white" : "url(#gradient1)"}
        />
      )}
    </svg>
  );
};

export default SVGComponent;
