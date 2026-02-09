export interface DeclutterItem {
  title: string;
  action: string;
}

export interface FurnitureItem {
  item: string;
  suggestion: string;
  priceEstimate?: string;
}

export interface RoomAnalysis {
  roomType: string;
  styleAnalysis: string;
  decluttering: DeclutterItem[];
  furniture: FurnitureItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AppView {
  HOME = 'HOME',
  UPLOAD = 'UPLOAD',
  RESULTS = 'RESULTS',
  CHAT = 'CHAT' // This might be an overlay, but keeping it as a view option for mobile logic
}
