"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FALLBACK_DURATION = 11.533;
const LOW_VIDEO = "/dika-scroll-720p.mp4?v=2";
const HIGH_VIDEO = "/dika-scroll-1440p.mp4?v=2";

const stages = [
  { title: "سازه", caption: "آغاز از یک ساختار دقیق", startsAt: 0 },
  { title: "شیشه", caption: "شفافیت، بدون حذف مرزها", startsAt: 3.6 },
  { title: "چوب و در", caption: "گرما در کنار هندسه", startsAt: 6.8 },
  { title: "فضای نهایی", caption: "یک فضای کامل برای کار", startsAt: 10.2 },
];

type FetchPriority = "high" | "low";
type PriorityRequestInit = RequestInit & { priority?: FetchPriority };

type NetworkInformation = {
  downlink?: number;
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

type PauseGate = {
  wait: () => Promise<void>;
  pause: () => void;
  resume: () => void;
};

function createPauseGate(signal: AbortSignal): PauseGate {
  let paused = false;
  let resolvers: Array<() => void> = [];

  const releaseAll = () => {
    const pending = resolvers;
    resolvers = [];
    pending.forEach((resolve) => resolve());
  };

  signal.addEventListener("abort", releaseAll, { once: true });

  return {
    wait() {
      if (!paused || signal.aborted) return Promise.resolve();
      return new Promise<void>((resolve) => resolvers.push(resolve));
    },
    pause() {
      if (!signal.aborted) paused = true;
    },
    resume() {
      paused = false;
      releaseAll();
    },
  };
}

async function downloadVideo(
  url: string,
  signal: AbortSignal,
  priority: FetchPriority,
  onProgress?: (progress: number | null) => void,
  gate?: PauseGate,
) {
  const options: PriorityRequestInit = {
    cache: "force-cache",
    signal,
    priority,
  };
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Video request failed: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const totalBytes = Number(response.headers.get("content-length")) || 0;

  if (!reader) {
    const blob = await response.blob();
    onProgress?.(100);
    return blob;
  }

  const chunks: ArrayBuffer[] = [];
  let receivedBytes = 0;
  let lastProgress = -1;

  onProgress?.(totalBytes ? 0 : null);

  while (true) {
    // Yielding here (instead of calling reader.read() immediately) lets the
    // browser's flow control free up bandwidth for other in-flight requests
    // — e.g. below-fold images the user is scrolling toward — while paused.
    await gate?.wait();
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = new Uint8Array(value.byteLength);
    chunk.set(value);
    chunks.push(chunk.buffer);
    receivedBytes += value.byteLength;

    if (totalBytes) {
      const nextProgress = Math.min(99, Math.floor((receivedBytes / totalBytes) * 100));
      if (nextProgress !== lastProgress) {
        lastProgress = nextProgress;
        onProgress?.(nextProgress);
      }
    }
  }

  onProgress?.(100);

  return new Blob(chunks, {
    type: response.headers.get("content-type") || "video/mp4",
  });
}

function waitForVideoEvent(
  video: HTMLVideoElement,
  event: "loadedmetadata" | "loadeddata" | "seeked",
) {
  return new Promise<void>((resolve, reject) => {
    const handleReady = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(video.error ?? new Error("Video could not be decoded"));
    };
    const cleanup = () => {
      video.removeEventListener(event, handleReady);
      video.removeEventListener("error", handleError);
    };

    video.addEventListener(event, handleReady, { once: true });
    video.addEventListener("error", handleError, { once: true });
  });
}

async function attachVideo(video: HTMLVideoElement, blob: Blob, targetTime: number) {
  const objectUrl = URL.createObjectURL(blob);
  const metadataReady = waitForVideoEvent(video, "loadedmetadata");

  video.src = objectUrl;
  video.load();
  await metadataReady;
  video.pause();

  if (video.readyState < 2) {
    await waitForVideoEvent(video, "loadeddata");
  }

  const end = Math.max(0, video.duration - 1 / 30);
  const nextTime = Math.min(end, Math.max(0, targetTime));

  if (nextTime > 1 / 60) {
    const seeked = waitForVideoEvent(video, "seeked");
    video.currentTime = nextTime;
    await seeked;
  } else {
    video.currentTime = 0;
  }

  return objectUrl;
}

function shouldDownloadHighQuality(downloadTime: number, mobile: boolean) {
  if (mobile || downloadTime > 6_500 || document.visibilityState !== "visible") {
    return false;
  }

  const connection = (navigator as NavigatorWithConnection).connection;
  const slowConnection =
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g";
  const limitedDownlink =
    typeof connection?.downlink === "number" && connection.downlink < 7;
  const availablePixels = window.innerWidth * Math.max(1, window.devicePixelRatio || 1);

  return (
    !connection?.saveData &&
    !slowConnection &&
    !limitedDownlink &&
    availablePixels > 1600
  );
}

