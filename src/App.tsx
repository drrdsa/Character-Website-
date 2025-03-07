import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit } from 'lucide-react';
import { Character, Characters, SiteConfig } from './types';
import { CharacterCard } from './components/CharacterCard';
import { CharacterDetail } from './components/CharacterDetail';
import { CharacterUpload } from './components/CharacterUpload';
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { SortableCharacterCard } from './components/SortableCharacterCard';

const LOCAL_STORAGE_KEY = 'rpg-characters';

function App() {
  const [characters, setCharacters] = useState<Characters>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    title: 'Beneath a Shattered Sky',
    subtitle: 'A burning dream, a wild journey and four brave souls...'
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const storedCharacters = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCharacters) {
      setCharacters(JSON.parse(storedCharacters));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characters));
  }, [characters]);

  const handleSaveCharacter = (character: Character) => {
    if (editingCharacter) {
      setCharacters(characters.map(c => c.id === character.id ? character : c));
      setEditingCharacter(null);
    } else {
      setCharacters([...characters, character]);
    }
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setSelectedCharacter(null);
    setIsUploadOpen(true);
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCharacters((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div className="relative group">
            {isEditingTitle ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={siteConfig.title}
                  onChange={(e) => setSiteConfig({ ...siteConfig, title: e.target.value })}
                  className="bg-gray-800 text-3xl font-bold text-red-500 p-2 rounded-lg w-full"
                  placeholder="Enter title"
                />
                <input
                  type="text"
                  value={siteConfig.subtitle}
                  onChange={(e) => setSiteConfig({ ...siteConfig, subtitle: e.target.value })}
                  className="bg-gray-800 text-gray-400 p-2 rounded-lg w-full"
                  placeholder="Enter subtitle"
                />
                <button
                  onClick={handleSaveTitle}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Save
                </button>
              </div>
            ) : (
              <div
                className="cursor-pointer group"
                onClick={() => setIsEditingTitle(true)}
              >
                <h1 className="text-3xl font-bold text-purple-400 group-hover:text-purple-300">
                  {siteConfig.title}
                </h1>
                <p className="text-gray-400 mt-2 group-hover:text-gray-300">
                  {siteConfig.subtitle}
                </p>
                <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              setEditingCharacter(null);
              setIsUploadOpen(true);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Add Character
          </button>
        </div>

        {characters.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No characters added yet.</p>
            <p className="text-gray-500 mt-2">Click the "Add Character" button to get started!</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={characters.map((character) => character.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {characters.map((character) => (
                  <SortableCharacterCard
                    key={character.id}
                    id={character.id}
                    character={character}
                    onClick={() => setSelectedCharacter(character)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {selectedCharacter && (
        <CharacterDetail
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
          onEdit={handleEditCharacter}
        />
      )}

      {isUploadOpen && (
        <CharacterUpload
          onSave={handleSaveCharacter}
          onClose={() => {
            setIsUploadOpen(false);
            setEditingCharacter(null);
          }}
          editCharacter={editingCharacter || undefined}
        />
      )}
    </div>
  );
}

export default App;
