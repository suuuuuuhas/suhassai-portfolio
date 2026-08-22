import {
  ArrowUpRight,
  GithubLogo,
  Globe,
  InstagramLogo,
  List,
  LinkedinLogo,
  Moon,
  SquaresFour,
  Sun,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  digitalProjects,
  educationItems,
  experienceItems,
  githubProjects,
  identity,
  links,
  proofSignals,
  workItems,
} from "./content";

type Theme = "light" | "dark";
type SectionId = "about" | "experience" | "work" | "education" | "links";
type PortraitDirection =
  | "center"
  | "up"
  | "up-right"
  | "right"
  | "down-right"
  | "down"
  | "down-left"
  | "left"
  | "up-left";

type PortraitPose = PortraitDirection | "up-right-soft" | "right-down-soft" | "down-left-soft" | "left-up-soft";

const introGreetings = ["Hello", "Bonjour", "स्वागत है", "नमस्कार", "Ciao", "Olá", "おい", "Hallå", "Guten tag"];
const introSessionKey = "suhassai-home-intro-2026-08-22";
let introStartedThisLoad = false;

type IntroPhase = "pending" | "greetings" | "identity" | "reveal" | "done";

const sectionTitles: Record<SectionId, string> = {
  about: "About",
  experience: "Experience",
  work: "Selected work",
  education: "Education",
  links: "Links",
};

const portraitPoseIndex: Record<PortraitPose, number> = {
  center: 0,
  up: 1,
  "up-right-soft": 2,
  "up-right": 3,
  right: 4,
  "right-down-soft": 5,
  "down-right": 6,
  down: 7,
  "down-left-soft": 8,
  "down-left": 9,
  left: 10,
  "left-up-soft": 11,
  "up-left": 12,
};

const portraitSheetSrc = "/profile/portrait-directions.webp";

type PortraitFrame = {
  src: string;
  column: number;
  row: number;
  flipX?: boolean;
};

function portraitCellOf(pose: PortraitPose): PortraitFrame {
  const index = portraitPoseIndex[pose];
  return { src: portraitSheetSrc, column: index % 4, row: Math.floor(index / 4) };
}

type PortraitTransitionRoute = {
  src: string;
  row: number;
  columns?: [number, number, number];
  flipX?: boolean;
};

type ResolvedPortraitTransitionRoute = PortraitTransitionRoute & {
  columns: [number, number, number];
};

const portraitTransitionRoutes: Record<string, PortraitTransitionRoute> = {
  "center→up": { src: "/profile/portrait-center-a.webp", row: 0, columns: [0, 0, 1] },
  "center→up-right": { src: "/profile/portrait-center-a.webp", row: 0 },
  "center→right": { src: "/profile/portrait-center-a.webp", row: 3 },
  "center→down-right": { src: "/profile/portrait-center-b.webp", row: 1 },
  "center→down": { src: "/profile/portrait-center-b.webp", row: 2 },
  "center→down-left": { src: "/profile/portrait-center-b.webp", row: 1, flipX: true },
  "center→left": { src: "/profile/portrait-center-a.webp", row: 3, flipX: true },
  "center→up-left": { src: "/profile/portrait-center-a.webp", row: 0, flipX: true },
  "up-right→right": { src: "/profile/portrait-ring-a.webp", row: 2 },
  "down-right→down": { src: "/profile/portrait-ring-b.webp", row: 1 },
  "down-left→left": { src: "/profile/portrait-ring-c.webp", row: 0 },
  "up-left→up": { src: "/profile/portrait-ring-c.webp", row: 3 },
};

const portraitSoftBridges: Record<string, PortraitPose> = {
  "up|up-right": "up-right-soft",
  "right|down-right": "right-down-soft",
  "down|down-left": "down-left-soft",
  "left|up-left": "left-up-soft",
};

const portraitTransitionSources = [...new Set(Object.values(portraitTransitionRoutes).map((route) => route.src))];

function framesOfRoute(route: ResolvedPortraitTransitionRoute): PortraitFrame[] {
  return route.columns.map((column) => ({ src: route.src, column, row: route.row, flipX: route.flipX }));
}

