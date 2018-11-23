import "moment/locale/ja";
import * as moment from "moment";
import {Links} from "./links"

/*取得したlinksをローカルの配列として保持する*/
let storedLinks = [] as Array<Links>;

/*ローカルのlinksと毎秒取得する新鮮なlinksとの差分をとる関数*/
const getDiff = (oldLinks: Array<Links>, newLinks: Array<Links>) => {
    /*newLinksにあってoldLinksに無いものは新しいものとする*/
    /*あるかないかの確認はmongoDBのレコードIdを元に行う*/
    const oldIdArray = oldLinks.map(link => link._id.$oid);

    /*レコードIdを元に存在しているかを真偽値で返す関数*/
    const isContained = (link) => {
        return oldIdArray.includes(link._id.$oid);
    };

    /*newLinksにあってoldLinksに無いものだけを集めた配列を作る*/
    const diffLinks = newLinks.reduce((prev, curr) => {
        if (!isContained(curr)) {
            prev.push(curr)
        }
        return prev
    }, []);

    if (diffLinks.length != 0) {
        console.log(`新しいタッチイベントが${diffLinks.length}件発生しました!`);
        diffLinks.forEach(link => {
            const readerId = link.link[0];
            const cardId = link.link[1];
            const time = moment.unix(parseInt(link.time)).format("YYYY-MM-DD HH:mm");
            console.log(`${time}に${cardId}が${readerId}がタッチしました! ${link.time}`)
        });
    }
};

const pollingLinks = async () => {
    const endPointUrl = `http://192.168.0.200/links?limit=100`;
    const request = await fetch(endPointUrl);
    if (request.status == 200) {
        try {
            const loadedList = await request.json() as Array<Links>;
            getDiff(storedLinks, loadedList);
            storedLinks = loadedList;
        } catch (error) {
            console.error(error);
        }
    }

};


window.onload = async () => {
    setInterval(() => {
        pollingLinks();
    }, 1000);
};