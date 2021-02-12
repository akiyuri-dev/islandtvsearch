'use strict';
const http = require('http');
var fs = require('fs');
var pg = require('pg');
var urlParser = require('url');
//const express = require('express') ;
//const app = express();
//var path = require('path');

var groups = [
    {
        name: "SixTONES",
        member: ["ジェシー", "京本大我", "髙地優吾", "田中樹", "松村北斗", "森本慎太郎"]
    },{
        name: "Snow Man",
        member: ["岩本照", "深澤辰哉", "宮舘涼太", "渡辺翔太", "佐久間大介", "阿部亮平", "向井康二", "目黒蓮", "ラウール"]
    },{
        name: "Travis Japan",
        member: ["川島如恵留", "宮近海斗", "中村海人", "七五三掛龍也", "吉澤閑也", "松田元太", "松倉海斗"]
    },{
        name: "HiHi Jets",
        member: ["髙橋優斗", "井上瑞稀", "橋本涼", "猪狩蒼弥", "作間龍斗"]
    },{
        name: "美 少年",
        member: ["那須雄登", "佐藤龍我", "金指一世", "藤井直樹", "浮所飛貴", "岩﨑大昇"]
    },{
        name: "7 MEN 侍",
        member: ["菅田琳寧", "中村嶺亜", "本髙克樹", "佐々木大光", "今野大輝", "矢花黎"]
    },{
        name: "宇宙Six",
        member: ["山本亮太", "江田剛", "松本幸大", "原嘉孝"]
    },{
        name: "MADE",
        member: ["稲葉光", "福士申樹", "秋山大河", "冨岡健翔"]
    },{
        name: "なにわ男子",
        member: ["西畑大吾", "大西流星", "長尾謙杜", "大橋和也", "藤原丈一郎", "高橋恭平", "道枝駿佑"]
    },{
        name: "Lil かんさい",
        member: ["嶋﨑斗亜", "西村拓哉", "大西風雅", "岡﨑彪太郎", "當間琉巧"]
    },{
        name: "Aぇ! group",
        member: ["正門良規", "末澤誠也", "草間リチャード敬太", "小島健", "福本大晴", "佐野晶哉"]
    },{
        name: "Jr.SP",
        member: ["松尾龍", "林蓮音", "中村浩大", "和田優希"]
    },{
        name: "少年忍者",
        member: ["青木滉平", "安嶋秀生", "稲葉通陽", "ヴァサイェガ渉", "内村颯太", "小田将聖", "織山尚大",
            "川﨑皇輝", "川﨑星輝", "北川拓実", "久保廉", "黒田光輝", "鈴木悠仁", "瀧陽次朗", "田村海琉",
            "豊田陸人", "長瀬結星", "檜山光成", "平塚翔馬", "深田竜生", "ブランデン", "元木湧", "山井飛翔"]
    },{
        name: "関西ジャニーズJr.",
        member: ["浅倉吏玖", "井田竜聖", "伊藤篤志", "伊藤翔真", "今江大地", "浦陸斗", "大内リオン", "岡佑吏", 
            "奥村颯太", "河下楽", "小久保澪", "小柴陸", "古謝那伊留", "佐田一眞", "澤田雅也", "角紳太郎", "竹村翔",
            "福井宏志朗", "藤森凌駕", "真弓孟之", "丸岡晃聖", "守屋周斗", "山口凛", "山中一輝", "吉川太郎"]
    }
];

var resArray = [];
var result = "";

function makeHTML(data) {
    var htmlDescriptionArray = data.moviedescription.split('出演');
    var htmlDescription = "";
    for (let i = 0; i < (htmlDescriptionArray.length - 1); i++) {
        if (i < (htmlDescriptionArray.length - 2)) {
            htmlDescription += htmlDescriptionArray[i] + "出演";
        } else {
            htmlDescription += htmlDescriptionArray[i];
        }
    }

    var htmlData = "<li class='d-flex justify-content-between align-items-center'>"
        + "<div class='card mb-3'><div class='card-header'>" + data.moviedate + "</div>"
        + "<div class='card-body'><p class='card-title'><a href='" + data.movieurl + "' target='_brank'>"
        + data.movietitle + "</a></p>"
        + "<p class='card-text'>" + htmlDescription
        + "<br>出演: " + data.moviedescription.split('出演').pop() + "</p></div></div></li>";
    //console.log("replace: " + data[i].movieDescription.replace(/'出演'/g, '<br>'));

    return htmlData;
}

