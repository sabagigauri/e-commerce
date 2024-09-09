import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy'; 
import { JwtAuthGuard } from './jwt-auth.guard'; 

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your-jwt-secret', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
