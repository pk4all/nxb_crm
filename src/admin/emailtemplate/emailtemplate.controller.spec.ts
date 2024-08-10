import { Test, TestingModule } from '@nestjs/testing';
import { EmailTemplateController } from './emailtemplate.controller';
import { EmailTemplateService } from './emailtemplate.service';

describe('EmailTemplateController', () => {
  let controller: EmailTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailTemplateController],
      providers: [EmailTemplateService],
    }).compile();

    controller = module.get<EmailTemplateController>(EmailTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
