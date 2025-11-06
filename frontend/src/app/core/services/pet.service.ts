import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet, CreatePetDto, UpdatePetDto } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/pets`;

  getAllPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.API_URL, {
      withCredentials: true,
    });
  }

  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.API_URL}/${id}`, {
      withCredentials: true,
    });
  }

  createPet(petData: CreatePetDto): Observable<{ message: string; pet: Pet }> {
    return this.http.post<{ message: string; pet: Pet }>(this.API_URL, petData, {
      withCredentials: true,
    });
  }

  updatePet(id: number, petData: UpdatePetDto): Observable<{ message: string; pet: Pet }> {
    return this.http.patch<{ message: string; pet: Pet }>(`${this.API_URL}/${id}`, petData, {
      withCredentials: true,
    });
  }

  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, {
      withCredentials: true,
    });
  }
}
