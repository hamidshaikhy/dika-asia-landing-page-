import Image from "next/image";
import BeforeAfter from "./BeforeAfter";
import GlassLab from "./GlassLab";
import ProcessIcon, { type ProcessIconName } from "./ProcessIcon";
import Reveal from "./Reveal";
import StatCounter from "./StatCounter";

const systems = [
  {
    title: "فریم‌لس",
    en: "FRAMELESS",
    description: "حداقل پروفیل، بیشترین شفافیت؛ برای فضاهایی که معماری باید یکپارچه دیده شود.",
    image: "/images/frameless.webp",
    meta: ["دید یکپارچه", "اجرای مینیمال"],
  },
  {
    title: "دوجداره آکوستیک",
    en: "ACOUSTIC",
    description: "کنترل صدای حرفه‌ای برای اتاق مدیریت، جلسه و فضاهای نیازمند تمرکز.",
    image: "/images/acoustic.webp",
    meta: ["کاهش انتقال صدا", "قابلیت پرده داخلی"],
  },
  {
    title: "شیشه هوشمند",
    en: "SMART GLASS",
    description: "تغییر حریم خصوصی در چند ثانیه؛ بدون پرده و بدون قطع جریان نور.",
    image: "/images/smart-glass.webp",
    meta: ["کنترل با کلید", "حریم خصوصی فوری"],
  },
  {
    title: "شیشه منحنی",
    en: "CURVED GLASS",
    description: "راهکاری شاخص برای اتاق‌های جلسه، ورودی‌ها و فضاهای معماری ویژه.",
    image: "/images/curved.webp",
    meta: ["فرم اختصاصی", "اجرای دقیق"],
  },
];

const clients = [
  "ایران قطعه",
  "ماتریس",
  "الکتروپیک",
  "بیمارستان تخت جمشید",
  "بنیان سلامت",
  "بانک شهر",
  "اشاره",
  "کاسپین پخش",
];

const articles = [
  {
    title: "راهنمای انتخاب پارتیشن شیشه‌ای برای دفتر کار",
    category: "راهنمای خرید",
    image: "/images/frameless.webp",
  },
  {
    title: "شیشه هوشمند یا سندبلاست؛ کدام انتخاب مناسب‌تر است؟",
    category: "مقایسه سیستم‌ها",
    image: "/images/smart-glass.webp",
  },
  {
    title: "چطور آکوستیک اتاق جلسه را از ابتدا درست طراحی کنیم؟",
    category: "طراحی فضای اداری",
    image: "/images/acoustic.webp",
  },
];

const processSteps: Array<{ title: string; icon: ProcessIconName }> = [
  { title: "مشاوره اولیه", icon: "consultation" },
  { title: "بازدید و اندازه‌گیری", icon: "measurement" },
  { title: "طراحی و تأیید", icon: "design" },
  { title: "تولید", icon: "production" },
  { title: "نصب و تحویل", icon: "installation" },
];

