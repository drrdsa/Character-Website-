import React, { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Character } from '../types';
import { ArrowRight } from 'lucide-react';

interface SortableCharacterCardProps {
  id: string;
  character: Character;
  onClick: () => void;
}

export const SortableCharacterCard = forwardRef<HTMLDivElement, SortableCharacterCardProps>(({ id, character, onClick }, ref) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (ref) {
          (ref as any).current = node;
        }
      }}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={onClick}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 cursor-grab border border-purple-500/20 hover:border-purple-500/40"
    >
      <div className="relative aspect-square">
        <img
          src={character.imageUrl || 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&q=80&w=2047&ixlib=rb-4.0.3'}
          alt={character.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{character.name}</h3>
          <p className="text-purple-300 text-sm">{character.class}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-300 text-sm mb-4">{character.shortDescription}</p>
        <div className="flex items-center justify-between">
          <span className="text-purple-400 text-sm">View Details</span>
          <ArrowRight className="w-4 h-4 text-purple-400" />
        </div>
      </div>
    </div>
  );
});

SortableCharacterCard.displayName = 'SortableCharacterCard';
