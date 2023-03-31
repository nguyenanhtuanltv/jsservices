// Tham chiếu đến thư viện http của node
const http = require("http");
// Tham chiếu thư viện xử lý tập tin của node
const fs = require("fs");
// Khai báo cổng cho dịch vụ
const port = 8080;

// Tham chiếu đến thư viện MongoDB
const db = require("./mongoDB")
// Tham chiếu đến thư viện SendMail
const sendMail=require("./sendMail");
// Tham chiếu đến thư viện SMS
const sms=require("./XL_SMS");

const dich_vu = http.createServer((req, res) => {
    // Cấp quyền
    res.setHeader("Access-Control-Allow-Origin", '*');
    // Method
    let method = req.method;
    // url
    let url = req.url;
   
    let ket_qua = `Server Node JS - Method: ${method} - Url: ${url}`;

    if (method == "GET") {
        
        if (url == "/dsTivi") {
            db.getAll("tivi").then(result => {
                ket_qua = JSON.stringify(result);
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(ket_qua);
            }).catch(err=>{
                console.log(err);
            })
        } else if (url == "/dsDienthoai") {
            db.getAll("mobile").then(result => {
                ket_qua = JSON.stringify(result);
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(ket_qua);
            }).catch(err=>{
                console.log(err);
            })
        }else if (url == "/dsHocsinh") {
            db.getAll("student").then(result => {
                ket_qua = JSON.stringify(result);
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(ket_qua);
            }).catch(err=>{
                console.log(err);
            })
        }else if (url == "/dsMathang") {
            db.getAll("food").then(result => {
                ket_qua = JSON.stringify(result);
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(ket_qua);
            }).catch(err=>{
                console.log(err);
            })
        }else if (url == "/Cuahang") {
            db.getAll("store").then(result => {
                ket_qua = JSON.stringify(result);
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(ket_qua);
            }).catch(err=>{
                console.log(err);
            })
        } else if (url.match("\.png$")) {
            let imagePath = `images/${url}`;
            if (!fs.existsSync(imagePath)) {
                imagePath = `images/noImage.png`;
            }
            let fileStream = fs.createReadStream(imagePath);
            res.writeHead(200, { "Content-Type": "image/png" });
            fileStream.pipe(res);

        } else {
            ket_qua = `Method: ${method} - Url: ${url} - Error`;
            res.end(ket_qua);
        }

    } else if (method == "POST") {
        // Nhận Tham số từ Client gởi về
        let noi_dung_nhan = '';
        req.on("data", (data) => {
            noi_dung_nhan += data
        })
        // Xử lý Tham số, trả kết quả về cho client
        if (url == "/ThemNguoidung") {
            req.on("end", () => {
                let dsNguoidung = JSON.parse(fs.readFileSync("./data/Nguoi_dung.json", "utf8"));
                let nguoiDung = JSON.parse(noi_dung_nhan);
                dsNguoidung.push(nguoiDung)
                fs.writeFileSync("./data/Nguoi_dung.json", JSON.stringify(dsNguoidung), "utf8");
                res.end(JSON.stringify({ "ket_qua": true }));
            })
        } else if (url == "/SuaNguoidung") {
            req.on("end", () => {
                let dsNguoidung = JSON.parse(fs.readFileSync("./data/Nguoi_dung.json", "utf8"));
                let nguoiDung = JSON.parse(noi_dung_nhan);
                let vt = dsNguoidung.findIndex(x => x.Ma_so == nguoiDung.Ma_so);

                dsNguoidung[vt].Ho_ten = nguoiDung.Ho_ten;
                dsNguoidung[vt].Ten_Dang_nhap = nguoiDung.Ten_Dang_nhap;
                dsNguoidung[vt].Mat_khau = nguoiDung.Mat_khau;
                fs.writeFileSync("./data/Nguoi_dung.json", JSON.stringify(dsNguoidung), "utf8");
                res.end(JSON.stringify({ "ket_qua": true }));

            })
        } else if (url == "/XoaNguoidung") {
            req.on("end", () => {
                let dsNguoidung = JSON.parse(fs.readFileSync("./data/Nguoi_dung.json", "utf8"));
                let nguoiDung = JSON.parse(noi_dung_nhan);
                let vt = dsNguoidung.findIndex(x => x.Ma_so == nguoiDung.Ma_so);
                dsNguoidung.splice(vt, 1);
                fs.writeFileSync("./data/Nguoi_dung.json", JSON.stringify(dsNguoidung), "utf8");
                res.end(JSON.stringify({ "ket_qua": true }));
            })
        }else if(url=="/Lienhe"){
            req.on("end",()=>{
                
                let ket_qua = { "Noi_dung": true };
                let from=`ltv.javascript@gmail.com`;
                let to=`ltv.javascript@gmail.com`;
                
                let contact=JSON.parse(noi_dung_nhan);
                let subject=contact.subject;
                let body=contact.body;
                
                sendMail.Goi_Thu_Lien_he(from,to,subject,body).then(result=>{
                    console.log(result);
                    res.end(JSON.stringify(ket_qua))
                }).catch(err=>{
                    console.log(err);
                    ket_qua.Noi_dung=false;
                    res.end(JSON.stringify(ket_qua))    
                })
            })
        }else if(url=="/SMS"){
            req.on("end",()=>{
                let ket_qua = { "Noi_dung": true };
                let so_dien_thoai=``
                let noi_dung=`Test SMS From Service javaScript`
                sms.Goi_Tin_nhan(so_dien_thoai,noi_dung).then(result=>{
                    console.log(result)
                    res.end(JSON.stringify(ket_qua))
                }).catch(err=>{
                    console.log(err);
                    ket_qua.Noi_dung=false;
                    res.end(JSON.stringify(ket_qua));
                })
            })
        }

    } else {
        res.end(ket_qua);
    }
})


dich_vu.listen(port, () => {
    console.log(`Server http://localhost:${port} run ....`)
})