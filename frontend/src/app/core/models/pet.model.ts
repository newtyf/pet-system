export interface Pet {
  id: number;
  name: string;
  species: string;
  ownerId: number;
  owner?: {
    id: number;
    email: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetDto {
  name: string;
  species: string;
}

export interface UpdatePetDto {
  name?: string;
  species?: string;
}
