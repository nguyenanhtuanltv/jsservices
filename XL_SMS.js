const twilio = require('twilio');
class XL_Goi_tin_nhan{
    Goi_Tin_nhan(so_dien_thoai,noi_dung){
        let accountSid = ''; // Your Account SID from www.twilio.com
        let authToken = '';   // Your Auth Token from www.twilio.com
        let client = new twilio(accountSid, authToken);
        return client.messages.create({
            body: noi_dung,
            to: so_dien_thoai,   
            from: '' // Số điện thoại dịch vụ cung cấp 
        })
    }
}
var Goi_Tin_nhan=new XL_Goi_tin_nhan()
module.exports= Goi_Tin_nhan