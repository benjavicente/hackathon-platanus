import { exerciseSchema } from "../../convex/ai";
import "mafs/core.css";
import "mafs/font.css";

import { LaTeX, Mafs } from "mafs";

interface LatexAnnotation {
  latex: string;
}

// https://mafs.dev/guides/experimental/latex
const Latex = ({ latex }: LatexAnnotation) => {
  return (
    <Mafs>
      <LaTeX
        at={[0, 0]}
        tex={String.raw`
          ${latex}
           `}
      />
    </Mafs>
  );
};
