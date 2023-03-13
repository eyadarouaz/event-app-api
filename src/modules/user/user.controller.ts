import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './../auth/roles.guard';
import { Body, Controller, Delete, Get, Param, Put, UseGuards, Request, Post, UseInterceptors, UploadedFile, StreamableFile, Res, ClassSerializerInterceptor } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserService } from "./user.service";
import { Roles } from 'src/shared/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'graceful-fs';
import { join } from 'path';
import { Response } from 'express';
import { RegisterDto } from './dto/create-user.dto';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register (@Body() registerDto : RegisterDto ){
    return this.userService.createUser(registerDto);
  }

  @Put('update/:id')
  async updateUser(@Param('id') id: number, @Body() updateDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateDto);
  }

  @Put('change-pwd')
  async updatePassword(@Request() req , @Body() passwordDto: UpdatePasswordDto) {
    return this.userService.changePassword(req.user.id, passwordDto);
  }

  @Delete(':id')
  async deleteUser (@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('all')
  async getUsers(){
    return this.userService.getAllUsers();
  }

  @Put('edit-profile') 
  async updateProfile(@Request() req, @Body() updateDto: UpdateProfileDto, ) {
    return this.userService.updateProfile(req.user.id, updateDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', { dest: "src/uploads/profile-pics" }))
  async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    console.log(file);
    //return this.userService.updatePhoto(req.user.id, file.filename);
  }

  @Get('my-profile')
  async getMyProfile(@Request() req) {
    console.log(req);
    return this.userService.getProfile(req.user.id);
  }


  @Get('profile/:id')
  async getUserProfile(@Param('id') id) {
    return this.userService.getProfile(id);
  }

  @Get('profile-photo/:id')
  async getUserProfilePhoto(@Param('id') id: number, @Res({ passthrough: true }) res: Response) :Promise<StreamableFile> {
    res.set({'Content-Type': 'image/jpeg'});
    const user =  await this.userService.getUserById(id);
    const profilePhoto = user.profileImage;
    return new StreamableFile(createReadStream(join(process.cwd(), 'src/uploads/profile-pics', profilePhoto)));
  }

  @Get('my-profile-photo')
  async getMyProfilePhoto(@Request() req, @Res({ passthrough: true }) res: Response) :Promise<StreamableFile> {
    res.set({'Content-Type': 'image/jpeg'});
    const user =  await this.userService.getUserById(req.user.id);
    const profilePhoto = user.profileImage;
    return new StreamableFile(createReadStream(join(process.cwd(), 'src/uploads/profile-pics', profilePhoto)));
  }

}