import { RolesGuard } from './../auth/roles.guard';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Put, UseGuards, Request, Post, UseInterceptors, UploadedFile, StreamableFile, Res } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserService } from "./user.service";
import { Roles } from 'src/shared/role.decorator';
import { Role } from 'src/shared/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'graceful-fs';
import { join } from 'path';
import { Response } from 'express';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteUser (@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all')
  getUsers(){
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Put('edit-profile') 
  updateProfile(@Request() req, @Body() updateDto: UpdateProfileDto, ) {
    return this.userService.updateProfile(req.user.sub, updateDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  updateRole(@Param('id') id: number) {
    return this.userService.makeAdmin(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', { dest: "src/uploads/profile-pics" }))
  uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.userService.updatePhoto(req.user.sub, file.filename);
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
    const user =  await this.userService.getUserById(req.sub);
    const profilePhoto = user.profileImage;
    return new StreamableFile(createReadStream(join(process.cwd(), 'src/uploads/profile-pics', profilePhoto)));
  }


}