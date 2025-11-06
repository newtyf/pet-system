import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
  ) {}

  async create(createPetDto: CreatePetDto, userId: number): Promise<Pet> {
    const pet = this.petsRepository.create({
      ...createPetDto,
      ownerId: userId,
    });

    return this.petsRepository.save(pet);
  }

  async findAll(userId: number, userRole: string): Promise<Pet[]> {
    if (userRole === UserRole.ADMIN) {
      return this.petsRepository.find({
        relations: ['owner'],
      });
    }

    return this.petsRepository.find({
      where: { ownerId: userId },
      relations: ['owner'],
    });
  }

  async findOne(id: number, userId: number, userRole: string): Promise<Pet> {
    const pet = await this.petsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }

    if (userRole === UserRole.CLIENT && pet.ownerId !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para ver esta mascota',
      );
    }

    return pet;
  }

  async update(
    id: number,
    updatePetDto: UpdatePetDto,
    userId: number,
    userRole: string,
  ): Promise<Pet> {
    const pet = await this.petsRepository.findOne({ where: { id } });

    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }

    if (userRole === UserRole.CLIENT && pet.ownerId !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para actualizar esta mascota',
      );
    }

    Object.assign(pet, updatePetDto);
    return this.petsRepository.save(pet);
  }

  async remove(id: number, userId: number, userRole: string): Promise<void> {
    const pet = await this.petsRepository.findOne({ where: { id } });

    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }

    if (userRole === UserRole.CLIENT && pet.ownerId !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar esta mascota',
      );
    }

    await this.petsRepository.remove(pet);
  }
}
