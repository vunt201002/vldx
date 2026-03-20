import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function BlockListItem({ block, typeDef, isActive, onSelect, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`te-block-item${isActive ? ' active' : ''}${isDragging ? ' dragging' : ''}`}
      onClick={() => onSelect(block._id)}
    >
      <span className="te-block-item-drag" {...attributes} {...listeners}>
        ⠿
      </span>
      <span className="te-block-item-icon">{typeDef?.icon || '📄'}</span>
      <div className="te-block-item-info">
        <div className="te-block-item-name">{block.name}</div>
        <div className="te-block-item-type">{block.type}</div>
      </div>
      <button
        className="te-block-item-delete"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(block._id)
        }}
        title="Remove block"
      >
        ✕
      </button>
    </li>
  )
}
