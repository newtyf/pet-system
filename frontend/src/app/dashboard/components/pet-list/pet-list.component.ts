import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PetService, AuthService } from '../../../core/services';
import { Pet, UserRole } from '../../../core/models';
import { PetFormComponent } from '../pet-form/pet-form.component';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    PetFormComponent,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css'],
})
export class PetListComponent implements OnInit {
  private readonly petService = inject(PetService);
  private readonly authService = inject(AuthService);

  pets = signal<Pet[]>([]);
  loading = signal<boolean>(false);
  showModal = signal<boolean>(false);
  selectedPet = signal<Pet | null>(null);

  currentUser$ = this.authService.currentUser$;

  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.updateDisplayedColumns();
    this.loadPets();
  }

  updateDisplayedColumns(): void {
    if (this.isAdmin()) {
      this.displayedColumns = ['name', 'species', 'owner', 'createdAt', 'actions'];
    } else {
      this.displayedColumns = ['name', 'species', 'createdAt', 'actions'];
    }
  }

  loadPets(): void {
    this.loading.set(true);
    this.petService.getAllPets().subscribe({
      next: (pets) => {
        this.pets.set(pets);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando mascotas:', error);
        this.loading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.selectedPet.set(null);
    this.showModal.set(true);
  }

  openEditModal(pet: Pet): void {
    this.selectedPet.set(pet);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedPet.set(null);
  }

  onPetSaved(): void {
    this.closeModal();
    this.loadPets();
  }

  deletePet(pet: Pet): void {
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar a "${pet.name}"? Esta acción no se puede deshacer.`
      )
    ) {
      this.petService.deletePet(pet.id).subscribe({
        next: () => {
          this.loadPets();
        },
        error: (error) => {
          console.error('Error eliminando mascota:', error);
          alert('Error al eliminar la mascota. Por favor, intenta de nuevo.');
        },
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  canEdit(pet: Pet): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    if (currentUser.role === UserRole.ADMIN) return true;

    return pet.ownerId === currentUser.id;
  }

  canDelete(pet: Pet): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    if (currentUser.role === UserRole.ADMIN) return true;

    return pet.ownerId === currentUser.id;
  }
}
