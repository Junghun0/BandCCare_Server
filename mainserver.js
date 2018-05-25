var express =  require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');
var FCM = require('fcm-push');
var app = express();

var server = require('http').createServer(app);
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

var port = process.env.PORT || 4000;

var conn2 = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'wjdgns@@23',
    database : 'band_cctv'
});

server.on('connection', function(socket) {
    console.log('클라이언트 정보 - ip : %s, port : %d', socket.remoteAddress, socket.remotePort);
});

server.on('request',function (req) {
    //console.log('클라이언트로부터 요청들어옴',req);
});

server.listen(port, function () {
    console.log('4000 포트 시작~');
});

// global.motor = null
// //@@모터제어1
// //var motor;
// app.post('/post',function (req,res) {
//    motor = req.body;
//    res.json(req.body);
//    console.log("receive motor1 data->",req.body);
// });
//
// app.get('/post',function (req,res) {
//    console.log("receive motor1 data->",motor);
//    res.json(motor);
// });
//
//
// global.motor2 = null;
// //@@모터제어2
// //var motor2;
// app.post('/post1',function (req,res) {
//    motor2 = req.body;
//    res.json(req.body);
//     console.log("receive motor2 data->",req.body);
// });
//
// app.get('/post1',function (req,res) {
//     console.log("receive motor2 data->",motor);
//     res.json(motor);
// });


// //@@알람
// global.alarm = null;
// //var alarm;
// app.post('/alarm',function (req,res) {
//     alarm = req.body;
//     res.json(req.body);
//     console.log("android receive alarm ->",req.body);
// });
//
// app.get('/alarm',function (req,res) {
//     console.log('pi alarm',alarm);
//     res.json(alarm);
//     alarm = {"alarm":"noalarm"};
// });

//
// global.detect = null;
// //var detect;
// app.post('/detect',function (req,res) {
//     detect = req.body;
//     res.json(detect);
//     console.log('움직임',req.body);
// });
//
// app.get('/detect',function (req,res) {
//    res.json(detect);
//    console.log(detect);
//
// });

//
// global.exit = null;
// //@@파이 프로세스 죽이기
// //var exit;
// app.post('/exit',function (req,res) {
//     exit = req.body;
//    res.json(req.body);
//    console.log("receive PI Kill data->",req.body);
// });
//
// app.get('/exit',function (req,res) {
//     console.log("send PI Kill data->",exit);
//     res.json(exit);
//     exit = {"exit":"noexit"};
// });

//var count=0;
//@@심박센서 안드에보내기
app.get('/getsensor', function (req,res) {
    var index = req.param("index");
    var sql = 'select sensor_data from heartsensor where id = ?' ;

    conn2.query(sql ,[index], function (err, rows) {
        //senddata = rows[0].sensor_data;
        if(err){
            throw err;
        }else {
            if(rows !=""){
                res.json(rows[0]);
                // console.log('심박데이터 index ->',index);
                // console.log('심박데이터 ->',rows[0]);
                //
                // console.log(JSON.stringify(rows));
                // var result = JSON.stringify(rows);
                // var obj = JSON.parse(result);
                // var obj2 = obj[0].sensor_data;
                // console.log(obj[0].sensor_data);
                //
                //
                //     if(obj2 > 150 || obj2 < 40){
                //         count++;
                //         console.log('count@@@',count);
                //         if(count == 5){
                //             callfcm();f
                //             count = 0;
                //         }
                // }

            }

        }

    })
});


//@@심박데이터 테이블 마지막 인덱스 뿌려주기
app.get('/getmaxindex',function (req,res) {
    var sql = 'select max(id) from heartsensor';
    conn2.query(sql,function (err, rows) {
       if(err){
           throw err;
       } else{
           res.json(rows[0]);
           console.log('심박데이터 테이블 index->',rows[0]);

       }
    })
});

//@@회원가입
app.post('/insert_app_member',function (req,res) {
   var id = req.body.AppUserInfo_id;
   var password = req.body.AppUserInfo_password;
   var phone = req.body.AppUserInfo_phone;
   var birthday = req.body.AppUserInfo_birthday;
   var camera = req.body.AppUserInfo_camera_id;
   var band = req.body.AppUserInfo_band_id;

    var sql = 'insert into appuserinfo_tb (AppUserInfo_id, AppUserInfo_password, AppUserInfo_phone, AppUserInfo_birthday, AppUserInfo_camera_id, AppUserInfo_band_id) values(?,?,?,?,?,?)';
    var query = conn2.query(sql,[id,password,phone,birthday,camera,band],function (err,result){
        if(err){
            throw err;
        }
    });
});

