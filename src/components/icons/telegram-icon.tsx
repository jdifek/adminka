const TelegramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="none"
    viewBox="0 0 32 32"
  >
    <g clipPath="url(#telegram)">
      <path
        fill="currentColor"
        d="M6.306 15.921c5.1-2.269 8.501-3.764 10.203-4.487C21.368 9.37 22.377 9.012 23.035 9c.145-.002.469.034.678.208.177.147.226.345.25.484.023.139.052.455.029.703-.264 2.825-1.403 9.679-1.983 12.843-.245 1.338-.728 1.787-1.195 1.831-.805.076-1.455-.398-2.18-.925l-.001-.001a17.92 17.92 0 0 0-.59-.418 103.746 103.746 0 0 1-1.65-1.127l-.387-.268-.011-.008-.374-.26-.421-.291-.226-.156a98.44 98.44 0 0 0-.836-.568c-1.487-1-.864-1.613-.035-2.43.135-.132.274-.27.412-.415.052-.056.28-.273.611-.587l.438-.416c.766-.727 1.8-1.713 2.591-2.502a41.957 41.957 0 0 0 .702-.717c.074-.08.142-.153.201-.219l.037-.04c.142-.163.23-.277.24-.326.011-.048.021-.224-.081-.316-.102-.093-.253-.061-.362-.036-.027.006-.122.06-.284.162l-.026.016-.237.153c-.214.138-.49.32-.827.546-.178.12-.374.25-.587.395-1.23.83-3.036 2.066-5.419 3.708-.698.49-1.33.728-1.897.715-.625-.013-1.827-.36-2.72-.657a39.299 39.299 0 0 0-.382-.124l-.168-.054c-.82-.265-1.403-.485-1.34-.995.04-.322.473-.65 1.301-.987Z"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16Zm0-2c7.732 0 14-6.268 14-14S23.732 2 16 2 2 8.268 2 16s6.268 14 14 14Z"
        clipRule="evenodd"
      ></path>
    </g>
    <defs>
      <clipPath id="telegram">
        <path fill="#fff" d="M0 0h32v32H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default TelegramIcon;
