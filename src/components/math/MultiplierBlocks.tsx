import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define drag type constant
const ItemTypes = {
  BLOCK: "block",
};

const Block = ({ id, size, color, index, moveBlock }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BLOCK,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.BLOCK,
    hover: (item) => {
      if (item.index !== index) {
        moveBlock(item.index, index);
        item.index = index;
      }
    },
  }));

  return (
    <div ref={(node) => drag(drop(node))} className={`flex cursor-move ${isDragging ? "opacity-50" : "opacity-100"}`}>
      {Array(size)
        .fill(0)
        .map((_, i) => (
          <div key={i} className={`w-6 h-6 ${color} border border-gray-300 m-0.5`} />
        ))}
    </div>
  );
};

const WorkspaceDropZone = ({ children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BLOCK,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`bg-white p-6 rounded-lg shadow-lg mb-8 min-h-[400px] ${isOver ? "bg-gray-100" : ""}`}>
      <div className="grid grid-cols-1 gap-4">{children}</div>
    </div>
  );
};

const MultiplicationBlocks = () => {
  const [blocks, setBlocks] = useState([
    { id: "1", color: "bg-orange-300", size: 4 },
    { id: "2", color: "bg-gray-600", size: 15 },
    { id: "3", color: "bg-blue-600", size: 10 },
    { id: "4", color: "bg-purple-500", size: 1 },
    { id: "5", color: "bg-red-400", size: 3 },
    { id: "6", color: "bg-teal-400", size: 5 },
    { id: "7", color: "bg-sky-400", size: 7 },
  ]);

  const multipliers = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    dots: Array(i + 1).fill("•"),
  }));

  const moveBlock = (fromIndex, toIndex) => {
    setBlocks((prevBlocks) => {
      const newBlocks = [...prevBlocks];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      return newBlocks;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Workspace Area */}
          <WorkspaceDropZone>
            {blocks.map((block, index) => (
              <Block
                key={block.id}
                id={block.id}
                index={index}
                size={block.size}
                color={block.color}
                moveBlock={moveBlock}
              />
            ))}
          </WorkspaceDropZone>

          {/* Multiplier Selection */}
          <div className="grid grid-cols-10 gap-4 mt-8">
            {multipliers.map((mult) => (
              <div key={mult.value} className="text-center">
                <div className="grid grid-cols-3 gap-0.5 justify-center mb-2 w-10 mx-auto">
                  {mult.dots.map((dot, i) => (
                    <span key={i} className="text-gray-600 text-xs">
                      •
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">x{mult.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default MultiplicationBlocks;