function resolvePortraitFrames(
  from: PortraitDirection,
  to: PortraitDirection,
): PortraitFrame[] | null {
  const direct = portraitTransitionRoutes[`${from}→${to}`];
  if (direct) return framesOfRoute({ ...direct, columns: direct.columns ?? [0, 1, 2] });

  const reverse = portraitTransitionRoutes[`${to}→${from}`];
  if (reverse) return framesOfRoute({ ...reverse, columns: [2, 1, 0] });

  const bridge =
    portraitSoftBridges[`${from}|${to}`] ?? portraitSoftBridges[`${to}|${from}`];
  if (bridge) return [portraitCellOf(from), portraitCellOf(bridge), portraitCellOf(to)];

  return null;
}

const helpTopics = [
  {
    title: "I code with AI",
    shortTitle: "Code with AI",
    sprite: "/profile/help-code-sequence.png",
    cellRatio: 3 / 4,
    copy: "I turn rough ideas into working websites and useful tools by building with AI, not just talking about it.",
  },
  {
    title: "I stay curious",
    shortTitle: "Stay curious",
    sprite: "/profile/help-curious-sequence.png",
    cellRatio: 3 / 4,
    copy: "Every business needs a first step upward. Mine is asking sharper questions, testing faster, and staying curious.",
  },
  {
    title: "I decode viral patterns",
    shortTitle: "Decode patterns",
    sprite: "/profile/help-patterns-sequence.png",
    cellRatio: 1,
    copy: "I study hooks, retention, formats, and distribution to understand why social content travels and how to repeat the signal.",
  },
] as const;

const preloadImage = (src: string) => {
  const image = new Image();
  image.src = src;
  void image.decode?.().catch(() => undefined);
};

function PortraitFrameView({ frame }: { frame: PortraitFrame }) {
  return (
    <span className="portrait-cell" aria-hidden="true">
      <span className={frame.flipX ? "portrait-cell-inner is-flipped" : "portrait-cell-inner"}>
        <img
          className="portrait-sheet"
          src={frame.src}
          alt=""
          draggable={false}
          style={{ transform: `translate3d(-${frame.column * 25}%, -${frame.row * 25}%, 0)` }}
        />
      </span>
    </span>
  );
}

function PortraitCell({ direction }: { direction: PortraitDirection }) {
  return <PortraitFrameView frame={portraitCellOf(direction)} />;
}

