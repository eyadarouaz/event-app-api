import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { Body, Controller, Delete, Get, Param, Put, UseGuards, Request, Post, UseInterceptors, UploadedFile, StreamableFile, Res, ClassSerializerInterceptor, ValidationPipe, ForbiddenException } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserService } from "./user.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'graceful-fs';
import { join } from 'path';
import { Response } from 'express';
import { RegisterDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { strategies } from 'src/shared/constants';

@ApiTags('user')
@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard(strategies.admin))
  @Post('register')
  async register (@Body() registerDto : RegisterDto ){
    return this.userService.createUser(registerDto);
  }

  @UseGuards(AuthGuard(strategies.admin))
  @Put('update/:id')
  async updateUser(@Param('id') id: number, @Body() updateDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateDto);
  }


  @UseGuards(AuthGuard(strategies.admin))
  @Delete(':id')
  async deleteUser (@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('change-pwd')
  async updatePassword(@Request() req , @Body() passwordDto: UpdatePasswordDto) {
    return this.userService.changePassword(req.user.id, passwordDto);
  }
  
  @Get('all')
  @UseGuards(AuthGuard(strategies.admin))
  async getUsers(){
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('edit-profile') 
  async updateProfile(@Request() req, @Body() updateDto: UpdateProfileDto, ) {
    return this.userService.updateProfile(req.user.id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', { dest: "src/uploads/profile-pics" }))
  async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.userService.updatePhoto(req.user.id, file.filename);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-profile')
  async getMyProfile(@Request() req) {
    return this.userService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile/:id')
  async getUserProfile(@Param('id') id) {
    return this.userService.getProfile(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile-photo/:id')
  async getUserProfilePhoto(@Param('id') id: number, @Res({ passthrough: true }) res: Response) {
    res.set({'Content-Type': 'image/jpeg'});
    const user =  await this.userService.getUserById(id);
    const profilePhoto = user.profileImage;
    console.log(join(process.cwd(),'src/uploads/profile-pics/' + profilePhoto));
    //return res.sendFile(join(process.cwd(), 'src/uploads/profile-pics/' + profilePhoto));
    return new StreamableFile(createReadStream(join(process.cwd(), 'src/uploads/profile-pics', profilePhoto)));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-profile-photo')
  async getMyProfilePhoto(@Request() req, @Res({ passthrough: true }) res: Response) /*:Promise<StreamableFile>*/ {
    res.set({'Content-Type': 'image/jpeg'});
    const user =  await this.userService.getUserById(req.user.id);
    const profilePhoto = user.profileImage;
    //return res.sendFile(join(process.cwd()), 'src/uploads/profile-pics/' + profilePhoto);
    //return new StreamableFile(createReadStream(join(process.cwd(), 'src/uploads/profile-pics/', profilePhoto)));
  }

}