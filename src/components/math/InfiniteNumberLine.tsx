import { useState, useRef, useEffect } from "react";

const InfiniteNumberLine = () => {
  const scrollRef = useRef(null);
  const [numbers, setNumbers] = useState([10, 20, 30, 40, 50, 60, 70]);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = () => {
    if (!scrollRef.current || isScrolling) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    if (scrollWidth - (scrollLeft + clientWidth) < 300) {
      setIsScrolling(true);
      setNumbers((prev) => {
        const lastNum = prev[prev.length - 1];
        return [
          ...prev,
          ...Array(5)
            .fill()
            .map((_, i) => lastNum + (i + 1) * 10),
        ];
      });
      setTimeout(() => setIsScrolling(false), 100);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [isScrolling]);

  const NumberBlock = ({ num }) => (
    <div className="flex flex-col items-center" style={{ minWidth: "200px" }}>
      {/* Main number */}
      <div className="text-4xl font-bold mb-8">{num}</div>

      {/* Main tick */}
      <div className="w-0.5 h-4 bg-black" />

      {/* Container for small ticks and numbers */}
      <div className="w-full mt-2">
        <div className="flex justify-between px-5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0.5 h-2 bg-black" />
              <div className="text-xs mt-1">{num + i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={scrollRef}
      className="w-full overflow-x-auto bg-white"
      style={{
        height: "200px",
        overscrollBehavior: "none",
      }}
    >
      <div className="flex relative">
        {/* The main horizontal line */}
        <div className="absolute bottom-20 left-0 right-0 h-0.5 bg-black" />

        {/* Number blocks */}
        {numbers.map((num) => (
          <NumberBlock key={num} num={num} />
        ))}
      </div>
    </div>
  );
};

export default InfiniteNumberLine;
