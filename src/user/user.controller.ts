import { RolesGuard } from './../auth/roles.guard';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Put, UseGuards, Request, Post } from "@nestjs/common";
import { UpdateInfoDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { Roles } from 'src/shared/role.decorator';
import { Role } from 'src/shared/role.enum';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':pass')
  getHash(@Param('pass') password){
    return this.userService.hashing(password);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteUser (@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @Get()
  getUsers(){
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Put('info/:id') 
  updateInfo(@Param('id') id, @Body() updateDto: UpdateInfoDto, ) {
    return this.userService.updateInfo(id, updateDto);
  }


}