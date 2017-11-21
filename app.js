/**
*
*
* ConnecTouch Browser JS
*
* 処理のフロー
*
* iframeでページを切り替える仕様
*
* 1. ポーリングでlinksからサイネージIDを引き、最新を取得する
* 2. その最新にはSuicaIDが付いているので、それを取得
* 3. linksからそのSuicaIDを引く
* 4. そのリストから、重複を消し、リーダーIDをリストで持つ
* 5. その取得個数によって、クリックでページを切り替える
* 7. 何も紐づいていないSuicaをタッチした場合、ポスターにタッチするように促すページを表示する
* 8. ページリストはAPIから取得する
*
*/

/**
 *
 * 依存モジュール
 *
 */
const $ = require('jquery');
const request = require('superagent');

// 011401147f10c10a <- テスト用カードID
// 010101123d0c1c11 <- テスト用カードID2
/**
 *
 * 設定定数
 *
 */
const API_END_POINT = 'http://connectouch.org';
const SIGNAGE_ID = 'satakepi';
const POSTER_IDS = [
    { id: 'hikarupi1', contentURL: './Pages/a1.html' },
    { id: 'hikarupi2', contentURL: './Pages/a2.html' },
    { id: 'hikarupi3', contentURL: './Pages/a3.html' }
]


const lastFetchCardData = {
    card_id : null,
    timestamp : null // ここは、タッチした時間
};
var used = false;


/**
 *
 * ページリフレッシュ
 * - データを取得し、ページを描画する
 * - この関数をポーリングする
 *
 */
const touchRefresh = async () => {

    /**
     *
     * サイネージに紐づくカードIDを取得する
     * - APIはtimestampでソートされているので、先頭の1つを取得する
     * - 前回と同じであれば、なにもせず終了する
     * - 最新のタッチを記録する
     *
     */
    let links_data = await getLinkByID(SIGNAGE_ID);
    if(links_data.length == 0) {
        console.log('[ERROR] サイネージに紐づいたLINKがありません');
        return false;
    }
    let card_id = links_data[0]['link'][1];
    let last_time = links_data[0]['time'];
    if(lastFetchCardData.card_id = card_id && lastFetchCardData.timestamp == last_time) {
        console.log('ポーリング中...');
        used = true;
        return false;
    }
    lastFetchCardData.card_id = card_id;
    lastFetchCardData.timestamp = last_time;

    if(!used) return false;


    /**
     *
     * カードIDに紐づくポスターIDのリストを取得する
     * - これは複数取得できる
     * - サイネージIDと同値のものは除外する
     * - 重複を削除する
     * - ポスターの個数分削る
     *
     */
    let node_ids = await getLinkByID(card_id);
    let poster_ids = node_ids.map((x) => {
        return x.link[0]
    }).filter((x, i, self) => {
        return x != SIGNAGE_ID && self.indexOf(x) === i;
    }).slice(0, POSTER_IDS.length);


    /**
     *
     * ページに反映させる
     * - 一度もポスターにタッチしていない人には、warningを出す
     *
     */
    let parent_poster_ids = POSTER_IDS.map((e) => e.id);
    var lastTouchIdPosition = -1;
    for(let pid of poster_ids) {
        let i = parent_poster_ids.indexOf(pid);
        if(i == -1) continue;
        $('#number_box .box').eq(i).addClass('enable');
        lastTouchIdPosition = i;
    }
    if(lastTouchIdPosition == -1) {
        displayWarning();
        return false;
    }
    displayAnswer(lastTouchIdPosition+1);


    console.log(poster_ids);
};

/**
 *
 * LinksAPIから、IDを元にリンクを引き出す
 */
const getLinkByID = async (id) => {
    const res = await request.get(`${API_END_POINT}/links?id=${id}&limit=100`);
    return JSON.parse(res.text);
};

/**
 *
 * アンサーのコンテンツをポジション指定して表示する
 */
const displayAnswer = (position) => {
    $('.content_frame').addClass('disnon');
    $(`#iframe_answer_${position}`).removeClass('disnon');
    $('#number_box').removeClass('disnon');
};

const displayTopPage = () => {
    $('.content_frame').addClass('disnon');
    $('#number_box').addClass('disnon');
    $(`#iframe_top_page`).removeClass('disnon');
    $('#number_box .box').removeClass('enable');
};

const displayWarning = () => {
    $('.content_frame').addClass('disnon');
    $('#iframe_warning_page').removeClass('disnon');
    $('#number_box .box').removeClass('enable');
};

/**
 *
 * ナビゲーションのイベントハンドラ
 */
$('body').on('click', '#number_box .box.enable', function(){
    var number =  $(this).attr('data-num');
    displayAnswer(number);
});

/**
 *
 * メニューボタンのイベントハンドラ
 *
 */
$('#menu_box .box').on('click', function () {
    displayTopPage();
});


/**
 *
 * メイン実行関数
 *
 */
const mainFunc = async () => {

    /**
     *
     * 回答のページURLをiframeに反映させる
     *
     */
    $('#iframe_answer_1').attr('src', POSTER_IDS[0]['contentURL']);
    $('#iframe_answer_2').attr('src', POSTER_IDS[1]['contentURL']);
    $('#iframe_answer_3').attr('src', POSTER_IDS[2]['contentURL']);


    // ポーリングする
    await touchRefresh();

    // 最初のリロード時は、強制的にトップに戻す
    displayTopPage();

    setInterval(() => {
        touchRefresh();
    }, 1000);
};

mainFunc();

