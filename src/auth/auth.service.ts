import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../ms/Usuario/usuario.service';
import { CreateUsuarioDto } from '../ms/Usuario/dto/create-usuario.dto';
import * as bcrypt from 'bcryptjs'; // 👈 usar bcryptjs en lugar de bcrypt nativo

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuarioService,
  ) {}

  // 🔑 Validar credenciales de login
  async validateCredentials(identifier: string, password: string): Promise<any> {
    try {
      console.log('Validando credenciales:', { identifier });

      // Buscar usuario por Nombre (username)
      const users = await this.usuarioService.findAll();
      const user = users.find(
        (u) => u.Nombre.toLowerCase() === identifier.toLowerCase(),
      );

      if (!user) {
        console.log('Usuario no encontrado');
        return null;
      }

      // Comparar contraseñas
      const isPasswordValid = await bcrypt.compare(password, user.Contrasena);
      if (!isPasswordValid) {
        console.log('Contraseña incorrecta');
        return null;
      }

      // Retornar usuario sin la contraseña
      const { Contrasena: _, ...result } = user;
      return result;
    } catch (error) {
      console.error('Error en validateCredentials:', error);
      return null;
    }
  }

  // 🔑 Login
  async login(credentials: { identifier: string; password: string }) {
    try {
      const user = await this.validateCredentials(
        credentials.identifier,
        credentials.password,
      );
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const payload = {
        nombre: user.Nombre,
        sub: user.Id,
        role: user.Role || 'user',
      };

      return {
        status: 'success',
        message: 'Login exitoso',
        access_token: this.jwtService.sign(payload),
        role: user.Role || 'user',
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // 📝 Registro
  async register(userData: {
    username: string;
    nombre: string;
    apellidos?: string | null;
    email: string;
    password: string;
    role?: string;
  }) {
    try {
      if (!userData.username || !userData.nombre || !userData.email || !userData.password) {
        throw new Error('Todos los campos son requeridos');
      }

      // Verificar duplicados
      const users = await this.usuarioService.findAll();
      const existingUser = users.find(
        (u) =>
          u.Nombre.toLowerCase() === userData.username.toLowerCase() ||
          (u.Email && u.Email.toLowerCase() === userData.email.toLowerCase()),
      );
      if (existingUser) {
        throw new Error('El usuario ya existe');
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Crear DTO
      const createUsuarioDto: CreateUsuarioDto = {
        Id: 0,
        Nombre: userData.username,
        Contrasena: hashedPassword,
       Email: userData.email,
        Apellidos: userData.apellidos || '',
        Role: userData.role || 'user',
      };

      const result = await this.usuarioService.create(createUsuarioDto);

      return {
        status: 'success',
        message: 'Usuario registrado correctamente',
        data: {
          id: result.id,
          username: userData.username,
          email: userData.email,
          role: userData.role || 'user',
        },
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw new Error(error.message || 'Error al registrar el usuario');
    }
  }
}
