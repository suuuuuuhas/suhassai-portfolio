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
import { useCallback, useEffect, useRef, useState } from "react";
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
  | "up-right-soft"
  | "up-right"
  | "right"
  | "right-down-soft"
  | "down-right"
  | "down"
  | "down-left-soft"
  | "down-left"
  | "left"
  | "left-up-soft"
  | "up-left";

const greetings = ["hello", "namaste", "hola", "bonjour", "ciao", "こんにちは", "హలో"];

const sectionTitles: Record<SectionId, string> = {
  about: "About",
  experience: "Experience",
  work: "Selected work",
  education: "Education",
  links: "Links",
};

const portraitOrbit: Exclude<PortraitDirection, "center">[] = [
  "up",
  "up-right-soft",
  "up-right",
  "right",
  "right-down-soft",
  "down-right",
  "down",
  "down-left-soft",
  "down-left",
  "left",
  "left-up-soft",
  "up-left",
];

const portraitFrameIndex: Record<PortraitDirection, number> = {
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
  "center→up-right-soft": { src: "/profile/portrait-center-a.webp", row: 0 },
  "center→up-right": { src: "/profile/portrait-center-a.webp", row: 0 },
  "center→right": { src: "/profile/portrait-center-a.webp", row: 3 },
  "center→right-down-soft": { src: "/profile/portrait-center-b.webp", row: 0 },
  "center→down-right": { src: "/profile/portrait-center-b.webp", row: 1 },
  "center→down": { src: "/profile/portrait-center-b.webp", row: 2 },
  "center→down-left-soft": { src: "/profile/portrait-center-b.webp", row: 0, flipX: true },
  "center→down-left": { src: "/profile/portrait-center-b.webp", row: 1, flipX: true },
  "center→left": { src: "/profile/portrait-center-a.webp", row: 3, flipX: true },
  "center→left-up-soft": { src: "/profile/portrait-center-a.webp", row: 0, flipX: true },
  "center→up-left": { src: "/profile/portrait-center-a.webp", row: 0, flipX: true },
  "up→up-right-soft": { src: "/profile/portrait-ring-a.webp", row: 0 },
  "up-right-soft→up-right": { src: "/profile/portrait-ring-a.webp", row: 1 },
  "up-right→right": { src: "/profile/portrait-ring-a.webp", row: 2 },
  "right→right-down-soft": { src: "/profile/portrait-ring-a.webp", row: 3 },
  "right-down-soft→down-right": { src: "/profile/portrait-ring-b.webp", row: 0 },
  "down-right→down": { src: "/profile/portrait-ring-b.webp", row: 1 },
  "down→down-left-soft": { src: "/profile/portrait-ring-b.webp", row: 2 },
  "down-left-soft→down-left": { src: "/profile/portrait-ring-b.webp", row: 3 },
  "down-left→left": { src: "/profile/portrait-ring-c.webp", row: 0 },
  "left→left-up-soft": { src: "/profile/portrait-ring-c.webp", row: 1 },
  "left-up-soft→up-left": { src: "/profile/portrait-ring-c.webp", row: 2 },
  "up-left→up": { src: "/profile/portrait-ring-c.webp", row: 3 },
};

const portraitTransitionSources = [...new Set(Object.values(portraitTransitionRoutes).map((route) => route.src))];

function resolvePortraitTransition(
  from: PortraitDirection,
  to: PortraitDirection,
): ResolvedPortraitTransitionRoute | null {
  const direct = portraitTransitionRoutes[`${from}→${to}`];
  if (direct) return { ...direct, columns: direct.columns ?? [0, 1, 2] };

  const reverse = portraitTransitionRoutes[`${to}→${from}`];
  if (!reverse) return null;
  const columns = reverse.columns ?? [0, 1, 2];
  return { ...reverse, columns: [columns[2], columns[1], columns[0]] };
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
    copy: "I study hooks, retention, formats, and distribution to understand why social content travels—and how to repeat the signal.",
  },
] as const;

const preloadImage = (src: string) => {
  const image = new Image();
  image.src = src;
  void image.decode?.().catch(() => undefined);
};

function PortraitCell({ direction }: { direction: PortraitDirection }) {
  const index = portraitFrameIndex[direction];
  const column = index % 4;
  const row = Math.floor(index / 4);

  return (
    <span className="portrait-cell" aria-hidden="true">
      <img
        className="portrait-sheet"
        src="/profile/portrait-directions.webp"
        alt=""
        draggable={false}
        style={{ transform: `translate3d(-${column * 25}%, -${row * 25}%, 0)` }}
      />
    </span>
  );
}

