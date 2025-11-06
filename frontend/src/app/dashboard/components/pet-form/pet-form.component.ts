import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PetService } from '../../../core/services';
import { Pet, CreatePetDto, UpdatePetDto } from '../../../core/models';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.css'],
})
export class PetFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly petService = inject(PetService);

  @Input() pet: Pet | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  petForm!: FormGroup;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.petForm = this.fb.group({
      name: [
        this.pet?.name || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      ],
      species: [
        this.pet?.species || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
      ],
    });
  }

  get isEditMode(): boolean {
    return !!this.pet;
  }

  get title(): string {
    return this.isEditMode ? 'Editar Mascota' : 'Crear Nueva Mascota';
  }

  onSubmit(): void {
    if (this.petForm.invalid) {
      this.petForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.pet) {
      const updateData: UpdatePetDto = this.petForm.value;
      this.petService.updatePet(this.pet.id, updateData).subscribe({
        next: () => {
          this.loading = false;
          this.saved.emit();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar la mascota';
          console.error('Error:', error);
        },
      });
    } else {
      const createData: CreatePetDto = this.petForm.value;
      this.petService.createPet(createData).subscribe({
        next: () => {
          this.loading = false;
          this.saved.emit();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al crear la mascota';
          console.error('Error:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.petForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.petForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['minlength']) {
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors['maxlength']) {
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
    if (field.errors['max']) return `El valor máximo es ${field.errors['max'].max}`;

    return 'Campo inválido';
  }
}
