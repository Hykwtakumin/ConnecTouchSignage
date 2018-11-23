import axios from "axios";
import * as moment from "moment";
import {Links} from "./links"

const pollingLinks = async () => {
    const request = await axios.get("192.168.0.200/links?limit=1000", {});
    if (request.status == 200) {
        try {
            const resJson = await request.data as Array<Links>;
            console.dir(resJson);
        } catch (error) {

        }
    }

};


window.onload = async () => {
    setInterval(() => {
        pollingLinks();
    }, 1000);
};