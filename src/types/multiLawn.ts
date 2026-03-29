export interface Lawn {
  id: string;
  name: string;
  grassType?: string;
  sizeSqFt?: number;
  notes?: string;
  createdAt: string;
}

export interface LawnManager {
  lawns: Lawn[];
  activeLawnId: string | null;
}