function CursorPortrait({ onToggleTheme }: { onToggleTheme: () => void }) {
  const portraitRef = useRef<HTMLButtonElement>(null);
  const currentDirectionRef = useRef<PortraitDirection>("center");
  const turningRef = useRef(false);
  const transitionTimersRef = useRef<number[]>([]);
  const touchStartRef = useRef({ x: 0, y: 0, moved: false });
  const [currentDirection, setCurrentDirection] = useState<PortraitDirection>("center");
  const [turnFrames, setTurnFrames] = useState<PortraitFrame[] | null>(null);
  const [turnStep, setTurnStep] = useState(0);
  const [touchActive, setTouchActive] = useState(false);

  const clearTransitionTimers = useCallback(() => {
    transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimersRef.current = [];
  }, []);

  const animateTo = useCallback(
    (nextDirection: PortraitDirection) => {
      if (turningRef.current) return;

      const from = currentDirectionRef.current;
      if (from === nextDirection) return;

      const frames = resolvePortraitFrames(from, nextDirection);
      if (!frames) {
        currentDirectionRef.current = nextDirection;
        setCurrentDirection(nextDirection);
        return;
      }

      clearTransitionTimers();
      turningRef.current = true;
      setTurnFrames(frames);
      setTurnStep(0);

      const schedule = (delay: number, callback: () => void) => {
        transitionTimersRef.current.push(window.setTimeout(callback, delay));
      };

      schedule(50, () => setTurnStep(1));
      schedule(100, () => setTurnStep(2));
      schedule(150, () => {
        turningRef.current = false;
        currentDirectionRef.current = nextDirection;
        setCurrentDirection(nextDirection);
        setTurnFrames(null);
      });
    },
    [clearTransitionTimers],
  );

  const directionFromPoint = useCallback((clientX: number, clientY: number, allowCenter = true) => {
    const portrait = portraitRef.current;
    if (!portrait) return "center" as PortraitDirection;

    const rect = portrait.getBoundingClientRect();
    const deltaX = clientX - (rect.left + rect.width / 2);
    const deltaY = clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(deltaX, deltaY);

    if (allowCenter && distance < Math.max(rect.width / 2, 60)) return "center";

    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    if (angle >= -22.5 && angle < 22.5) return "right";
    if (angle >= 22.5 && angle < 67.5) return "down-right";
    if (angle >= 67.5 && angle < 112.5) return "down";
    if (angle >= 112.5 && angle < 157.5) return "down-left";
    if (angle >= 157.5 || angle < -157.5) return "left";
    if (angle >= -157.5 && angle < -112.5) return "up-left";
    if (angle >= -112.5 && angle < -67.5) return "up";
    return "up-right";
  }, []);

  useEffect(() => {
    preloadImage(portraitSheetSrc);
    portraitTransitionSources.forEach(preloadImage);

    let animationFrame = 0;
    const handleMouseMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        animateTo(directionFromPoint(event.clientX, event.clientY));
      });
    };
    const handleMouseLeave = () => animateTo("center");

    window.addEventListener("pointermove", handleMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      clearTransitionTimers();
      window.removeEventListener("pointermove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [animateTo, clearTransitionTimers, directionFromPoint]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    touchStartRef.current = { x: event.clientX, y: event.clientY, moved: false };
    setTouchActive(true);
    animateTo(directionFromPoint(event.clientX, event.clientY, false));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const distance = Math.hypot(
      event.clientX - touchStartRef.current.x,
      event.clientY - touchStartRef.current.y,
    );
    if (distance > 8) touchStartRef.current.moved = true;
    animateTo(directionFromPoint(event.clientX, event.clientY, false));
  };

  const endTouch = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setTouchActive(false);
    animateTo("center");
  };

  return (
    <div className="portrait-interaction" data-touch-active={touchActive}>
      <button
        ref={portraitRef}
        type="button"
        className="avatar-wrap"
        aria-label="Interactive portrait. Move around it to change my gaze; tap to switch theme."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endTouch}
        onPointerCancel={endTouch}
        onClick={(event) => {
          if (touchStartRef.current.moved) {
            event.preventDefault();
            touchStartRef.current.moved = false;
            return;
          }
          onToggleTheme();
        }}
      >
        <span className="portrait-layer">
          <PortraitFrameView
            frame={turnFrames ? turnFrames[Math.min(turnStep, turnFrames.length - 1)] : portraitCellOf(currentDirection)}
          />
        </span>
      </button>
      <span className="touch-hint" aria-hidden="true">drag my portrait</span>
    </div>
  );
}

function AccordionSection({
  id,
  open,
  onToggle,
  children,
}: {
  id: SectionId;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }, reduceMotion ? 0 : 110);
    return () => window.clearTimeout(timer);
  }, [open, reduceMotion]);

  return (
    <section ref={sectionRef} id={id === "work" ? "selected-work" : id} className="accordion">
      <button
        type="button"
        className="accordion-trigger"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
      >
        <span className="accordion-chevron" aria-hidden="true">&gt;</span>
        <span>{sectionTitles[id]}</span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`${id}-panel`}
            className="accordion-panel"
            initial={reduceMotion ? false : { height: 0 }}
            animate={{ height: "auto" }}
            exit={reduceMotion ? undefined : { height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.1, ease: "easeOut" }}
          >
            <div className="accordion-content">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function AboutContent() {
  return (
    <div className="copy-stack">
      <p>{identity.intro}</p>
      <p>I code with AI, stay curious, and decode the patterns behind content that spreads.</p>
      <ul className="plain-list">
        {proofSignals.map((signal) => <li key={signal}>{signal}</li>)}
      </ul>
    </div>
  );
}

