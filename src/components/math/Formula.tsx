import { exerciseSchema } from "../../convex/ai";
import "mafs/core.css";
import "mafs/font.css";

import { LaTeX, Mafs } from "mafs";

interface LatexAnnotation {
  latex: string;
}

// https://mafs.dev/guides/experimental/latex
export const Latex = ({ latex }: LatexAnnotation) => {
  console.log("latex es esto", latex);
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
