import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, ImagePlus, PlusCircle, Trash2 } from 'lucide-react';
import { Character } from '../types';

interface CharacterUploadProps {
  onSave: (character: Character) => void;
  onClose: () => void;
  editCharacter?: Character;
}

export function CharacterUpload({ onSave, onClose, editCharacter }: CharacterUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [character, setCharacter] = useState<Partial<Character>>({
    stats: {}
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (editCharacter) {
      setCharacter(editCharacter);
      setImagePreview(editCharacter.imageUrl);
    } else {
      // Initialize with some default stats if it's a new character
      setCharacter({
        stats: { strength: 50, agility: 50, intelligence: 50, charisma: 50 }
      });
    }
  }, [editCharacter]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setCharacter(prev => ({ ...prev, imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatChange = (stat: string, value: string) => {
    setCharacter(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: value === 'unknown' ? 'unknown' : parseInt(value)
      }
    }));
  };

  const handleAddStat = () => {
    const newStatName = prompt("Enter the new stat name:");
    if (newStatName) {
      setCharacter(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [newStatName]: 50
        }
      }));
    }
  };

  const handleDeleteStat = (stat: string) => {
    const { [stat]: deletedStat, ...rest } = character.stats as any;
    setCharacter(prev => ({
      ...prev,
      stats: rest
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (character.name && character.imageUrl) {
      // Basic validation to ensure stats are not undefined
      if (!character.stats) {
        alert("Please add at least one stat.");
        return;
      }

      onSave({
        id: editCharacter?.id || Date.now().toString(),
        name: character.name,
        imageUrl: character.imageUrl,
        shortDescription: character.shortDescription || '',
        story: character.story || '',
        stats: character.stats!,
        background: character.background || '',
        class: character.class || '',
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-4 flex justify-between items-center border-b border-purple-500/20">
          <h2 className="text-2xl font-bold text-white">
            {editCharacter ? 'Edit Character' : 'Add New Character'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Character Image
            </label>
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Character preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer rounded-lg"
                  >
                    <ImagePlus className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center hover:border-purple-500 transition-colors"
                >
                  <ImagePlus className="w-8 h-8 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              required
              value={character.name || ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
              onChange={(e) => setCharacter({ ...character, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Class
            </label>
            <input
              type="text"
              value={character.class || ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
              onChange={(e) => setCharacter({ ...character, class: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Short Description
            </label>
            <input
              type="text"
              value={character.shortDescription || ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
              onChange={(e) => setCharacter({ ...character, shortDescription: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Background
            </label>
            <textarea
              value={character.background || ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white h-24"
              onChange={(e) => setCharacter({ ...character, background: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Story
            </label>
            <textarea
              value={character.story || ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white h-32"
              onChange={(e) => setCharacter({ ...character, story: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Stats
            </label>
            <div className="space-y-4">
              {Object.entries(character.stats || {}).map(([stat, value]) => (
                <div key={stat} className="flex items-center">
                  <span className="text-gray-400 capitalize w-24">{stat}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={typeof value === 'number' ? value : 50}
                    disabled={value === 'unknown'}
                    className="flex-1 h-2 bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 disabled:bg-gray-600"
                    onChange={(e) => handleStatChange(stat, e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={typeof value === 'number' ? value : ''}
                    placeholder="Unknown"
                    className="w-20 bg-gray-800 border border-gray-700 rounded-lg p-1 text-white text-center ml-2"
                    onChange={(e) => handleStatChange(stat, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteStat(stat)}
                    className="ml-2 p-1 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddStat}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add Stat
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {editCharacter ? 'Save Changes' : 'Save Character'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
