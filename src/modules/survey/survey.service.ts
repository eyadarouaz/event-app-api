import { SurveyResponse } from './../../entities/survey-response.entity';
import { User } from './../../entities/user.entity';
import { SurveyOption } from './../../entities/survey-option.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Survey } from "src/entities/survey.entity";
import { Repository } from "typeorm";

@Injectable()
export class SurveyService {
    constructor(
        @InjectRepository(Survey)
        private surveysRepository: Repository<Survey>,
        @InjectRepository(SurveyOption)
        private surveyOptionsRepository: Repository<SurveyOption>,
        @InjectRepository(SurveyResponse)
        private surveyResponsesRepository: Repository<SurveyResponse>) {}

    async createSurvey(surveyDto: CreateSurveyDto) {
        try {
            //Create survey
            const survey = await this.surveysRepository.create({
                title: surveyDto.title,
                question: surveyDto.question,
                dueDate: surveyDto.dueDate});
            await this.surveysRepository.save(survey);
            //Assign options to survey
            surveyDto.options.forEach((value) => {value.survey = survey;});
            //Create options
            await this.surveyOptionsRepository.createQueryBuilder()
            .insert()
            .into(SurveyOption)
            .values(surveyDto.options)
            .execute();
            return survey;
        }catch(err) {
            throw new HttpException("Cannot create survey", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async updateSurvey(id: number) {}

    async deleteSurvey(id: number) {
        try {
            return this.surveysRepository.delete({id:id});
        }catch(err) {
            throw new HttpException("Cannot delete survey", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async voteSurvey(surveyId: number, userId: number, optionId: number) {
        const survey = await this.getSurvey(surveyId);
        if(survey) {
            const opts = await this.getSurveyOptions(survey.id);
            if(opts.some((element) => element.id === optionId)) {
                const vote = await this.surveyResponsesRepository.create({user: {id:userId}, option: {id:optionId}});
                return this.surveyResponsesRepository.save(vote);
            }
        }
        throw new NotFoundException ('Failed to vote');
    }

    //Getters

    async getOptionById(id: number) {
        return this.surveyOptionsRepository.findOne({where: {id: id}});
    }

    async getAllSurveys() {
        return this.surveysRepository.find();
    }

    async getSurvey(id: number) {
        return this.surveysRepository.findOne({where: {id: id}});
    }

    async getSurveyOptions(id: number) {
        return this.surveyOptionsRepository.find({relations: {survey: true}, where: {survey: {id:id}}});
    }

    async getSurveyResponse(id: number) {
        return this.surveyResponsesRepository.find({relations: {option: true}, where: {option: {survey: {id:id}}}});
    }

    
}