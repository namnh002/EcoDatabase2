var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {Schema} = require("mongoose");
var multer = require('multer');
var path = require("path");
var hash = "";

const URI = "mongodb+srv://namnguyen:Nguyenhuynam@cluster0.v1e36.mongodb.net/ontap?retryWrites=true&w=majority";
mongoose.connect(URI).catch(err => console.log('abc' + err));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    hash = Date.now() + '-' + Math.random() + '-';
    cb(null, hash + file.originalname)
  }
})
var upload = multer({
  storage: storage,
  dest: 'public/images/',
  limits: {fileSize: 2 * 1024 * 1024},
  fileFilter: function (req, file, cb) {
    var ten = file.mimetype;
    var tenAnh = file.originalname;
    console.log(ten);
    if(ten.indexOf('jpeg') > -1){
      if(tenAnh.length > 10){
        cb(new Error("Tên ảnh không được vượt quá 10 kí tự"), false);
      }else{
        cb(null, true);
      }
    }else{
      cb(new Error("Sai đuôi ảnh yêu cầu JPG"), false);
    }
  }
}).single('file');


const STUDENT = mongoose.model('images', new Schema({
  maoto: String,
  nhanhieu: String,
  namsanxuat: String,
  giagoc: String,
  fileName: String
}));
/* GET home page. */
router.get('/', function(req, res, next) {
  STUDENT.find({}, function (error, result) {
    if(error) throw error;
    res.render('index', { title: 'Express', data: result });
  })
});
router.get('/manager', function(req, res, next) {
  STUDENT.find({}, function (error, result) {
    if(error) throw error;
    res.render('manager', { title: 'Express', data: result });
  })
});
router.get('/sort', function (req,res,next){
  // var name = STUDENT.name.toString();
  // console.log(name)
  // var mysort = { name: -1 };
  // name.collection("customers").find().sort(mysort).toArray(function (error, result){
  //   if (error) throw error;
  //   console.log(result);
  // });
  const gia = req.query.nhanhieu;
  var mysort = { name: -1 };
  STUDENT.collection("customers").find().sort(mysort).toArray(function (error, result){
    if(error) throw error;
    res.render('index', { title: 'Express', data: result });
  })
})
router.get('/delete/', function(req, res, next) {
  const id = req.query.id;
  STUDENT.deleteOne({_id: id}, function (error) {
    if(error) throw error;
    res.send('Xóa thành công ID: ' + id);
  })
});

router.get('/updateForm/', function (req, res) {

  const id = req.query.id;
  STUDENT.findOne({_id: id}, function (error, result) {
    res.render('update', {title: 'Update', data: result})
  })

})


router.post('/update', async function (req, res) {
  const id = req.body.id;
  const maoto = req.body.maoto;
  const nhanhieu = req.body.nhanhieu;
  const namsanxuat = req.body.namsanxuat;
  const giagoc = req.body.giagoc;
  const fileName = req.body.fileName;


  await STUDENT.updateOne({_id: id}, {
    maoto: maoto,
    nhanhieu: nhanhieu,
    namsanxuat: namsanxuat,
    giagoc: giagoc,
    fileName: fileName
  }, null)

  res.redirect('/')
})
router.post('/create', async function (req, res) {
  // Load ảnh
  upload(req, res, async function (err) {
    if (err != null) {
      res.send(err.message);
    } else {
      //Không lỗi thì đẩy dữ liệu lên sv
      var id = req.body.id;
      var maoto = req.body.maoto;
      var nhanhieu = req.body.nhanhieu;
      var namsanxuat = req.body.namsanxuat;
      var giagoc = req.body.giagoc;
      var fileName = hash + req.file.originalname;
      var sv = new STUDENT({
        maoto: maoto,
        nhanhieu: nhanhieu,
        namsanxuat: namsanxuat,
        giagoc: giagoc,
        fileName: fileName
      })

      await sv.save();

      res.redirect('/')
    }
  })
})

router.post('/searchName', function (req, res){
    var search = req.body.search;

})

module.exports = router;
