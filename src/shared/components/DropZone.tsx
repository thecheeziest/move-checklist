import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DropZoneProps {
  id: string;
  children: React.ReactNode;
  onDrop?: (itemId: string) => void;
  className?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({ id, children, onDrop, className = '' }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}`}
    >
      {children}
    </div>
  );
}; 