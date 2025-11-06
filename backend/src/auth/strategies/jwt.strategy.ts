import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * JwtStrategy valida el token JWT y obtiene el usuario actualizado de la BD.
 * Esto garantiza que cambios en el rol u otros datos del usuario se reflejen inmediatamente.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.['access_token'] as string;
          if (!token) {
            return null;
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.userId) {
      throw new UnauthorizedException('Token inválido');
    }

    // Obtener usuario actualizado de la base de datos
    const user = await this.usersService.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Retornar datos actualizados desde la BD (no del token)
    return {
      userId: user.id,
      email: user.email,
      role: user.role, // ← Rol actualizado desde la BD
    };
  }
}
