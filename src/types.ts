export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  shortDescription: string;
  story: string;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    charisma: number;
  };
  background: string;
  class: string;
}

export type Characters = Character[];

export interface SiteConfig {
  title: string;
  subtitle: string;
}