export default function HomeSections() {
  return (
    <>
      <section className="intro section-shell" id="about">
        <div className="section-index">01</div>
        <div className="intro__copy">
          <Reveal direction="right">
            <span className="eyebrow">دیکا آسیا در یک نگاه</span>
            <h1>
              ما فقط فضا را جدا نمی‌کنیم؛
              <br /> کیفیت کار را <em>بازطراحی</em> می‌کنیم.
            </h1>
          </Reveal>
          <Reveal direction="left" delay={120}>
            <p>
              از طراحی اختصاصی تا تولید و نصب، تمام جزئیات یک سیستم پارتیشن حرفه‌ای را یکپارچه مدیریت می‌کنیم.
            </p>
            <a href="#contact" className="text-link">
              شروع یک پروژه <span>↗</span>
            </a>
          </Reveal>
        </div>

        <div className="stats-grid">
          <Reveal delay={0}>
            <div className="stat-card"><strong><StatCounter target={5000} /></strong><span>مترمربع ظرفیت تولید ماهانه</span></div>
          </Reveal>
          <Reveal delay={90}>
            <div className="stat-card"><strong><StatCounter target={6} suffix=" تیم" /></strong><span>اجرای تخصصی و نصب</span></div>
          </Reveal>
          <Reveal delay={180}>
            <div className="stat-card"><strong><StatCounter target={400} /></strong><span>یونیت ظرفیت اسکلت روزانه</span></div>
          </Reveal>
        </div>
      </section>

      <section className="lab-section section-shell" id="products">
        <div className="section-heading">
          <Reveal direction="right">
            <span className="eyebrow">تجربه تعاملی</span>
            <h2>نوع شیشه را انتخاب کن؛<br />تفاوت را همان لحظه ببین.</h2>
          </Reveal>
          <Reveal direction="left" delay={100}>
            <p>یک شبیه‌ساز سبک برای نزدیک‌کردن انتخاب نهایی به نتیجه واقعی اجرا.</p>
          </Reveal>
        </div>
        <Reveal direction="up" delay={80}>
          <GlassLab />
        </Reveal>
      </section>

      <section className="systems section-shell">
        <div className="section-heading section-heading--line">
          <Reveal direction="right"><span className="eyebrow">سیستم‌های پارتیشن</span><h2>برای هر فضا، یک پاسخ دقیق.</h2></Reveal>
          <Reveal direction="left" delay={100}><a href="#contact" className="outline-link">مشاهده همه محصولات</a></Reveal>
        </div>

        <div className="system-list">
          {systems.map((system, index) => (
            <article className={`system-card ${index % 2 ? "system-card--reverse" : ""}`} key={system.title}>
              <Reveal direction={index % 2 ? "left" : "right"} className="system-card__media">
                <Image src={system.image} alt={`پارتیشن ${system.title}`} fill sizes="(max-width: 800px) 100vw, 58vw" className="cover-image" />
                <span className="system-card__number">0{index + 1}</span>
              </Reveal>
              <Reveal direction={index % 2 ? "right" : "left"} delay={100} className="system-card__content">
                <span className="eyebrow">{system.en}</span>
                <h3>{system.title}</h3>
                <p>{system.description}</p>
                <ul>{system.meta.map((item) => <li key={item}>{item}</li>)}</ul>
                <a className="round-arrow" href="#contact" aria-label={`اطلاعات بیشتر درباره ${system.title}`}>↙</a>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      <section className="compare-section section-shell" id="projects">
        <div className="section-heading">
          <Reveal direction="right"><span className="eyebrow">قبل و بعد</span><h2>یک تصمیم درست،<br />کل فضا را تغییر می‌دهد.</h2></Reveal>
          <Reveal direction="left" delay={100}><p>دستگیره را بکش و نتیجه اجرای پارتیشن در یک فضای ثابت را مقایسه کن.</p></Reveal>
        </div>
        <Reveal direction="up"><BeforeAfter /></Reveal>
      </section>

      <section className="solutions section-shell" id="gallery">
        <div className="section-heading section-heading--line">
          <Reveal direction="right"><span className="eyebrow">راهکارها</span><h2>هر فضا، رفتار خودش را دارد.</h2></Reveal>
        </div>
        <div className="solution-grid">
          {[
            ["اتاق مدیریت", "/images/frameless.webp", "right"],
            ["اتاق جلسه", "/images/acoustic.webp", "left"],
            ["فضای کار تیمی", "/images/smart-glass.webp", "right"],
            ["فضای پذیرش", "/images/curved.webp", "left"],
          ].map(([title, image, direction], index) => (
            <Reveal key={title} direction={direction as "left" | "right"} delay={(index % 2) * 90}>
              <a href="#contact" className="solution-card">
                <Image src={image} alt={title} fill sizes="(max-width: 800px) 100vw, 50vw" className="cover-image" />
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <i>↙</i>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="quality section-shell">
        <Reveal direction="right" className="quality__image">
          <Image src="/images/craft-detail.webp" alt="جزئیات اجرای فریم پارتیشن" fill sizes="(max-width: 900px) 100vw, 46vw" className="cover-image" />
        </Reveal>
        <Reveal direction="left" delay={100} className="quality__content">
          <span className="eyebrow">چرا دیکا آسیا؟</span>
          <h2>کیفیت، در فاصله‌های چند میلی‌متری ساخته می‌شود.</h2>
          <p>از انتخاب پروفیل تا اتصال نهایی شیشه، هر مرحله با یک استاندارد مشخص کنترل می‌شود.</p>
          <div className="quality-list">
            <div><strong>01</strong><span>طراحی متناسب با پلان</span></div>
            <div><strong>02</strong><span>تولید دقیق و کنترل‌شده</span></div>
            <div><strong>03</strong><span>نصب توسط تیم تخصصی</span></div>
            <div><strong>04</strong><span>پشتیبانی پس از اجرا</span></div>
          </div>
        </Reveal>
      </section>

      <section className="compare-section compare-section--smart section-shell">
        <div className="section-heading">
          <Reveal direction="right">
            <span className="eyebrow">قبل و بعد شیشه هوشمند</span>
            <h2>یک گوشه آرام؛<br />با حریم خصوصی هوشمند.</h2>
          </Reveal>
          <Reveal direction="left" delay={100}>
            <p>دستگیره را جابه‌جا کن تا تبدیل فضای باز به اتاق جلسه مجهز به شیشه هوشمند را ببینی.</p>
          </Reveal>
        </div>
        <Reveal direction="up">
          <BeforeAfter
            beforeSrc="/images/smart-office-before.webp"
            afterSrc="/images/smart-office-after.webp"
            beforeAlt="دفتر روشن از نمای گوشه پیش از اجرای اتاق جلسه"
            afterAlt="همان دفتر پس از اجرای پارتیشن شیشه هوشمند"
            label="مقایسه دفتر پیش و پس از اجرای شیشه هوشمند"
          />
        </Reveal>
      </section>

      <section className="process section-shell">
        <Reveal direction="up" className="process__title"><span className="eyebrow">مسیر همکاری</span><h2>از اولین تماس تا تحویل نهایی</h2></Reveal>
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <Reveal key={step.title} direction="up" delay={index * 85}>
              <div className="process-step">
                <span>0{index + 1}</span>
                <div className="process-step__icon"><ProcessIcon name={step.icon} /></div>
                <h3>{step.title}</h3>
                <i />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="clients">
        <Reveal direction="up" className="clients__header section-shell">
          <span className="eyebrow">همراهان ما</span><h2>اعتماد، نتیجه یک اجرای دقیق است.</h2>
        </Reveal>
        <div className="marquee" aria-label="برخی مشتریان دیکا آسیا">
          <div className="marquee__track">
            {[...clients, ...clients].map((client, index) => <span key={`${client}-${index}`}>{client}</span>)}
          </div>
        </div>
        <div className="marquee marquee--reverse" aria-hidden="true">
          <div className="marquee__track">
            {[...clients.slice().reverse(), ...clients.slice().reverse()].map((client, index) => <span key={`${client}-${index}`}>{client}</span>)}
          </div>
        </div>
      </section>

      <section className="journal section-shell" id="journal">
        <div className="section-heading section-heading--line">
          <Reveal direction="right"><span className="eyebrow">مجله دیکا</span><h2>دانش بهتر، انتخاب دقیق‌تر.</h2></Reveal>
          <Reveal direction="left"><a href="#" className="outline-link">همه مقاله‌ها</a></Reveal>
        </div>
        <div className="article-grid">
          {articles.map((article, index) => (
            <Reveal key={article.title} direction="up" delay={index * 90}>
              <article className="article-card">
                <div className="article-card__image"><Image src={article.image} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" className="cover-image" /></div>
                <span>{article.category}</span><h3>{article.title}</h3><a href="#">ادامه مطلب ↙</a>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="footer section-shell" id="contact">
        <div className="footer__brand"><strong>DIKA ASIA</strong><span>نوآوری · طراحی · اجرا</span></div>
        <nav><a href="#products">محصولات</a><a href="#journal">وبلاگ</a><a href="#contact">تماس با ما</a></nav>
        <div className="footer__contact">
          <a href="mailto:Manager.dika@gmail.com">Manager.dika@gmail.com</a>
          <a href="tel:+982191094244">۰۲۱ ۹۱۰۹۴۲۴۴</a>
          <a href="tel:+982126752179">۰۲۱ ۲۶۷۵۲۱۷۹</a>
          <a href="tel:+982122968105">۰۲۱ ۲۲۹۶۸۱۰۵</a>
          <a href="https://dikaasia.com">dikaasia.com</a>
          <a href="https://instagram.com/dika_asia">@dika_asia</a>
        </div>
        <small>© ۱۴۰۵ دیکا آسیا — تمامی حقوق محفوظ است.</small>
      </footer>
    </>
  );
}
