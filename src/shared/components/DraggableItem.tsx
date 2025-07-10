import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HTMLAttributes } from 'react';

interface DraggableItemProps {
  id: string;
  children: React.ReactNode;
}

// window 타입 확장
interface WindowWithDragProps extends Window {
  __dragProps?: Record<string, { attributes: HTMLAttributes<HTMLElement>; listeners: Record<string, unknown> }>;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Store drag props globally so child components can access them
  React.useEffect(() => {
    const windowWithProps = window as WindowWithDragProps;
    if (!windowWithProps.__dragProps) {
      windowWithProps.__dragProps = {};
    }
    if (listeners) {
      windowWithProps.__dragProps[id] = { attributes, listeners };
    }
    
    return () => {
      if (windowWithProps.__dragProps) {
        delete windowWithProps.__dragProps[id];
      }
    };
  }, [id, attributes, listeners]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      {children}
    </div>
  );
}; 