function PortraitTransitionCell({
  route,
  column,
}: {
  route: ResolvedPortraitTransitionRoute;
  column: number;
}) {
  return (
    <span className="portrait-cell" aria-hidden="true">
      <span className={route.flipX ? "portrait-cell-inner is-flipped" : "portrait-cell-inner"}>
        <img
          className="portrait-sheet"
          src={route.src}
          alt=""
          draggable={false}
          style={{ transform: `translate3d(-${column * 25}%, -${route.row * 25}%, 0)` }}
        />
      </span>
    </span>
  );
}

function CursorPortrait({ onToggleTheme }: { onToggleTheme: () => void }) {
  const portraitRef = useRef<HTMLButtonElement>(null);
  const currentDirectionRef = useRef<PortraitDirection>("center");
  const animationRunningRef = useRef(false);
  const queuedDirectionRef = useRef<PortraitDirection | null>(null);
  const transitionTimersRef = useRef<number[]>([]);
  const touchStartRef = useRef({ x: 0, y: 0, moved: false });
  const [currentDirection, setCurrentDirection] = useState<PortraitDirection>("center");
  const [transition, setTransition] = useState<
    | { kind: "photo"; route: ResolvedPortraitTransitionRoute; column: number }
    | { kind: "blend"; from: PortraitDirection; to: PortraitDirection; alpha: number }
    | null
  >(null);
  const [touchActive, setTouchActive] = useState(false);

  const clearTransitionTimers = useCallback(() => {
    transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimersRef.current = [];
  }, []);

  const animateTo = useCallback(
    (nextDirection: PortraitDirection) => {
      if (animationRunningRef.current) {
        queuedDirectionRef.current = nextDirection;
        return;
      }

      const from = currentDirectionRef.current;
      if (from === nextDirection) return;

      const fromIndex = portraitOrbit.indexOf(from as Exclude<PortraitDirection, "center">);
      const toIndex = portraitOrbit.indexOf(nextDirection as Exclude<PortraitDirection, "center">);
      if (from !== "center" && nextDirection !== "center" && fromIndex >= 0 && toIndex >= 0) {
        const clockwiseDistance = (toIndex - fromIndex + portraitOrbit.length) % portraitOrbit.length;
        const counterClockwiseDistance = (fromIndex - toIndex + portraitOrbit.length) % portraitOrbit.length;
        if (Math.min(clockwiseDistance, counterClockwiseDistance) > 1) {
          queuedDirectionRef.current = nextDirection;
          nextDirection = clockwiseDistance <= counterClockwiseDistance
            ? portraitOrbit[(fromIndex + 1) % portraitOrbit.length]
            : portraitOrbit[(fromIndex - 1 + portraitOrbit.length) % portraitOrbit.length];
        }
      }

      clearTransitionTimers();
      animationRunningRef.current = true;
      const photoRoute = resolvePortraitTransition(from, nextDirection);

      if (photoRoute) {
        setTransition({ kind: "photo", route: photoRoute, column: photoRoute.columns[0] });
      } else {
        setTransition({ kind: "blend", from, to: nextDirection, alpha: 0.25 });
      }

      const schedule = (delay: number, callback: () => void) => {
        transitionTimersRef.current.push(window.setTimeout(callback, delay));
      };

      schedule(50, () => {
        setTransition(
          photoRoute
            ? { kind: "photo", route: photoRoute, column: photoRoute.columns[1] }
            : { kind: "blend", from, to: nextDirection, alpha: 0.5 },
        );
      });
      schedule(100, () => {
        setTransition(
          photoRoute
            ? { kind: "photo", route: photoRoute, column: photoRoute.columns[2] }
            : { kind: "blend", from, to: nextDirection, alpha: 0.75 },
        );
      });
      schedule(150, () => {
        currentDirectionRef.current = nextDirection;
        setCurrentDirection(nextDirection);
        setTransition(null);
        animationRunningRef.current = false;

        const queued = queuedDirectionRef.current;
        queuedDirectionRef.current = null;
        if (queued && queued !== nextDirection) animateTo(queued);
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

    if (allowCenter && distance < rect.width / 2) return "center";

    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    const index = Math.round(((((angle + 90) % 360) + 360) % 360) / 30) % portraitOrbit.length;
    return portraitOrbit[index];
  }, []);

  useEffect(() => {
    preloadImage("/profile/portrait-directions.webp");
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
        {transition?.kind === "photo" ? (
          <span className="portrait-layer">
            <PortraitTransitionCell route={transition.route} column={transition.column} />
          </span>
        ) : (
          <>
            <span
              className="portrait-layer"
              style={{ opacity: transition?.kind === "blend" ? 1 - transition.alpha : 1 }}
            >
              <PortraitCell direction={transition?.kind === "blend" ? transition.from : currentDirection} />
            </span>
            {transition?.kind === "blend" ? (
              <span className="portrait-layer" style={{ opacity: transition.alpha }}>
                <PortraitCell direction={transition.to} />
              </span>
            ) : null}
          </>
        )}
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
            <small>{project.label} — {project.description}</small>
          </span>
          <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
        </a>
      ))}
      {workItems.slice(0, 3).map((item) => (
        <div key={item.title} className="project-item is-static">
          <span>
            <strong>{item.title}</strong>
            <small>{item.category} — {item.description}</small>
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
          {activeTopic === null ? "Choose one—or swipe the portrait on mobile." : helpTopics[activeTopic].copy}
        </p>

        <a className="help-contact" href={links.whatsapp} target="_blank" rel="noreferrer">
          <WhatsappLogo size={18} weight="fill" aria-hidden="true" />
          WhatsApp me
        </a>
      </div>
    </motion.main>
  );
}

function RotatingGreeting() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % greetings.length), 1800);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <p className="greeting" aria-live="polite">
      <motion.span
        key={greetings[index]}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
      >
        {greetings[index]}
      </motion.span>
      <span>, I’m</span>
    </p>
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
  const shownProjects = projectSource === "github" ? githubProjects : digitalProjects;

  return (
    <motion.div
      className="page"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
    >
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#home">home</a>
        <a href="#projects">work</a>
        <a href="#crafts">extras</a>
        <a href="#contact">contact</a>
        <button type="button" className="theme-toggle" aria-label="Toggle theme" onClick={onToggleTheme}>
          {theme === "dark" ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
        </button>
      </nav>

      <header id="home" className="hero">
        <div className="profile-center">
          <CursorPortrait onToggleTheme={onToggleTheme} />
          <RotatingGreeting />
          <h1>Suhassai Masetty</h1>
          <p className="role">AI-assisted builder and digital marketer</p>
        </div>
        <p className="tagline">
          I build websites, content experiments, and digital systems for ideas that deserve attention. Currently shaping the web presence of{" "}
          <a href={links.masettyAgro} target="_blank" rel="noreferrer">Masetty Agro Products</a>.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href={links.whatsapp} target="_blank" rel="noreferrer">Say hello <ArrowUpRight size={15} weight="bold" /></a>
          <button
            type="button"
            className="quiet-action"
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
        </div>
      </header>

      <main id="main-content">
        <section className="proof-strip" aria-label="Current focus">
          <p>Building with AI</p>
          <p>Digital at Masetty Agro</p>
          <p>Studying why ideas travel</p>
        </section>

        <section id="projects" className="portfolio-section">
          <div className="section-heading">
            <h2>projects.</h2>
            <div className="project-controls">
              <label className="source-select">
                <span className="sr-only">Project source</span>
                <select value={projectSource} onChange={(event) => setProjectSource(event.target.value as "github" | "client")}>
                  <option value="github">GitHub builds</option>
                  <option value="client">Client and content</option>
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
          <div className="section-heading"><h2>creative archive.</h2></div>
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
        <span>© 2026 Suhassai Masetty</span>
        <a href={links.linkedin} target="_blank" rel="noreferrer"><LinkedinLogo size={16} weight="bold" aria-label="LinkedIn" /></a>
        <a href={links.instagram} target="_blank" rel="noreferrer"><InstagramLogo size={16} weight="bold" aria-label="Instagram" /></a>
        <a href={links.whatsapp} target="_blank" rel="noreferrer"><WhatsappLogo size={16} weight="bold" aria-label="WhatsApp" /></a>
        <a href="https://github.com/suuuuuuhas" target="_blank" rel="noreferrer"><GithubLogo size={16} weight="bold" aria-label="GitHub" /></a>
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
