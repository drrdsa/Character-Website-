import React from 'react';
import { X, Edit } from 'lucide-react';
import { Character } from '../types';

interface CharacterDetailProps {
  character: Character;
  onClose: () => void;
  onEdit: (character: Character) => void;
}

export function CharacterDetail({ character, onClose, onEdit }: CharacterDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-4 flex justify-between items-center border-b border-purple-500/20">
          <h2 className="text-2xl font-bold text-white">{character.name}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(character)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors text-purple-400 hover:text-purple-300"
            >
              <Edit className="w-6 h-6" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={character.imageUrl || 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&q=80&w=2047&ixlib=rb-4.0.3'}
                alt={character.name}
                className="w-full rounded-lg shadow-lg"
              />
              
              <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Character Stats</h3>
                <div className="space-y-2">
                  {Object.entries(character.stats).map(([stat, value]) => (
                    <div key={stat} className="flex items-center">
                      <span className="text-gray-400 capitalize w-24">{stat}</span>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(value / 100) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-400 ml-2 w-8">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Class</h3>
                <p className="text-gray-300">{character.class}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Background</h3>
                <p className="text-gray-300 whitespace-pre-line">{character.background}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Story</h3>
                <p className="text-gray-300 whitespace-pre-line">{character.story}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
