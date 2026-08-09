export type ProcessIconName =
  | "consultation"
  | "measurement"
  | "design"
  | "production"
  | "installation";

type ProcessIconProps = {
  name: ProcessIconName;
};

export default function ProcessIcon({ name }: ProcessIconProps) {
  const commonProps = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "consultation") {
    return (
      <svg {...commonProps}>
        <path d="M8.5 11.5h23v16h-12l-6.5 5v-5H8.5z" />
        <path d="M18 19.5h10M18 23.5h6" />
        <path d="M33.5 19.5h6v15h-4v4l-5.5-4h-9v-4" />
      </svg>
    );
  }

  if (name === "measurement") {
    return (
      <svg {...commonProps}>
        <path d="M9 35.5 35.5 9l5 5L14 40.5z" />
        <path d="m31 13.5 3.5 3.5M26.5 18l2.5 2.5M22 22.5l3.5 3.5M17.5 27l2.5 2.5" />
        <path d="M8 11v10M8 11h10M40 37V27M40 37H30" />
      </svg>
    );
  }

  if (name === "design") {
    return (
      <svg {...commonProps}>
        <path d="M11 8.5h21l5 5v26H11z" />
        <path d="M32 8.5v6h5M17 21h13M17 27h9" />
        <path d="m24 37 2.2-6.6L36.6 20l4.4 4.4-10.4 10.4zM34.5 22.1l4.4 4.4" />
      </svg>
    );
  }

  if (name === "production") {
    return (
      <svg {...commonProps}>
        <path d="M8.5 38.5V22l10-6v7l10-7v7l11-6.5v22z" />
        <path d="M8.5 38.5h31M14 31h5v7h-5zM25 31h5v7h-5z" />
        <path d="M33.5 10v8.5M37.5 10v6" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M9 39V9h30v30zM21 9v30M9 16h30" />
      <path d="M27 28.5 31.5 33l8-9" />
      <path d="M15.5 24v5" />
    </svg>
  );
}
