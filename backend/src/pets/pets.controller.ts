import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('pets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  async create(@Body() createPetDto: CreatePetDto, @CurrentUser() user: any) {
    const pet = await this.petsService.create(createPetDto, user.userId);
    return {
      message: 'Mascota creada exitosamente',
      pet,
    };
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async findAll(@CurrentUser() user: any) {
    return this.petsService.findAll(user.userId, user.role);
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.petsService.findOne(id, user.userId, user.role);
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
    @CurrentUser() user: any,
  ) {
    const pet = await this.petsService.update(
      id,
      updatePetDto,
      user.userId,
      user.role,
    );
    return {
      message: 'Mascota actualizada exitosamente',
      pet,
    };
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    await this.petsService.remove(id, user.userId, user.role);
  }
}