export default function ScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const lowVideoRef = useRef<HTMLVideoElement>(null);
  const highVideoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(FALLBACK_DURATION);
  const [activeStage, setActiveStage] = useState(0);
  const [lowReady, setLowReady] = useState(false);
  const [highReady, setHighReady] = useState(false);
  const [lowProgress, setLowProgress] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const lowVideo = lowVideoRef.current;
    const highVideo = highVideoRef.current;
    if (!section || !lowVideo || !highVideo) return;

    gsap.registerPlugin(ScrollTrigger);

    const controller = new AbortController();
    const videoGate = createPauseGate(controller.signal);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 820px)").matches;
    let disposed = false;
    let lowObjectUrl = "";
    let highObjectUrl = "";
    let highTimer = 0;
    let releaseLowTimer = 0;
    let waitingForHero = false;
    let seekFrame = 0;
    let progress = reducedMotion ? 1 : 0;
    let lowAttached = false;
    let highAttached = false;
    let lastStage = -1;

    const setStageForTime = (time: number) => {
      let nextStage = 0;

      stages.forEach((stage, index) => {
        if (time >= stage.startsAt) nextStage = index;
      });

      if (nextStage !== lastStage) {
        lastStage = nextStage;
        setActiveStage(nextStage);
      }
    };

    const commitSeek = () => {
      seekFrame = 0;
      if (disposed) return;

      const end = Math.max(0, durationRef.current - 1 / 30);
      const nextTime = Math.min(end, Math.max(0, progress * durationRef.current));

      for (const [video, attached] of [
        [lowVideo, lowAttached],
        [highVideo, highAttached],
      ] as const) {
        if (!attached || video.readyState < 2 || !Number.isFinite(video.duration)) continue;

        if (Math.abs(video.currentTime - nextTime) > 1 / 60) {
          video.currentTime = nextTime;
        }
      }
    };

    const syncVideos = () => {
      if (!seekFrame) seekFrame = window.requestAnimationFrame(commitSeek);
    };

    const applyProgress = (nextProgress: number) => {
      progress = reducedMotion ? 1 : nextProgress;
      section.style.setProperty(
        "--placeholder-x",
        `${Math.round((progress - 0.5) * 84)}px`,
      );
      section.style.setProperty(
        "--placeholder-x-reverse",
        `${Math.round((0.5 - progress) * 58)}px`,
      );
      section.style.setProperty("--placeholder-y", `${Math.round(progress * 42)}px`);
      section.style.setProperty(
        "--placeholder-y-reverse",
        `${Math.round(progress * -30)}px`,
      );
      setStageForTime(progress * durationRef.current);
      syncVideos();
    };

    const trigger = reducedMotion
      ? null
      : ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: (self) => applyProgress(self.progress),
          onRefresh: (self) => applyProgress(self.progress),
        });

    if (reducedMotion) {
      section.dataset.reducedMotion = "true";
    }

    applyProgress(trigger?.progress ?? progress);
    window.requestAnimationFrame(() => ScrollTrigger.refresh());

    const downloadHighQuality = async () => {
      try {
        const blob = await downloadVideo(HIGH_VIDEO, controller.signal, "low", undefined, videoGate);
        if (disposed) return;

        const targetTime = progress * durationRef.current;
        highObjectUrl = await attachVideo(highVideo, blob, targetTime);
        if (disposed) return;

        highAttached = true;
        syncVideos();
        setHighReady(true);

        releaseLowTimer = window.setTimeout(() => {
          if (!highAttached || disposed) return;

          lowAttached = false;
          lowVideo.removeAttribute("src");
          lowVideo.load();
          if (lowObjectUrl) URL.revokeObjectURL(lowObjectUrl);
          lowObjectUrl = "";
        }, 900);
      } catch (error) {
        if (!controller.signal.aborted && !disposed) {
          console.warn("High-quality video was skipped.", error);
        }
      }
    };

    const heroIsVisible = () => {
      const bounds = section.getBoundingClientRect();
      return bounds.bottom > 0 && bounds.top < window.innerHeight;
    };

    // While the user is actively scrolling and the hero is no longer on
    // screen, pause the video download so the connection's bandwidth goes to
    // whatever is actually in (or near) the viewport — e.g. below-fold
    // images. Downloading resumes automatically once scrolling settles.
    let priorityIdleTimer = 0;

    const handleScrollPriority = () => {
      if (!heroIsVisible()) {
        videoGate.pause();
      }

      window.clearTimeout(priorityIdleTimer);
      priorityIdleTimer = window.setTimeout(() => {
        videoGate.resume();
      }, 400);
    };

    window.addEventListener("scroll", handleScrollPriority, { passive: true });

    const scheduleHighQuality = () => {
      if (disposed || highAttached || highTimer) return;

      if (!heroIsVisible()) {
        if (!waitingForHero) {
          waitingForHero = true;
          window.addEventListener("scroll", scheduleHighQuality, { passive: true });
        }
        return;
      }

      if (waitingForHero) {
        waitingForHero = false;
        window.removeEventListener("scroll", scheduleHighQuality);
      }

      highTimer = window.setTimeout(() => {
        highTimer = 0;

        if (heroIsVisible()) {
          void downloadHighQuality();
        } else {
          scheduleHighQuality();
        }
      }, 6_000);
    };

    const initialise = async () => {
      const startedAt = performance.now();

      try {
        const blob = await downloadVideo(
          LOW_VIDEO,
          controller.signal,
          "high",
          setLowProgress,
          videoGate,
        );
        if (disposed) return;

        const downloadTime = performance.now() - startedAt;
        const targetTime = progress * durationRef.current;
        lowObjectUrl = await attachVideo(lowVideo, blob, targetTime);
        if (disposed) return;

        durationRef.current = lowVideo.duration || durationRef.current;
        lowAttached = true;
        applyProgress(progress);
        setLowReady(true);

        if (shouldDownloadHighQuality(downloadTime, mobile)) {
          scheduleHighQuality();
        }
      } catch (error) {
        if (!controller.signal.aborted && !disposed) {
          console.warn("Video could not be loaded; keeping the placeholder visible.", error);
        }
      }
    };

    void initialise();

    return () => {
      disposed = true;
      controller.abort();
      trigger?.kill();
      window.cancelAnimationFrame(seekFrame);
      window.clearTimeout(highTimer);
      window.clearTimeout(releaseLowTimer);
      window.clearTimeout(priorityIdleTimer);
      window.removeEventListener("scroll", scheduleHighQuality);
      window.removeEventListener("scroll", handleScrollPriority);

      lowVideo.removeAttribute("src");
      highVideo.removeAttribute("src");
      lowVideo.load();
      highVideo.load();

      if (lowObjectUrl) URL.revokeObjectURL(lowObjectUrl);
      if (highObjectUrl) URL.revokeObjectURL(highObjectUrl);
    };
  }, []);

  const jumpToStage = (stage: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const top = window.scrollY + section.getBoundingClientRect().top;
    const distance = Math.max(0, section.offsetHeight - window.innerHeight);
    const progress = Math.min(1, stages[stage].startsAt / durationRef.current + 0.006);

    window.scrollTo({
      top: top + distance * progress,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <section ref={sectionRef} className="scroll-hero" aria-label="معرفی فضای دیکا آسیا">
      <div className="hero-sticky" data-stage={activeStage}>
        <div className="hero-placeholder" aria-hidden="true">
          <span className="hero-placeholder__panel hero-placeholder__panel--back" />
          <span className="hero-placeholder__panel hero-placeholder__panel--frame" />
          <span className="hero-placeholder__panel hero-placeholder__panel--glass" />
          <span className="hero-placeholder__panel hero-placeholder__panel--slab" />
        </div>

        <video
          ref={lowVideoRef}
          className={`hero-video hero-video--low${lowReady ? " is-ready" : ""}`}
          muted
          playsInline
          preload="none"
          aria-label="مراحل شکل‌گیری یک فضای اداری از سازه تا چیدمان نهایی"
        />

        <video
          ref={highVideoRef}
          className={`hero-video hero-video--high${highReady ? " is-ready" : ""}`}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
        />

        <div className="hero-shade" aria-hidden="true" />

        <div
          className={`hero-load-status${lowReady ? " is-hidden" : ""}`}
          role="status"
          aria-live="polite"
        >
          <span className="hero-load-status__dot" aria-hidden="true" />
          <span>در حال دریافت نسخه سریع 720p</span>
          <span className="hero-load-status__value" dir="ltr">
            {lowProgress === null ? "…" : `${lowProgress}%`}
          </span>
          <span
            className={`hero-load-status__track${
              lowProgress === null ? " is-indeterminate" : ""
            }`}
            aria-hidden="true"
          >
            <span style={lowProgress === null ? undefined : { width: `${lowProgress}%` }} />
          </span>
        </div>

        <header className="site-header">
          <a href="#top" className="brand" aria-label="دیکا آسیا، صفحه اصلی">
            <span className="brand__logo" aria-hidden="true" />
          </a>

          <button
            type="button"
            className={`menu-toggle${menuOpen ? " is-open" : ""}`}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <nav
            id="main-menu"
            className={`main-nav${menuOpen ? " is-open" : ""}`}
            aria-label="منوی اصلی"
          >
            <a href="#products">محصولات</a>
            <a href="#projects">پروژه‌ها</a>
            <a href="#gallery">گالری</a>
            <a href="#journal">وبلاگ</a>
            <a href="#about">درباره ما</a>
            <a href="#contact">تماس با ما</a>
          </nav>
        </header>

        <div className="hero-copy" aria-live="polite">
          <p className="hero-copy__index">۰{activeStage + 1}</p>
          <p className="hero-copy__caption">{stages[activeStage].caption}</p>
          <h1>{stages[activeStage].title}</h1>
        </div>

        <div className="stage-nav" aria-label="مراحل انیمیشن">
          {stages.map((stage, index) => (
            <button
              key={stage.title}
              type="button"
              className={index === activeStage ? "is-active" : ""}
              onClick={() => jumpToStage(index)}
              aria-current={index === activeStage ? "step" : undefined}
              aria-label={`رفتن به مرحله ${stage.title}`}
            >
              <span className="stage-nav__line" aria-hidden="true" />
              <span className="stage-nav__label">{stage.title}</span>
            </button>
          ))}
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span>اسکرول کنید</span>
          <i />
        </div>
      </div>
    </section>
  );
}
