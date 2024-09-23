import { Controller,Get, Post,Render,Param,Res,Req,BadRequestException,UploadedFile,UseInterceptors, UploadedFiles } from '@nestjs/common';
import { WebService } from './web.service';
import { Response, Request } from 'express';
import { FileInterceptor,FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
@Controller()
export class WebController {
    constructor(private readonly webService: WebService) {}


    @Get('/')
    @Render('index')
    getHello(){
        return {message:'Test'};
    }

    @Get('/login')
    @Render('user/login')
    async login(){
        return {layout:'user_login'}
    }

    @Get('/register')
    @Render('user/register')
    async register(){
        return {layout:'user_login'}
    }

    @Get('/forgot-password')
    @Render('user/forgot_password')
    async forgotPassword(){
        return {layout:'user_login'}
    }

    @Get('/forms/:id')
    async frontForm(@Param('id') id: string,@Res() res: Response,@Req() req: Request){
        try {
            const f = await this.webService.getForm(id);
            const user = req.session?.user||{};
            //console.log(req.sessionID);
            res.render('frontend_form',{layout:'web',data:f,uid:user?user._id:req.sessionID});
        } catch (error) {
            return {layout:'web',data:[],error:error.message};
        }
    }
    @Get('/all-fields/:id?')
    async allFields(@Param('id') id: string,@Res() res: Response){
        try {
            const f = await this.webService.formatFields(id);
            res.json({outputJson:f});
        } catch (error) {
            res.json({error:error.message});
        }
    }
    @Post('/forms/save-response/:id')
    async saveResponse(@Param('id') id: string,@Res() res: Response,@Req() req: Request){
        var data = req?.body||{};
        const user = req.session?.user||{};
        const sessionID=req.sessionID;
        try {
            const saveRes = {
                uId:user._id??0,
                sessionId:sessionID,
                formId:id,
                formResponseType:user._id?'user':'anonymous',
                responses:data
            };
            const r = await this.webService.saveFormResponse(saveRes);
            res.json({status:'success',data:r});
        } catch (error) {
            res.json({status:'error',message:error.message});
        }
    }


    @Post('/save-file')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
            destination: './public/uploads/survey/files',
            filename: (req, file, cb) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
                const extension: string = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`);
            },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf|doc|docx|csv|xls|xlsx)$/)) {
                return cb(new BadRequestException('files are not allowed!'), false);
                }
                cb(null, true);
            },
      })
    )
    async saveImage(@Req() req: Request, @Res() res: Response,@UploadedFiles() files: Array<Express.Multer.File>){
        if(files){
           // console.log(files,'uploaded files');
            res.json({status:'success',files:files});
        }else{
            res.json({status:'error',message:'no file',files:''});
        }
    }
}
