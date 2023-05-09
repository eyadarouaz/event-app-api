import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SurveyResponse } from "./survey-response.entity";
import { Survey } from "./survey.entity";

@Entity()
export class SurveyOption {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: string;

    @ManyToOne(
        () => Survey,
        (survey: Survey) => survey.options,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'survey_id' })
    survey: Survey;

    @OneToMany(
        () => SurveyResponse, 
        (response: SurveyResponse) => response.option
    )
    responses: SurveyResponse[];



}