import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Protects a route with the 'jwt' Passport strategy. Applied per-route or
// per-controller via @UseGuards(JwtAuthGuard) once protected endpoints exist.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
