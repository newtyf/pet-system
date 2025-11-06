import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePetDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @IsString({ message: 'La especie debe ser un texto' })
  @IsNotEmpty({ message: 'La especie es requerida' })
  species: string;
}
