import { strategies } from './../../shared/constants';
import { AuthGuard } from '@nestjs/passport';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyService } from './survey.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('survey')
@Controller('survey')
export class SurveyController {
    
    constructor(private readonly surveyService: SurveyService) {}

    @UseGuards(AuthGuard(strategies.admin))
    @Post()
    async createSurvey(@Body() surveyDto: CreateSurveyDto) {
        return this.surveyService.createSurvey(surveyDto);
    }

    @UseGuards(AuthGuard(strategies.admin))
    @Put()
    async updateSurvey() {
        
    }

    @UseGuards(AuthGuard(strategies.admin))
    @Delete(':id')
    async deleteSurvey(@Param('id') id) {
        return this.surveyService.deleteSurvey(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('vote/:id')
    async voteSurvey(@Request() req, @Param('id') surveyId, @Body('option') optionId) {
        return this.surveyService.voteSurvey(surveyId, req.user.id, optionId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('all')
    async getSurveys() {
        return this.surveyService.getAllSurveys();
    }

}