import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';

interface DragItem {
  index: number;
  type: string;
}

interface DraggableRowWrapperProps {
  index: number;
  moveRow: (from: number, to: number) => void;
  itemType: string;
  children: (
    ref: React.RefObject<HTMLTableRowElement | null>,
    isDragging: boolean
  ) => React.ReactNode;
}

const DraggableRowWrapper: React.FC<DraggableRowWrapperProps> = ({
  index,
  moveRow,
  itemType,
  children,
}) => {
  const ref = useRef<HTMLTableRowElement>(null);

  const [, drop] = useDrop<DragItem>({
    accept: itemType,
    hover: (draggedItem: DragItem, monitor: DropTargetMonitor) => {
      if (!ref.current) return;
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: itemType,
    item: { index, type: itemType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return <>{children(ref, isDragging)}</>;
};

export default DraggableRowWrapper;