function ExperienceContent() {
  return (
    <div className="career-list">
      {experienceItems.map((item) => (
        <article key={`${item.title}-${item.org}`} className="career-item">
          <span className="career-date">{item.period}</span>
          <div>
            <strong>{item.title}</strong>
            <h3>
              <a href={links.masettyAgro} target="_blank" rel="noreferrer">{item.org}</a>
            </h3>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function WorkContent() {
  return (
    <div className="project-list">
      {digitalProjects.map((project) => (
        <a key={project.title} className="project-item" href={project.url} target="_blank" rel="noreferrer">
          <span>
            <strong>{project.title}</strong>
            <small>{project.label} - {project.description}</small>
          </span>
          <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
        </a>
      ))}
      {workItems.slice(0, 3).map((item) => (
        <div key={item.title} className="project-item is-static">
          <span>
            <strong>{item.title}</strong>
            <small>{item.category} - {item.description}</small>
          </span>
          <span className="project-year">{item.year}</span>
        </div>
      ))}
    </div>
  );
}

function EducationContent() {
  return (
    <div className="career-list">
      {educationItems.map((item) => (
        <article key={item.school} className="career-item">
          <span className="career-date">{item.period}</span>
          <div>
            <strong>{item.school}</strong>
            <h3>{item.board} · {item.grade}</h3>
            <p>{item.note}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function LinksContent() {
  const socialLinks = [
    { label: "GitHub", detail: "@suuuuuuhas", href: "https://github.com/suuuuuuhas", icon: GithubLogo },
    { label: "LinkedIn", detail: "Professional profile", href: links.linkedin, icon: LinkedinLogo },
    { label: "Instagram", detail: `@${links.instagramHandle}`, href: links.instagram, icon: InstagramLogo },
    { label: "WhatsApp", detail: "+91 95505 62098", href: links.whatsapp, icon: WhatsappLogo },
    { label: "Masetty Agro", detail: "Website and brand work", href: links.masettyAgro, icon: Globe },
  ];

  return (
    <div className="project-list">
      {socialLinks.map(({ label, detail, href, icon: Icon }) => (
        <a key={label} className="project-item social-item" href={href} target="_blank" rel="noreferrer">
          <Icon size={18} weight="bold" aria-hidden="true" />
          <span>
            <strong>{label}</strong>
            <small>{detail}</small>
          </span>
          <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function HelpSprite({ topicIndex, frame }: { topicIndex: number | null; frame: number }) {
  const topic = helpTopics[topicIndex ?? 1];
  const visibleFrame = topicIndex === null ? 0 : frame;
  const column = visibleFrame % 4;
  const row = Math.floor(visibleFrame / 4);

  if (topicIndex === 2 && frame === 7) {
    return (
      <div className="help-sprite-viewport" style={{ aspectRatio: 1 }}>
        <img
          className="help-final-image"
          src="/profile/help-patterns-final.png"
          alt="Suhassai on a phone call after decoding social media patterns"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className="help-sprite-viewport" style={{ aspectRatio: topic.cellRatio }}>
      <img
        key={topic.sprite}
        className="help-sprite-sheet"
        src={topic.sprite}
        alt={topicIndex === null ? "Suhassai seated and ready to help" : helpTopics[topicIndex].title}
        draggable={false}
        style={{ transform: `translate3d(-${column * 25}%, -${row * 50}%, 0)` }}
      />
    </div>
  );
}

function HelpView({ onBack }: { onBack: () => void }) {
  const reduceMotion = useReducedMotion();
  const [activeTopic, setActiveTopic] = useState<number | null>(null);
  const [frame, setFrame] = useState(0);
  const [touchMode, setTouchMode] = useState(false);
  const timersRef = useRef<number[]>([]);
  const swipeStartXRef = useRef(0);

  const clearFrames = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const playTopic = useCallback((index: number) => {
    clearFrames();
    setActiveTopic(index);
    setFrame(0);
    if (reduceMotion) {
      setFrame(7);
      return;
    }
    for (let nextFrame = 1; nextFrame < 8; nextFrame += 1) {
      timersRef.current.push(window.setTimeout(() => setFrame(nextFrame), nextFrame * 70));
    }
  }, [clearFrames, reduceMotion]);

  const resetTopic = useCallback(() => {
    clearFrames();
    setActiveTopic(null);
    setFrame(0);
  }, [clearFrames]);

  useEffect(() => () => clearFrames(), [clearFrames]);

  const moveTopic = (delta: number) => {
    if (activeTopic === null) {
      if (delta > 0) playTopic(0);
      return;
    }
    const next = activeTopic + delta;
    if (next < 0) resetTopic();
    else if (next < helpTopics.length) playTopic(next);
  };

  return (
    <motion.main
      className="help-view"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeIn" }}
    >
      <button type="button" className="help-back" aria-label="Go back" onClick={onBack}>←</button>

      <div className="help-content">
        <div
          className="help-image-wrap"
          onPointerDown={(event) => {
            if (event.pointerType === "touch" || event.pointerType === "pen") setTouchMode(true);
            swipeStartXRef.current = event.clientX;
          }}
          onPointerUp={(event) => {
            const distance = swipeStartXRef.current - event.clientX;
            if (Math.abs(distance) < 40) return;
            moveTopic(distance > 0 ? 1 : -1);
          }}
        >
          <HelpSprite topicIndex={activeTopic} frame={frame} />
        </div>

        <h2 className="help-title">3 things I can help with</h2>

        <div className="help-buttons" role="group" aria-label="Ways I can help">
          {helpTopics.map((topic, index) => (
            <button
              key={topic.title}
              type="button"
              aria-pressed={activeTopic === index}
              className={activeTopic === index ? "help-button is-active" : "help-button"}
              onMouseEnter={() => { if (!touchMode) playTopic(index); }}
              onMouseLeave={() => { if (!touchMode) resetTopic(); }}
              onClick={() => playTopic(index)}
            >
              <span className="help-button-long">{topic.title}</span>
              <span className="help-button-short">{topic.shortTitle}</span>
            </button>
          ))}
        </div>

        <p id="help-topic-panel" aria-live="polite" className={activeTopic === null ? "help-subtitle" : "help-subtitle is-visible"}>
          {activeTopic === null ? "Choose one or swipe the portrait on mobile." : helpTopics[activeTopic].copy}
        </p>

        <a className="help-contact" href={links.whatsapp} target="_blank" rel="noreferrer">
          <WhatsappLogo size={18} weight="fill" aria-hidden="true" />
          WhatsApp me
        </a>
      </div>
    </motion.main>
  );
}

function PortfolioIntro() {
  const reduceMotion = useReducedMotion();
  const initializedRef = useRef(false);
  const [phase, setPhase] = useState<IntroPhase>(() => {
    if (introStartedThisLoad) return "done";
    try {
      return window.sessionStorage.getItem(introSessionKey) === "true" ? "done" : "pending";
    } catch {
      return "pending";
    }
  });
  const [greetingIndex, setGreetingIndex] = useState(0);

  useLayoutEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (reduceMotion) {
      setPhase("done");
      return;
    }

    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(introSessionKey) === "true";
    } catch {
      alreadySeen = false;
    }

    if (introStartedThisLoad || alreadySeen) {
      setPhase("done");
      return;
    }

    introStartedThisLoad = true;
    try {
      window.sessionStorage.setItem(introSessionKey, "true");
    } catch {
      // The intro still plays when storage is unavailable.
    }
    setPhase("greetings");
  }, [reduceMotion]);

  useEffect(() => {
    if (phase !== "greetings") return;

    const timers = introGreetings.slice(1).map((_, index) => (
      window.setTimeout(() => setGreetingIndex(index + 1), (index + 1) * 180)
    ));
    const greetingDuration = introGreetings.length * 180;
    timers.push(window.setTimeout(() => setPhase("identity"), greetingDuration));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [phase]);

  useEffect(() => {
    if (phase !== "identity") return;
    const timer = window.setTimeout(() => setPhase("reveal"), 600);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") return;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [phase]);

  return (
    <AnimatePresence initial={false} onExitComplete={() => setPhase("done")}>
      {phase !== "reveal" && phase !== "done" ? (
        <motion.div
          key="portfolio-intro"
          className="portfolio-intro"
          aria-hidden="true"
          initial={false}
          exit={{ y: "-101%" }}
          transition={{ delay: 0.78, duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        >
          {phase === "greetings" ? (
            <p className="intro-greeting">
              <span className="intro-dot" />
              <span>{introGreetings[greetingIndex]}</span>
            </p>
          ) : null}
          {phase === "identity" ? (
            <div className="intro-identity">
              <span>I’m</span>
              <span className="intro-portrait"><PortraitCell direction="center" /></span>
              <strong>Suhassai</strong>
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PortfolioPage({
  theme,
  onToggleTheme,
  onOpenHelp,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenHelp: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [projectView, setProjectView] = useState<"list" | "showcase">("list");
  const [projectSource, setProjectSource] = useState<"github" | "client">("github");
  const [craftView, setCraftView] = useState<"list" | "showcase">("list");
  const shownProjects = projectSource === "github" ? githubProjects : digitalProjects;

  return (
    <motion.div
      className="page"
      initial={false}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
    >
      <PortfolioIntro />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#home">home</a>
        <a href="#projects">work</a>
        <a href="#crafts">extras</a>
        <a href="#contact">contact</a>
        <div className="nav-actions">
          <a href="https://github.com/suuuuuuhas" target="_blank" rel="noreferrer" aria-label="GitHub">
            <GithubLogo size={16} weight="fill" />
          </a>
          <a href={links.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramLogo size={16} weight="bold" />
          </a>
          <button type="button" className="theme-toggle" aria-label="Toggle theme" onClick={onToggleTheme}>
            {theme === "dark" ? <Sun size={15} weight="bold" /> : <Moon size={15} weight="fill" />}
          </button>
        </div>
      </nav>

      <header id="home" className="hero">
        <div className="profile-center">
          <CursorPortrait onToggleTheme={onToggleTheme} />
          <h1>Suhassai Masetty</h1>
          <p className="role">AI-assisted builder and digital marketer</p>
        </div>
        <div className="hero-copy">
          <p>I build websites, content experiments, and digital systems that turn rough ideas into useful, polished experiences.</p>
          <p>
            I lead digital work at <a href={links.masettyAgro} target="_blank" rel="noreferrer">Masetty Agro Products</a>, where I shape branding, content, and the company’s web presence.
          </p>
        </div>
        <div className="activity-panel">
          <a className="contribution-graph" href="https://github.com/suuuuuuhas" target="_blank" rel="noreferrer">
            <img
              src="https://ghchart.rshah.org/777777/suuuuuuhas"
              alt="Suhassai's public GitHub contribution activity"
              width={800}
              height={128}
            />
          </a>
          <div className="activity-cta">
            <p>Interested in working together? Explore my <a href="https://github.com/suuuuuuhas" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} weight="bold" /></a></p>
            <div className="hero-actions">
              <button
                type="button"
                className="primary-action"
                onMouseEnter={() => helpTopics.forEach((topic) => preloadImage(topic.sprite))}
                onFocus={() => helpTopics.forEach((topic) => preloadImage(topic.sprite))}
                onClick={() => {
                  helpTopics.forEach((topic) => preloadImage(topic.sprite));
                  window.scrollTo({ top: 0, behavior: "auto" });
                  onOpenHelp();
                }}
              >
                How can I help?
              </button>
              <a className="quiet-action" href={links.whatsapp} target="_blank" rel="noreferrer">
                <WhatsappLogo size={15} weight="bold" /> Send a message
              </a>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section id="projects" className="portfolio-section">
          <div className="section-heading">
            <h2>projects.</h2>
            <div className="project-controls">
              <label className="source-select">
                <span className="sr-only">Project source</span>
                <select value={projectSource} onChange={(event) => setProjectSource(event.target.value as "github" | "client")}>
                  <option value="github">Personal</option>
                  <option value="client">Client work</option>
                </select>
              </label>
              <div className="view-switcher" role="group" aria-label="Project view">
                <button type="button" aria-pressed={projectView === "list"} onClick={() => setProjectView("list")}>
                  <List size={17} weight="bold" aria-hidden="true" />
                  <span className="sr-only">List view</span>
                </button>
                <button type="button" aria-pressed={projectView === "showcase"} onClick={() => setProjectView("showcase")}>
                  <SquaresFour size={17} weight="bold" aria-hidden="true" />
                  <span className="sr-only">Showcase view</span>
                </button>
              </div>
            </div>
          </div>

          {projectView === "list" ? (
            <div className="project-records">
              {shownProjects.map((project) => {
                const isPrivate = "isPrivate" in project && project.isPrivate;
                return (
                  <article key={project.title} className="project-record">
                    <span>
                      <strong>{project.title}</strong>
                      <small>{project.label} - {project.description}</small>
                    </span>
                    {isPrivate ? (
                      <span className="repo-visibility">Private repo</span>
                    ) : (
                      <a className="project-link" href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>
                        <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          ) : projectSource === "github" ? (
            <div className="github-showcase">
              {githubProjects.map((project) => (
                <article key={project.title} className="github-card">
                  <span>GitHub build</span>
                  <strong>{project.title}</strong>
                  <p>{project.description}</p>
                  <small>Private repository</small>
                </article>
              ))}
            </div>
          ) : (
            <div className="project-showcase">
              {workItems.slice(0, 4).map((item) => (
                <article key={item.title} className="showcase-card">
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="crafts" className="portfolio-section">
          <div className="section-heading">
            <h2>crafts.</h2>
            <div className="view-switcher" role="group" aria-label="Craft view">
              <button type="button" aria-pressed={craftView === "list"} onClick={() => setCraftView("list")}>
                <List size={17} weight="bold" aria-hidden="true" />
                <span className="sr-only">Craft list view</span>
              </button>
              <button type="button" aria-pressed={craftView === "showcase"} onClick={() => setCraftView("showcase")}>
                <SquaresFour size={17} weight="bold" aria-hidden="true" />
                <span className="sr-only">Craft showcase view</span>
              </button>
            </div>
          </div>
          {craftView === "list" ? (
            <div className="craft-records">
              {workItems.map((item) => (
                <article key={item.title} className="craft-record">
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                  <em>{item.year}</em>
                </article>
              ))}
            </div>
          ) : (
            <div className="archive-grid">
              {workItems.map((item) => (
                <article key={item.title} className="archive-item">
                  <img src={item.image} alt="" />
                  <div>
                    <span>{item.category}</span>
                    <strong>{item.title}</strong>
                    <small>{item.year}</small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="portfolio-section">
          <div className="section-heading"><h2>experience.</h2></div>
          <ExperienceContent />
        </section>

        <section className="portfolio-section">
          <div className="section-heading"><h2>education.</h2></div>
          <EducationContent />
        </section>

        <section id="contact" className="portfolio-section contact-section">
          <div className="section-heading"><h2>socials.</h2></div>
          <LinksContent />
        </section>
      </main>

      <footer>
        <span>Last updated Aug 22, 2026</span>
        <span>© 2026 Suhassai Masetty</span>
      </footer>
    </motion.div>
  );
}

function initialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemTheme = (event: MediaQueryListEvent) => {
      if (!window.localStorage.getItem("theme")) setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", handleSystemTheme);
    return () => media.removeEventListener("change", handleSystemTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      const systemTheme: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      if (next === systemTheme) window.localStorage.removeItem("theme");
      else window.localStorage.setItem("theme", next);
      return next;
    });
  };

  return (
    <div className="site">
      <AnimatePresence mode="wait" initial={false}>
        {helpOpen ? (
          <HelpView key="help" onBack={() => setHelpOpen(false)} />
        ) : (
          <PortfolioPage key="portfolio" theme={theme} onToggleTheme={toggleTheme} onOpenHelp={() => setHelpOpen(true)} />
        )}
      </AnimatePresence>
    </div>
  );
}
