(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
'use strict';
//var pg = require('pg');

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
//パラメータを設定したURLを返す
function setParameter(paramsArray) {
    var resurl = location.href.replace(/\?.*$/,"");
    for (let key in paramsArray ) {
        resurl += (resurl.indexOf('?') == -1) ? '?':'&';
        resurl += key + '=' + paramsArray[key];
    }
    
    return resurl;
}

//パラメータを取得する
function getParameter() {
    var paramsArray = [];
    var url = location.href;
    parameters = url.split("#");
    if (parameters.length > 1) {
        url = parameters[0];
    }
    parameters = url.split("?");
    if (parameters.length > 1) {
        var params = parameters[1].split("&");
        for (i = 0; i < params.length; i++) {
            var paramItem = params[i].split("=");
            paramsArray[paramItem[0]] = paramItem[1];
        }
    }
    return paramsArray;
}

function searchButtonPush() {
    var texts = document.getElementById("name").value;
    if (!texts) {
        return;
    }else{
        document.getElementById("result").innerHTML = "";
        document.getElementById("loading").style.visibility = "visible";
        document.getElementById("tweet").style.visibility = "hidden";
        $("#search").addClass("disabled");
        document.getElementById("result-text").style.display = "none";
    }
    var groupFlg = 0;
    var groupRadios = document.getElementsByName("group");
    if (groupRadios[0].checked) {
        groupFlg = 1
    }
    var params = {};
    params["name"] = texts;
    params["groupFlg"] = groupFlg;
    //console.log("params：" + setParameter(params));
    window.location.href = setParameter(params);
}

function dbconnect() {
    const pool = new pg.Pool(
        {
            host: process.env.ENV_HOST,
            databese: process.env.ENV_DB,
            user: process.env.ENV_USER,
            port: 5432,
            password: process.env.ENV_PASSWORD
          }
    );
    var query = {
        text: 'SELECT movietitle FROM movies WHERE movieperson=$1',
        values: ["SixTONES"]
    };
    pool.connect(function(err, client, done){
        if (err) {
            console.error(err.stack)
        } else {
            client.query(query)
            .then(res => {
                done();
                for (let i = 0; i < res.rows.length; i++) {
                    console.log("db search: " + res.rows[i]);
                }
                client.end();
            })
            .catch(e => console.error(e.stack));
        }
    });
    pool.end();
}

function search() {

    //検索窓に入力された文字列＝パラメータ化されている文字列
    var texts = document.getElementById("name").value;

    if (!texts) {
        //空白の場合：処理を停止
        return;
    }else{
        //何かしら入力されている場合：ローディング出し、ツイートボタン消し、結果表示ボックス消し
        document.getElementById("loading").style.visibility = "visible";
        document.getElementById("tweet").style.visibility = "hidden";
        $("#search").addClass("disabled");
    }

    //デフォルトではグループの動画を含めない
    var groupFlg = 0;

    //ラジオボタンの選択状況からグループの動画を含めるときはフラグを1にする
    var groupRadios = document.getElementsByName("group");

    var groupName = "";
    if (groupRadios[0].checked) {
        groupFlg = 1
    }
   
    if (groupFlg === 1) { //グループ名含める
        //groupsのリスト[dict]からmemberにtextsに氏名が含まれるグループ名を取得
        for (let i = 0; i < groups.length; i++) {
            var member = groups[i].member;
            if (member.indexOf(texts) > -1) {
                //texts += " " + groups[i].name;
                groupName = groups[i].name;
                //console.log("name:" + texts + ". group: " + groups[i].name);
            }
            
        }
    }

    //固定バーの表示作成
    document.getElementById("result-text").innerHTML = "「" + texts + "」の検索結果";
    document.getElementById("result-text").style.display = "inline";

    console.info("url:" + window.location.href);
    //ツイート用URL作成
    var tweetUrl = "https://twitter.com/intent/tweet?text=" + 
    encodeURIComponent(texts + "の検索結果 - ISLAND TV SUPER SEARCH") + 
    "&url=" + encodeURIComponent(window.location.href);
    //ツイートボタン作成
    document.getElementById("tweet").innerHTML = '<a href="' + tweetUrl + 
    '" class="twitter-share-button data-lang="ja" data-show-count="false" target="_brank">' + 
    '<button type="button" class="btn btn-info">結果をツイート</button></a>' +
    '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
    
    //ツイートボタン表示
    document.getElementById('tweet').style.visibility = "visible";

    //検索結果が0の時フラグ
    var noResultFlg = 0;

    //dbconnect();

    $.getJSON("./JSON/mvlist.json", function (data) {
        //console.log('check json');
    }).done(function (data) {
        var resultTexts = [];
        var lastResult = [];
        var tempTexts = [];
        var textList = texts.split(/\s/);
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < textList.length; j++) {
                if (data[i].moviePerson.indexOf(textList[j]) > -1 || data[i].movieTitle.indexOf(textList[j]) > -1 || (data[i].moviePerson.split("、").indexOf(groupName) > -1 && groupName != "")) {
                    var htmlDescriptionArray = data[i].movieDescription.split('出演');
                    var htmlDescription = "";
                    for (let i = 0; i < (htmlDescriptionArray.length - 1); i++) {
                        if (i < (htmlDescriptionArray.length - 2)) {
                            htmlDescription +=  htmlDescriptionArray[i] + "出演";
                        }else{
                            htmlDescription += htmlDescriptionArray[i];
                        }
                    }
                    
                    var htmlData = "<li class='d-flex justify-content-between align-items-center'>" 
                        + "<div class='card mb-3'><div class='card-header'>" + data[i].movieDate + "</div>"
                        + "<div class='card-body'><p class='card-title'><a href='" + data[i].movieURL + "' target='_brank'>" 
                        + data[i].movieTitle + "</a></p>" 
                        + "<p class='card-text'>" + htmlDescription
                        + "<br>出演: " + data[i].movieDescription.split('出演').pop() +"</p></div></div></li>";
                    //console.log("replace: " + data[i].movieDescription.replace(/'出演'/g, '<br>'));
                    if (j == 0) {
                        tempTexts.push(data[i].movieURL); 
                        if (textList.length == 1) {
                            resultTexts.push(htmlData);
                        }       
                    }else{
                        for (let t = 0; t < tempTexts.length; t++) {
                            if (tempTexts[t] == data[i].movieURL) {
                                if (resultTexts.indexOf(htmlData) < 0) {
                                    resultTexts.push(htmlData);
                                    lastResult.push(htmlData);
                                }else{
                                    lastResult.push(htmlData);
                                }
                            }else if(resultTexts.indexOf(htmlData) > -1){
                                resultTexts.forEach((item, index) => {
                                    if (item === htmlData) {
                                        resultTexts.splice(index, 1);
                                    }
                                });
                            }
                        }
                    }
                    noResultFlg = 1;
                    //console.log("i: " + i + ". j: " + j);
                }
                if (j == (textList.length - 1)) {
                    //console.info("resultTxt length is " + resultTexts.length + ". lastResult length is " + lastResult.length);
                }
                //console.info(i + data[i].movieTitle);
            }
        }
        document.getElementById("loading").style.visibility = "hidden";
        $("#search").removeClass("disabled");
        if (noResultFlg === 0) {
            alert("「" + texts + "」の検索結果は0件です");
            document.getElementById("result").innerHTML += "検索結果は0件です";
        } else {
            if (resultTexts.length != lastResult.length && lastResult.length != 0) {
                for (let index = 0; index < resultTexts.length; index++) {
                    lastResult.forEach((item, ind) => {
                        if (item === resultTexts[index]) {
                            lastResult.splice(ind, 1);
                        }
                    });
                }
                resultTexts = lastResult;
            }
            for (let i = 0; i <resultTexts.length; i++) {
                var order = resultTexts.length - 1 - i;
                document.getElementById("result").innerHTML += resultTexts[order];
            }
            //console.info("resultTexts: " + resultTexts + ". lastResults: " + lastResult + ". tempTexts:" + tempTexts + ". textList: " + textList);
        }
    });
}

}).call(this,require('_process'))
},{"_process":1}]},{},[2]);
