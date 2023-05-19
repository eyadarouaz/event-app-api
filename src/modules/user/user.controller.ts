import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
  Request,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  ValidationPipe,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Response } from 'express';
import { RegisterDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { strategies } from 'src/shared/constants';
import * as fs from 'node:fs';
import { mkdir } from 'fs/promises';
import { diskStorage } from 'multer';
import * as random from 'random-string-generator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard(strategies.admin))
  @Post()
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    return this.userService.createUser(registerDto);
  }

  @UseGuards(AuthGuard(strategies.admin))
  @Put('update/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateDto);
  }

  @UseGuards(AuthGuard(strategies.admin))
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('change-password')
  async updatePassword(
    @Request() req,
    @Body(new ValidationPipe()) passwordDto: UpdatePasswordDto,
  ) {
    return this.userService.changePassword(req.user.id, passwordDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('edit-photo')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination(req, file, callback) {
          if (!fs.existsSync('src/uploads/profile-pics'))
            mkdir('src/uploads/profile-pics');
          callback(null, 'src/uploads/profile-pics');
        },
        filename(req, file, callback) {
          const name = random(15);
          callback(null, name + '.jpg');
        },
      }),
    }),
  )
  async updatePhoto(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updatePhoto(req.user.id, file.filename);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('edit-profile')
  async updateProfile(
    @Request() req,
    @Body(new ValidationPipe()) updateDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(req.user.id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-profile')
  async getMyProfile(@Request() req) {
    return this.userService.getUserById(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/profile')
  async getUserProfile(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id/profile-photo')
  async getUserProfilePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const user = await this.userService.getUserById(id);
    if (user) {
      const profilePhoto = user.profileImage;
      const filePath = join(
        process.cwd(),
        'src/uploads/profile-pics/' + profilePhoto,
      );
      res.set({ 'Content-Type': 'image/jpeg' });
      fs.readFile(filePath, function (err, content) {
        res.end(content);
      });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-profile-photo')
  async getMyProfilePhoto(@Request() req, @Res() res: Response) {
    res.set({ 'Content-Type': 'image/jpeg' });
    const user = await this.userService.getUserById(req.user.id);
    const profilePhoto = user.profileImage;
    const filePath = join(
      process.cwd(),
      'src/uploads/profile-pics/' + profilePhoto,
    );
    //   fs.readFile(filePath,
    //     function (err, content) {
    //         res.end(content);}
    // );
    return new StreamableFile(fs.createReadStream(filePath));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUserByUsername(@Param('id') id: string) {
    return this.userService.getUserByUsername(id);
  }
}