app.post('/insert_band_member',function (req,res) {
    var name = req.body.BandUserInfo_name;
    var sex = req.body.BandUserInfo_sex;
    var phone = req.body.BandUserInfo_phone;
    var birth = req.body.BandUserInfo_birth;
    var address = req.body.BandUserInfo_address;

    var sql = 'insert into banduserinfo_tb (BandUserInfo_name, BandUserInfo_sex, BandUserInfo_phone, BandUserInfo_birth, BandUserInfo_address) values (?,?,?,?,?)';
    var query = conn2.query(sql,[name,sex,phone,birth,address],function (err,result) {
        if(err){
            throw err;
        }
    })
});

//@@좌표값
app.post('/location_info',function (req,res) {
   var latitude = req.body.latitude;
   var longitude = req.body.longitude;

   var sql = 'insert into location_info (latitude, longitude) values(?,?)';
   var query = conn2.query(sql , [latitude,longitude],function (err, result) {
       if(err){
           throw err;
       }
   })
});

app.get('/location_info',function (req,res) {
   var sql = 'select * from location_info order by index_loc desc limit 1';
   var query = conn2.query(sql,function (err,result) {
      if(err){
          throw err;
      }else{
          console.log('좌표값 요청!');
          res.json(result);
      }
   });
});

global.count = 0;
global.count2 = 0;
global.dataarray = new Array(0,0);
global.state = 1;

app.get('/last_pulse',function (req,res) {
    console.log('last_pulse 요청 @@@@@@@@@@');
    var sql = 'select *from heartsensor order by id desc limit 1';
    var query = conn2.query(sql, function (err, result) {
       if(err){
           throw err;
       }else{
           res.json(result);
           console.log(JSON.stringify(result));
           var rows = JSON.stringify(result);
           var obj = JSON.parse(rows);
           var obj2 = obj[0].sensor_data;
           console.log(obj[0].sensor_data);

           var rows2 = JSON.stringify(result);
           var touch_obj = JSON.parse(rows2);
           var touch_obj2 = touch_obj[0].touch_data;
           console.log('touch data ->',touch_obj2);
       }

        dataarray[0] = dataarray[1];
        dataarray[1] = obj2;
        if(state === 1){
            console.log('state = 1');
            if(count >= 0){
                console.log('dataarray1',dataarray,'count1 ->',count);
                var first = dataarray[0];
                var second = dataarray[1];

                if( (first > 90 || first < 50) && (second >90 || second < 50) ){
                    count++;
                    console.log('dataarray2',dataarray,'count2 ->',count);
                }else if(first < 90 && first > 50 && second < 90 && second > 50){
                    count--;
                    if(count < 0){
                        count = 0;
                    }
                    console.log('dataarray3',dataarray,'count3 ->',count);
                }else{
                    console.log('else문!');
                }

                if(count === 3){
                    if(check ==='false'){
                        callfcm();
                    }
                    console.log('dataarray4',dataarray,'count4 ->',count);
                    count = -15;
                    state = 0;
                }

            }

        }
        else if(state === 0){
            count++;
            console.log('else if',count);
            if(count == 0){
                state = 1;
                count = 0;
            }
        }
        console.log('dataarray',dataarray);

        if(touch_obj2 == 0){
            count2++;
            if(count2 == 5){
                console.log('터치알람 count2 @@@ 2->',count2);
                callfcm2();
                count2 = 0;
            }
        }

    });
});




//@@로그인체크
app.post('/logincheck2',function (req,res) {
    var id = req.body.AppUserInfo_id;
    var password = req.body.AppUserInfo_password;
    console.log(id);
    console.log(password);
    conn2.query('select *from appuserinfo_tb where AppUserInfo_id=?',[id],function (err,results,fields) {
        if(err){
            res.send({
                "failed":"error ocurred"
            })
        }else {
            if (results.length > 0) {
                if (results[0].AppUserInfo_password == password) {
                    res.json({
                        "success": "success"
                    });
                    console.log("로그인 성공");
                }
                else {
                    res.json({
                        "success": "nomatch"
                    });
                    console.log("로그인 No match");
                }
            }

            else {
                res.json({
                    "success": "noexist"
                });
                console.log("로그인 No Exist");
            }
        }
    });
});

app.get('/getinfo',function (req,res) {
   var userid = req.param("id");
   conn2.query('select *from appuserinfo_tb where AppUserInfo_id =?',[userid],function (err,result) {
       if(err){
           throw err;
       }else{
           res.json(result);
       }
   })
});

app.get('/getbanduserinfo',function (req,res) {
   var index = req.param("index");
   conn2.query('select *from banduserinfo_tb where BandUserInfo_index = ?',[index],function (err,result) {
      if(err){
          throw err;
      } else{
          res.json(result);
      }
   });
});

app.get('/getuserindex',function (req,res) {
   var id = req.param("id");
   conn2.query('select AppUserInfo_index from appuserinfo_tb where AppUserInfo_id = ?',[id],function (err,result) {
       if(err){
           throw err;
       }else{
           res.json(result);
       }
   })
});


