import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const mailPort = parseInt(this.configService.get('MAIL_PORT') || '465');
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST') || 'smtp.gmail.com',
      port: mailPort,
      secure: mailPort === 465, // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USER') || '',
        pass: this.configService.get('MAIL_PASS') || '',
      },
    });
  }

  async signup(name: string, email: string, pass: string, role: string = 'user'): Promise<any> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      isVerified: false,
    });

    await this.userRepository.save(user);

    await this.sendVerificationEmail(email, name, verificationToken);

    const { password, ...result } = user;
    return result;
  }

  private async sendVerificationEmail(email: string, name: string, token: string) {
    const appUrl = this.configService.get('APP_URL') || 'http://localhost:3000';
    const url = `${appUrl}/auth/verify/${token}`;

    const mailOptions = {
      from: `"Toy Store" <${this.configService.get('MAIL_USER')}>`,
      to: email,
      subject: 'Verify your Toy Store account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Welcome to Toy Store, ${name}!</h2>
          <p>Thank you for signing up. Please click the button below to verify your email address and activate your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #64748b;">${url}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">If you did not create an account, please ignore this email.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending failed:', error);
      // We don't throw here to avoid failing signup if email fails in dev
    }
  }

  async verifyEmail(token: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { verificationToken: token } });
    
    if (!user) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = null;
    await this.userRepository.save(user);

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async login(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email address before logging in.');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
