"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const modes = [
  {
    id: "clear",
    title: "شفاف",
    note: "بیشترین عبور نور؛ بدون پوشش و بدون تغییر دید",
    image: "/images/glass-variants/clear.webp",
  },
  {
    id: "smart-private",
    title: "هوشمند خصوصی",
    note: "پوشش مات کامل؛ فضای داخل از پشت شیشه قابل تشخیص نیست",
    image: "/images/glass-variants/smart-private.webp",
  },
  {
    id: "mid-band",
    title: "نوار میانی",
    note: "یک نوار عریض و کاملاً مات در ارتفاع دید؛ بالا و پایین شیشه شفاف",
    image: "/images/glass-variants/mid-band.webp",
  },
  {
    id: "triple-band",
    title: "سه نوار افقی",
    note: "سه نوار پهن با فاصله‌های بسیار کم برای پوشش مؤثر بخش میانی",
    image: "/images/glass-variants/triple-band.webp",
  },
  {
    id: "fine-lines",
    title: "خطوط متراکم",
    note: "خطوط افقی نزدیک به هم؛ حریم دید در مرکز و شفافیت کامل در بالا و پایین",
    image: "/images/glass-variants/fine-lines.webp",
  },
  {
    id: "double-ribbon",
    title: "دو نوار افقی",
    note: "دو نوار بسیار پهن و مات با یک شکاف باریک در میان آن‌ها",
    image: "/images/glass-variants/double-ribbon.webp",
  },
  {
    id: "geometric",
    title: "هندسی متراکم",
    note: "سطوح هندسی مات و پیوسته برای پوشاندن بخش میانی شیشه",
    image: "/images/glass-variants/geometric-v2.webp",
  },
] as const;

type Mode = (typeof modes)[number]["id"];

export default function GlassLab() {
  const [active, setActive] = useState<Mode>("clear");
  const selected = modes.find((mode) => mode.id === active)!;

  useEffect(() => {
    modes.forEach((mode) => {
      const image = new window.Image();
      image.src = mode.image;
    });
  }, []);

  return (
    <div className="glass-lab">
      <div className="glass-lab__visual">
        <Image
          key={selected.id}
          src={selected.image}
          alt={`نمای پارتیشن شیشه‌ای با حالت ${selected.title}`}
          fill
          sizes="(max-width: 900px) 100vw, 64vw"
          loading="eager"
          unoptimized
          className="glass-lab__image is-visible"
        />
        <div className="glass-lab__status">
          <span>حالت انتخابی</span>
          <strong>{selected.title}</strong>
        </div>
      </div>

      <div className="glass-lab__controls">
        <div className="glass-lab__intro">
          <span className="eyebrow">انتخاب طرح شیشه</span>
          <h3>طرح را انتخاب کن و همان لحظه نتیجه را ببین.</h3>
          <p>{selected.note}</p>
        </div>
        <div className="mode-list" role="list" aria-label="انتخاب نوع و طرح شیشه">
          {modes.map((mode, index) => (
            <button
              key={mode.id}
              type="button"
              className={active === mode.id ? "is-active" : ""}
              onClick={() => setActive(mode.id)}
              aria-pressed={active === mode.id}
              aria-label={mode.title}
            >
              <span className={`pattern-swatch pattern-swatch--${mode.id}`} aria-hidden="true" />
              <span className="mode-list__label">{mode.title}</span>
              <small>{String(index + 1).padStart(2, "0")}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
