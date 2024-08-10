import { Injectable,BadRequestException,ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/schemas/category.schema';
import { Form } from 'src/schemas/form.schema';
import { FormResponse } from 'src/schemas/formresponse.schema';

@Injectable()
export class WebService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @InjectModel(Form.name) private formModel: Model<Form>,
        @InjectModel(FormResponse.name) private formResponseModel: Model<FormResponse>
    ) {}
    async getForm(id){
        const d =  await this.formModel
        .findById(id)
        .populate('category')
        .lean()
        .exec();
        return d;
    }

    async formatFields(id){
        try {
            const d =  await this.formModel
        .findById(id)
        .populate('category')
        .lean()
        .exec();
        const fields = d.fields||[];
        if( Object.values(fields).length>0){
            var outputJson = [];
            Object.values(fields).forEach((item, index) => {
                var fld = {};
                if(item.type=='checkbox'){
                    fld={
                        type: "checkbox",
                        isRequired:item.required,
                        name: "q_"+index,
                        title: item.title,
                        choices:item.options||[]
                    };
                }else if(item.type=='radio'){
                    fld={
                        type: "radiogroup",
                        isRequired:item.required,
                        name: "q_"+index,
                        title: item.title,
                        choices:item.options||[]
                    };
                }else if(item.type=='select'){
                    fld={
                        type: "dropdown",
                        isRequired:item.required,
                        name: "q_"+index,
                        title: item.title,
                        choices:item.options||[]
                    };
                }else if(item.type=='textarea'){
                    fld={
                        type: "comment",
                        isRequired:item.required,
                        name: "q_"+index,
                        title: item.title,
                    };
                }else if(item.type=='rating'){
                    fld={
                        type: "rating",
                        name: "q_"+index,
                        title: item.title,
                        isRequired: item.required,
                        rateMin: 1,
                        rateMax: item.options.value,
                        rateType: item.options.icon=='ph-smiley-wink'?"smileys":"stars",
                        scaleColorMode: "colored",
                    };
                }else if(item.type=='file'){
                    fld={
                        type: "file",
                        name: "q_"+index,
                        title: item.title,
                        isRequired: item.required,
                        storeDataAsText: false,
                        allowMultiple: false,
                        maxSize: 1024000,
                        acceptedTypes: "image/jpeg,image/png,application/pdf,application/doc,,application/docx,,application/csv,application/xls,,application/xlsx"
                    }
                }else if(item.type=='files'){
                    fld={
                        type: "file",
                        name: "q_"+index,
                        title: item.title,
                        isRequired: item.required,
                        storeDataAsText: false,
                        allowMultiple: true,
                        maxSize: 1024000,
                        acceptedTypes: "image/jpeg,image/png,application/pdf,application/doc,,application/docx,,application/csv,application/xls,,application/xlsx"
                    }
                }else{
                    fld={
                        type: "text",
                        isRequired:item.required,
                        name: "q_"+index,
                        inputType: item.type,
                        title: item.title
                    };
                }
                outputJson.push(fld);
              });
              return outputJson;
            }else{
                return [];
            }
        } catch (error) {
            throw new ConflictException(error);
        }
    }

    async saveFormResponse(jsonData){
        try {
            return await this.formResponseModel.findOneAndUpdate({
                $and:[
                    {
                        $or:[{uId:jsonData?.uId},{sessionId:jsonData?.sessionId}]
                    },
                    {
                        formId:jsonData?.formId,
                    }
                ]
            },jsonData,{
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }).exec();
        } catch (error) {
            throw new BadRequestException(error?.message||'Data not saved');
        }
    }
}