function dbconnect(params, groupFlg) {
    return new Promise(function(resolve, reject){
        const pool = pg.Pool(
            {
                connectionString: "postgres://wwkczrrckgpunz:6ffe4217ab6991d7900e03c95c84cc291678cb561e64f5c02bbcedc53320a1e0@ec2-174-129-231-116.compute-1.amazonaws.com:5432/dfashk4v3o0j08",//process.env.DATABASE_URL,
                ssl: true,
            }
        );
        params = params.split(/\s/);
        var queryText = 'SELECT * FROM movies WHERE ';
        var queryPerson = 'movieperson LIKE ';
        var queryTitle = 'OR movietitle LIKE ';

        for (let i = 0; i < params.length; i++) {
            var name = "'%" + params[i] + "%'";
            if (i !== 0 && groupFlg == 0 && params[0] != "or") {
                queryText += ' AND (' + queryPerson + name + ' ' + queryTitle + name + ')';
            } else if (i !== 0 && groupFlg == 1) {
                if (params.length < 3) {
                    queryText += ' OR (' + queryPerson + "'" + params[i] + "')";
                    break;
                } else if (params.length < 4) {
                    var groupName = params[i] + " " + params[i + 1];
                    queryText += ' OR (' + queryPerson + "'" + groupName + "')";
                    break;
                } else {
                    var groupName = params[i] + " " + params[i + 1] + " " + params[i + 2];
                    queryText += ' OR (' + queryPerson + "'" + groupName + "')";
                    break;
                }
            } else if (i !== 0 && groupFlg == 0 && params[0] == "or") {
                queryText += ' OR (' + queryPerson + name + ' ' + queryTitle + name + ")";
                //+ name + " AND movieperson NOT LIKE '("  + params[i] + ")' )";
            } else {
                queryText += '(' + queryPerson + name + ' ' + queryTitle + name + ')';
            }
        }
        queryText += " ORDER BY movieid DESC;";
        var query = {
            text: queryText
            //values: ['"%' + params[0] + '%"', '"%' + params[1] + '%"']
        };
        console.log("query: " + query.text);
        pool.connect(function (err, client, done) {
            console.log("connect 129")
            if (err) {
                console.error(err.stack)
                console.log(err);
            } else {
                console.log("else 132");
                client.query(query.text)
                    .then(res => {
                        done();
                        console.log("res.rows.length" + res.rows.length);
                        var resultHTML = "";
                        for (let i = 0; i < res.rows.length; i++) {
                            //console.log("db search: " + res.rows[i].movieid);
                            resultHTML += makeHTML(res.rows[i]);
                        }
                        resArray = res.rows;
                        client.end();
                        if (resultHTML == "") {
                            resultHTML = "検索結果は0件です";
                        }
                        resolve(resultHTML);
                    })
                    .catch(e => console.error(e.stack));
            }
        });
        pool.end();
    });
    
}

function getType(_url) {
    var types = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".png": "image/png",
        ".gif": "image/gif",
        ".svg": "svg+xml",
        ".json": "application/json"
    }
    for (var key in types) {
        if (_url.endsWith(key)) {
            return types[key];
        }
    }
    return "text/plain";
}

function renderFiles(req, res, dbResult) {
        var url = "public" + (req.url.endsWith("/") ? req.url + "index.html" : req.url);
        if (req.url.indexOf("budle") > -1) {
            url = req.url;
        }
        if (fs.existsSync(url)) {
            fs.readFile(url, "utf-8", (err, data) => {
                if (!err) {
                    res.writeHead(200, {
                        'Content-Type': getType(url)
                    });
                    if (getType(url) === "text/html") {
                        //console.log(dbResult);
                        data = data.replace('<=ここに検索結果が表示されます=>', dbResult);
                    }
                    res.end(data);
                }
            });
        }
}

var url_parse = "";
const server = http.createServer((req, res) => {
    var dbResult = "";
    if (req.url.indexOf("?") > -1) {
        url_parse = urlParser.parse(req.url, true);
        var params = url_parse.query.name;

        console.log("requrl: " + params);

        req.url = "/";


        dbconnect(params, url_parse.query.groupFlg).then(function (value) {
            //console.log(value[0].movietitle);
            dbResult = value;

            renderFiles(req, res, dbResult);

        }).catch(function (error) {
            console.log(error);
        });
    }else {

        var url = "public" + (req.url.endsWith("/") ? req.url + "index.html" : req.url);
        //console.log("url: " + url);
        if (fs.existsSync(url)) {
            fs.readFile(url, (err, data) => {
                if (!err) {
                    //console.log("getType: " + getType(url));
                    res.writeHead(200, {
                        'Content-Type': getType(url)
                    });
                    res.end(data);
                }
            });
        }
        
    }
});

const PORT = process.env.PORT || 8000;
//app.get('/',  (req, res)  => res.send('Hello World'));
//静的ファイルを読み込むためにexpress.staticを使う
//express.staticミドルウェア関数
//publicフォルダに入ってるindex.htmlを参照しにいっている
//path.join(__dirname,'public')で絶対パスに変更している
//path.joinは文字列を結合して、ディレクトリごとに区切っていく
//__dirnameは常に現在のファイルのディレクトリを示す
//app.use(express.static(path.join(__dirname,'public/')));
//app.listen(PORT);
server.listen(PORT, () => {
    console.log(`listening on *: ${PORT}`);
});
//dbconnect();
