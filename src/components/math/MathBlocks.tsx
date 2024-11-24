import { useState } from "react";

interface DraggableBlock {
  color: string;
  length: number;
}

const DraggableBlock = ({ color, length }: DraggableBlock) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    // Calcular el offset del click dentro del bloque
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData("text/plain", JSON.stringify({ offsetX, offsetY }));
  };

  const handleDrag = (e) => {
    if (!isDragging || !e.clientX) return;

    setPosition({
      x: e.clientX - JSON.parse(e.dataTransfer.getData("text/plain")).offsetX,
      y: e.clientY - JSON.parse(e.dataTransfer.getData("text/plain")).offsetY,
    });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={() => setIsDragging(false)}
      className="absolute cursor-move"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(${isDragging ? "-2px -2px" : "0 0"})`,
        transition: "transform 0.1s",
      }}
    >
      <div className="flex">
        {Array.from({ length }).map((_, index) => (
          <div key={index} className={`w-8 h-8 ${color} border border-gray-300`} />
        ))}
      </div>
    </div>
  );
};

const BlockCanvas = () => {
  const blocks = [
    { color: "bg-blue-500", length: 8 },
    { color: "bg-red-500", length: 3 },
    { color: "bg-green-500", length: 5 },
    { color: "bg-yellow-500", length: 4 },
    { color: "bg-purple-500", length: 2 },
    { color: "bg-indigo-500", length: 6 },
  ];

  return (
    <div
      className="relative w-full h-[600px] bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
    >
      {blocks.map((block, index) => (
        <DraggableBlock key={index} color={block.color} length={block.length} />
      ))}
    </div>
  );
};

export default BlockCanvas;
