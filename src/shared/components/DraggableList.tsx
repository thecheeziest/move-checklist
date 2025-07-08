import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface DraggableListProps {
  children: React.ReactNode;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onMoveToCompleted?: (itemId: string) => void;
  onMoveToPlanned?: (itemId: string) => void;
  items: any[];
}

export const DraggableList: React.FC<DraggableListProps> = ({
  children,
  onReorder,
  onMoveToCompleted,
  onMoveToPlanned,
  items,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Check if dropping into a drop zone
    if (over.id === 'completed' && onMoveToCompleted) {
      onMoveToCompleted(active.id as string);
      return;
    }

    if (over.id === 'planned' && onMoveToPlanned) {
      onMoveToPlanned(active.id as string);
      return;
    }

    if (over.id === 'pending' && onMoveToPlanned) {
      onMoveToPlanned(active.id as string);
      return;
    }

    // Check if dropping on another item (reordering)
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}; 