
const axios = require('axios');
const accessToken = "EAB8Ua78ecTYBOZBkT2MMoZCYv3ZA4DDCURFFVpymRXf4kppjzd2fy3Asfm2v02gQDZCqXYCVhk8JeqW8CDdlOj41KJ2uZBnYj4cQEHXvMY6O1EInGW27MSZAeaCgCuH803BgfmnjMlBk6NpPuIYUoM15CCjK15aw4d5imPydkMVUWbgZCc1V5HgHjEOFo5mPZAmXLQZDZD";
const apiEndpoint = 'https://graph.facebook.com/v20.0';
const whatsappPhoneNumberId = '418092468045472';
export async function sendWelcomeTemplateMessage(to){
    try {
        const recipientPhoneNumber=to;
        axios.post(`${apiEndpoint}/${whatsappPhoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        recipient_type: "individual",
        to: recipientPhoneNumber,
        type:'template',
        template: {
            "name": "welcome",
            "language": {
            "code": "en"
            },
        }
        }, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
        })
        .then(response => console.log(response.data))
        .catch(error => console.error(error));
    } catch (error) {
        throw new Error(error);
    }
}


