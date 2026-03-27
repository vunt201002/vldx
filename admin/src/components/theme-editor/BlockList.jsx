import React from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import BlockListItem from './BlockListItem'

export default function BlockList({ blocks, fieldDefs, activeBlockId, onSelect, onReorder, onDelete, onDuplicate }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const typeDefMap = {}
  for (const def of fieldDefs) {
    typeDefMap[def.type] = def
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex((b) => b._id === active.id)
    const newIndex = blocks.findIndex((b) => b._id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    onReorder(oldIndex, newIndex)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b._id)} strategy={verticalListSortingStrategy}>
        <ul className="te-block-list">
          {blocks.map((block) => (
            <BlockListItem
              key={block._id}
              block={block}
              typeDef={typeDefMap[block.type]}
              isActive={block._id === activeBlockId}
              onSelect={onSelect}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
