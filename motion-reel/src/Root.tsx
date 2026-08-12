import "./index.css";
import { Composition } from "remotion";
import { PortfolioMotionReel } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SuhassaiPortfolioMotion"
      component={PortfolioMotionReel}
      durationInFrames={645}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
