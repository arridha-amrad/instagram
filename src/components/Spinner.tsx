import { cn } from "@/lib/utils";
import { SVGAttributes } from "react";

type Props = SVGAttributes<SVGElement>;

const Spinner = (props: Props) => {
  return (
    <div role="status">
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "aspect-square w-6 fill-slate-300 text-slate-600",
          props.className,
        )}
      >
        <g>
          <rect x="11" y="1" width="2" height="5" opacity=".14" />
          <rect
            x="11"
            y="1"
            width="2"
            height="5"
            transform="rotate(30 12 12)"
            opacity=".29"
          />
          <rect
            x="11"
            y="1"
            width="2"
            height="5"
            transform="rotate(60 12 12)"
            opacity=".43"
          />
          <rect
            x="11"
            y="1"
            width="2"
            height="5"
            transform="rotate(90 12 12)"
            opacity=".57"
          />
          <rect
            x="11"
            y="1"
            width="2"
            height="5"
            transform="rotate(120 12 12)"
            opacity=".71"
          />
          <rect
            x="11"
            y="1"
            width="2"
            height="5"
            transform="rotate(150 12 12)"
            opacity=".86"
          />
          <rect
            x="11"
            y="1"
            width="2"
            height="5"
            transform="rotate(180 12 12)"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            calcMode="discrete"
            dur="0.75s"
            values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
            repeatCount="indefinite"
          />
        </g>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
