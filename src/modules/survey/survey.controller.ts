import { strategies } from './../../shared/constants';
import { AuthGuard } from '@nestjs/passport';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyService } from './survey.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@ApiTags('survey')
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @UseGuards(AuthGuard(strategies.admin))
  @Post()
  async createSurvey(
    @Body(new ValidationPipe()) surveyDto: CreateSurveyDto,
    @Request() req,
  ) {
    return this.surveyService.createSurvey(surveyDto, req.user);
  }

  @UseGuards(AuthGuard(strategies.admin))
  @Put(':id')
  async updateSurvey(
    @Param('id') id: number,
    @Body(new ValidationPipe()) surveyDto: UpdateSurveyDto,
  ) {
    return this.surveyService.updateSurvey(id, surveyDto);
  }

  @UseGuards(AuthGuard(strategies.admin))
  @Delete(':id')
  async deleteSurvey(@Param('id', ParseIntPipe) id: number) {
    return this.surveyService.deleteSurvey(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/vote')
  async voteSurvey(
    @Request() req,
    @Param('id', ParseIntPipe) surveyId: number,
    @Body('option', ParseIntPipe) optionId: number,
  ) {
    return this.surveyService.voteSurvey(surveyId, req.user.id, optionId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getSurveys() {
    return this.surveyService.getSurveys();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getSurvey(@Param('id', ParseIntPipe) id: number) {
    return this.surveyService.getSurvey(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/votes')
  async getVotesBySurvey(@Param('id', ParseIntPipe) id: number) {
    return this.surveyService.getSurveyResponse(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/options')
  async getOptionsBySurvey(@Param('id', ParseIntPipe) id: number) {
    return this.surveyService.getSurveyOptions(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/has-voted')
  async hasVoted(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.surveyService.hasVoted(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/:option/votes-by-option')
  async getVotesByOption(
    @Param('id', ParseIntPipe) id: number,
    @Param('option', ParseIntPipe) option: number,
  ) {
    return this.surveyService.getVotesByOption(id, option);
  }
}
