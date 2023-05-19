import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Survey } from 'src/entities/survey.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SurveyOption } from './../../entities/survey-option.entity';
import { SurveyResponse } from './../../entities/survey-response.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveysRepository: Repository<Survey>,
    @InjectRepository(SurveyOption)
    private surveyOptionsRepository: Repository<SurveyOption>,
    @InjectRepository(SurveyResponse)
    private surveyResponsesRepository: Repository<SurveyResponse>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async createSurvey(surveyDto: CreateSurveyDto, user: User) {
    try {
      //Create survey
      const survey = await this.surveysRepository.create({
        question: surveyDto.question,
        dueDate: surveyDto.dueDate,
      });
      await this.surveysRepository.save(survey);
      //Assign options to survey
      surveyDto.options.forEach((value) => {
        value.survey = survey;
      });

      //Create options
      await this.surveyOptionsRepository
        .createQueryBuilder()
        .insert()
        .into(SurveyOption)
        .values(surveyDto.options)
        .execute();

      //Create survey post
      const surveyPost = this.postsRepository.create({
        surveyPost: survey,
        user: user,
      });
      await this.postsRepository.save(surveyPost);

      return survey;
    } catch (err) {
      throw new HttpException(
        'Cannot create survey',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSurvey(id: number, surveyDto: UpdateSurveyDto) {
    try {
      const survey = await this.getSurvey(id);

      this.surveysRepository.update(
        { id: id },
        {
          question: surveyDto.question,
          dueDate: surveyDto.dueDate,
        },
      );
      const option_id = survey.options.map((option) => option.id);
      console.log(option_id);
      if (option_id.length == 0 && surveyDto.options.length > 0) {
        surveyDto.options.forEach((value) => {
          value.survey = survey;
        });
        await this.surveyOptionsRepository
          .createQueryBuilder()
          .insert()
          .into(SurveyOption)
          .values(surveyDto.options)
          .execute();
        return survey;
      } else {
        for (let i = 0; i < option_id.length; i++) {
          console.log(option_id[i]);
          console.log(surveyDto.options[i]);
          this.surveyOptionsRepository
            .createQueryBuilder()
            .update(SurveyOption)
            .set({ value: surveyDto.options[i].value, survey: survey })
            .where({ survey: { id: id }, id: option_id[i] })
            .execute();
        }
      }
      return survey;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteSurvey(id: number) {
    try {
      return this.surveysRepository.delete({ id: id });
    } catch (err) {
      throw new HttpException(
        'Cannot delete survey',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async voteSurvey(surveyId: number, userId: number, optionId: number) {
    const survey = await this.getSurvey(surveyId);
    if (survey) {
      if ((await this.hasVoted(surveyId, userId)).canVote == true) {
        const opts = await this.getSurveyOptions(survey.id);
        if (opts.some((element) => element.id === optionId)) {
          const vote = await this.surveyResponsesRepository.create({
            user: { id: userId },
            option: { id: optionId },
          });
          return this.surveyResponsesRepository.save(vote);
        }
        throw new NotFoundException('option does not exists');
      }
      throw new ConflictException('you have already voted in this survey');
    }
    throw new NotFoundException('Survey not found');
  }

  async hasVoted(surveyId: number, userId: number) {
    const hasVoted = await this.surveyResponsesRepository.find({
      relations: { user: true },
      where: { user: { id: userId }, option: { survey: { id: surveyId } } },
    });
    if (hasVoted.length > 0) {
      return { canVote: false };
    }
    return { canVote: true };
  }

  //Getters

  async getOptionById(id: number) {
    return this.surveyOptionsRepository.findOne({ where: { id: id } });
  }

  async getSurveys() {
    const [list, count] = await this.surveysRepository.findAndCount();
    return { list, count };
  }

  async getSurvey(id: number) {
    return this.surveysRepository.findOne({
      relations: { options: true },
      where: { id: id },
    });
  }

  async getSurveyOptions(id: number) {
    return this.surveyOptionsRepository.find({
      where: {
        survey: { id: id },
      },
    });
  }

  async getVotesByOption(surveyId: number, optionId: number) {
    const [list, count] = await this.surveyResponsesRepository.findAndCount({
      relations: { user: true },
      where: {
        option: { id: optionId, survey: { id: surveyId } },
      },
    });
    return { list, count };
  }

  async getSurveyResponse(id: number) {
    const [list, count] = await this.surveyResponsesRepository.findAndCount({
      relations: { user: true, option: true },
      where: {
        option: { survey: { id: id } },
      },
    });
    return { list, count };
  }
}