app.post('/fcmtoken',function (req,res) {
   var token = req.body.user_token;
   var userid = req.body.user_id;
    //insert into test_db1(token,userid) values('aswda11111sdd','adm') on duplicate key update token='aswda11111sdd',userid='adm';
   conn2.query('insert into appusertoken_tb (user_token , user_id) values (?,?) on duplicate key update user_token=?,user_id=?',[token,userid,token,userid],function (err,results) {
      if(err){
          throw err;
      }else{

      }
   });
   console.log('fcmtoken result ->',token,",",userid);
});

var obj2;
app.get('/gettoken',function (req,res) {
    var user_id = req.param("user_id");

    conn2.query('select user_token from appusertoken_tb where user_id =?',[user_id],function (err, result) {
        if(err){
            throw err;
        }else {
            res.json(result);

            var tk = JSON.stringify(result);
            var obj = JSON.parse(tk);
            obj2 = obj[0].user_token;
            console.log('token 값 @@@@@',obj2);
        }
    })
});


global.detect = null;
//var detect;
global.check = null;
app.post('/detect',function (req,res) {
    detect = req.body;
    console.log('움직임 ######',req.body);
    res.json(detect);

    console.log(detect);

    var detec = JSON.stringify(detect);

    var detec2 = JSON.parse(detec);
    check = detec2.detect;

    console.log('check@@@@@@@',check);


});

app.get('/detect',function (req,res) {
    res.json(detect);
    console.log(detect);
});

var FCM = require('fcm-push');

function callfcm() {
    console.log('비정상!');

    console.log('fcm안에서',obj2);
    /** Firebase(구글 개발자 사이트)에서 발급받은 서버키 */
// 가급적 이 값은 별도의 설정파일로 분리하는 것이 좋다.
    var serverKey = 'AAAAiwFFeMo:APA91bGoo2GrMG4djrgPFl5RR-gY33bsQ-Fl8Bbd1IhBGHVS-wM7-fn3Wskw6JKYd4h1rt1HvTyYFcbK9ZQki5IXa_durbIeaHxW-F6o5CGpk6eufRhdsf6DL_Kyh4Q5zjIlL6iXuNWY';

    /** 안드로이드 단말에서 추출한 token값 */
// 안드로이드 App이 적절한 구현절차를 통해서 생성해야 하는 값이다.
// 안드로이드 단말에서 Node server로 POST방식 전송 후,
// Node서버는 이 값을 DB에 보관하고 있으면 된다.
    var client_token = obj2;
    /** 발송할 Push 메시지 내용 */
    var push_data = {
        // 수신대상
        to: client_token,
        // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
        notification: {
            title: "BandCCTV",
            body: "심박수 이상 감지",
            sound: "default",
            click_action: "OPEN_ACTIVITY",
            icon: "fcm_push_icon"
        },
        // 메시지 중요도
        priority: "high",
        // App 패키지 이름
        restricted_package_name: "com.example.hansung.band_cctv",
        // App에게 전달할 데이터
        data: {
            "check":"heart",
            "detect":check
        }
    };

    /** 아래는 푸시메시지 발송절차 */
    var fcm = new FCM(serverKey);

    fcm.send(push_data, function (err, response) {
        if (err) {
            console.error('Push메시지1 발송에 실패했습니다.');
            console.error(err);
            return;
        }

        console.log('Push메시지가1 발송되었습니다.');
        console.log(response);
    });
}

function callfcm2() {

    var serverKey = 'AAAAiwFFeMo:APA91bGoo2GrMG4djrgPFl5RR-gY33bsQ-Fl8Bbd1IhBGHVS-wM7-fn3Wskw6JKYd4h1rt1HvTyYFcbK9ZQki5IXa_durbIeaHxW-F6o5CGpk6eufRhdsf6DL_Kyh4Q5zjIlL6iXuNWY';
    /** 안드로이드 단말에서 추출한 token값 */
// 안드로이드 App이 적절한 구현절차를 통해서 생성해야 하는 값이다.
// 안드로이드 단말에서 Node server로 POST방식 전송 후,
// Node서버는 이 값을 DB에 보관하고 있으면 된다.
    var client_token = obj2;
    /** 발송할 Push 메시지 내용 */
    var push_data = {
        // 수신대상
        to: client_token,
        // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
        notification: {
            title: "BandCCTV",
            body: "밴드 미착용 감지",
            sound: "default",
            click_action: "OPEN_ACTIVITY",
            icon: "fcm_push_icon"
        },
        // 메시지 중요도
        priority: "high",
        // App 패키지 이름
        restricted_package_name: "com.example.hansung.band_cctv",
        // App에게 전달할 데이터
        data: {
            "check": "notouch"
        }
    };

    /** 아래는 푸시메시지 발송절차 */
    var fcm = new FCM(serverKey);

    fcm.send(push_data, function (err, response) {
        if (err) {
            console.error('Push메시지2 발송에 실패했습니다.');
            console.error(err);
            return;
        }

        console.log('Push메시지가2 발송되었습니다.');
        console.log(response);
    });
}






