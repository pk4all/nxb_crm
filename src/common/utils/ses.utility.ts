import { 
    SESClient,
    CreateTemplateCommand,
    DeleteTemplateCommand,
    UpdateTemplateCommand,
    ListIdentitiesCommand,
    VerifyEmailIdentityCommand,
    GetIdentityVerificationAttributesCommand,
    GetSendQuotaCommand,
    SendBulkTemplatedEmailCommand
} from "@aws-sdk/client-ses";

const client = new SESClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIAQEIP3QQR57QNUCQ5",
        secretAccessKey: "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",
    },
});
export async function createTemplate(data){
    try {
        const input = { // CreateTemplateRequest
            Template: { // Template
                TemplateName:data?.templateSlug, // required
                SubjectPart: data?.templateSubject,
                //TextPart: "STRING_VALUE",
                HtmlPart: data?.templateContent,
            },
        };
        const command = new CreateTemplateCommand(input);
        const response = await client.send(command);
        console.log(response,'ses response');
        return response;
    } catch (error) {
        console.error(error,'ses error');
        throw new Error(error);
    }
}

export async function updateTemplate(data){
    try {
        const input = { // UpdateTemplateRequest
            Template: { // Template
                TemplateName:data?.templateSlug, // required
                SubjectPart: data?.templateSubject,
                //TextPart: "STRING_VALUE",
                HtmlPart: data?.templateContent,
            },
        };
        const command = new UpdateTemplateCommand(input);
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.error(error,'ses error');
        throw new Error(error);
    }
}

export async function deleteTemplate(templateName){
    try {
        const input = { // DeleteTemplateRequest
            TemplateName: templateName, // required
        };
        const command = new DeleteTemplateCommand(input);
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.error(error,'ses error');
        throw new Error(error);
    }
}

export async function listIdentities(){
    try {
        const input:any = { 
            "IdentityType": "EmailAddress",
            "MaxItems": 20,
            "NextToken": ""
        };
        const command = new ListIdentitiesCommand(input);
        const response = await client.send(command);
        return response;
    } catch (error) {
        throw new Error(error);
    }
    
}

export async function identitiesAttrs(data){
    try {
        const input = { // GetIdentityVerificationAttributesRequest
            Identities: data,
          };
        
        const command = new GetIdentityVerificationAttributesCommand(input);
        const response = await client.send(command);
        return response;
    } catch (error) {
        throw new Error(error);
    }
    
}

export async function sendVerificationEmail(email){
    try {
        const input = {
            EmailAddress:email,
        };
        const command = new VerifyEmailIdentityCommand(input);
        const response = await client.send(command);
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getSendingStatistics(){
    try {

        const input = {};
        const command = new GetSendQuotaCommand(input);
        const response = await client.send(command);
        return response;

    } catch (error) {
        throw new Error(error);
    }
}

export async function sendBulkTemplatedEmail(source,template,contacts){
    try {
        const input = { // SendBulkTemplatedEmailRequest
            Source: source, // required
            Template: template, // required
            DefaultTemplateData: "{ \"name\":\"User\"}",
            Destinations:contacts,
          };
        const command = new SendBulkTemplatedEmailCommand(input);
        const response = await client.send(command);
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

