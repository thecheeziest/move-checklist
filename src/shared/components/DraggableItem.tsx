import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableItemProps {
  id: string;
  children: React.ReactNode;
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
    if (!(window as any).__dragProps) {
      (window as any).__dragProps = {};
    }
    (window as any).__dragProps[id] = { attributes, listeners };
    
    return () => {
      delete (window as any).__dragProps[id];
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