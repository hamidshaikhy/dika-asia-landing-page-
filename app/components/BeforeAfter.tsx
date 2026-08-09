"use client";

import Image from "next/image";
import { useState } from "react";

type BeforeAfterProps = {
  beforeSrc?: string;
  afterSrc?: string;
  beforeAlt?: string;
  afterAlt?: string;
  label?: string;
};

export default function BeforeAfter({
  beforeSrc = "/images/office-before.webp",
  afterSrc = "/images/office-after.webp",
  beforeAlt = "فضای اداری پیش از اجرای پارتیشن",
  afterAlt = "فضای اداری پس از اجرای پارتیشن",
  label = "مقایسه قبل و بعد",
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="compare" style={{ "--compare": `${position}%` } as React.CSSProperties}>
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        sizes="(max-width: 900px) 100vw, 86vw"
        className="cover-image"
      />
      <div className="compare__before">
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          sizes="(max-width: 900px) 100vw, 86vw"
          className="cover-image"
        />
      </div>
      <span className="compare__tag compare__tag--before">قبل</span>
      <span className="compare__tag compare__tag--after">بعد</span>
      <div className="compare__line" aria-hidden="true">
        <span>↔</span>
      </div>
      <input
        aria-label={label}
        dir="ltr"
        type="range"
        min="8"
        max="92"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </div>
  );
}
