// ==UserScript==
// @name         3icecream - only MDX:U songs
// @namespace    https://vyhd.dev
// @version      1.0.3
// @description  Removes songs from 3icecream's tier lists that are unavailable on MDX:U (A20 PLUS, white) cabs.
// @license      CC0-1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @author       vyhd@vyhd.dev
// @match        https://3icecream.com/difficulty_list/*
// @grant        none
// @downloadURL  https://gist.githubusercontent.com/vyhd/4fcf641bf91eed55d5bcd9d758cd453f/raw
// @updateURL    https://gist.githubusercontent.com/vyhd/4fcf641bf91eed55d5bcd9d758cd453f/raw
// ==/UserScript==

// borrow their jQuery so we don't need to pull in another - 1.11.1 as of this writing
let $ = window.jQuery;

const LOCKED_CHART_TYPES = new Set([
    100, // Challenge charts only in nonstop
    190, // GRAND PRIX charts only in A3
]);

const CSP_AND_CDP = [4,8]; // many songs have A3 challenge charts we want to hide - see hideSong for more context

// quick-and-dirty hack for A3's challenge charts and friends: remove these IDs and difficulties too.
// (get a song's ID by name via: `ALL_SONG_DATA.filter(e => e.song_name === "foo").map(e => e.song_id)`
const MANUAL_REVOCATION_LIST = [
    // GOLDEN LEAGUE A3 Challenge charts
    {song_id: "l61ldlPo1DQ081860O86D0Qo0qdOd0qP", difficulties: CSP_AND_CDP }, // Ace out
    {song_id: "6d8DiDl0i1oldbbo0o60PQ0q96d608Dq", difficulties: CSP_AND_CDP }, // ALPACORE
    {song_id: "9DoD10OPQ999IlP0doo69olbOQ680q09", difficulties: CSP_AND_CDP }, // Avenger
    {song_id: "1qPIiqqQo0P9dD90I11q90b0ooIidbPO", difficulties: CSP_AND_CDP }, // CyberConnect
    {song_id: "dqQbQ9oPlIi6bDdi18d9qPlDb0PiDddi", difficulties: CSP_AND_CDP }, // DIGITALIZER
    {song_id: "d9llb88lDI1q0QI10P01lqIqlI6QO0Dl", difficulties: CSP_AND_CDP }, // Give Me
    {song_id: "9IdoP1ld9098PI90QQ6bP0Idl1ibo80D", difficulties: CSP_AND_CDP }, // Glitch Angel
    {song_id: "dIdDQD1Q8oPQ90Q1DPbiQI661qD9oi6I", difficulties: CSP_AND_CDP }, // Golden Arrow
    {song_id: "DdIo9DQ0ddDld99DQdiiqbPP06OI91I0", difficulties: CSP_AND_CDP }, // New Era
    {song_id: "Ol8PPooqO8iOqQ6900o0q0QI9dPo0O0b", difficulties: CSP_AND_CDP }, // Rampage Hero
    {song_id: "bbiPqbo0lQq9P19i06q690blI91dbbq6", difficulties: CSP_AND_CDP }, // Starlight in the Snow
    {song_id: "b80qOO6l8060990qQPod1bOd8Q9d69qo", difficulties: CSP_AND_CDP }, // The World Ends Now


    // other A3 Challenge charts
    {song_id: "o9P816l0QQ1b9l1l6i1o6OD9bl9dP00l", difficulties: CSP_AND_CDP }, // BITTER CHOCOLATE STRIKER
    {song_id: "o1d0DDobPPPlq0l8Qli1d6ODI8ldo1qb", difficulties: CSP_AND_CDP }, // シル・ヴ・プレジデント
    {song_id: "6dO6i9qq601D8ild9QIlbO8bodbiQ1Pl", difficulties: CSP_AND_CDP }, // 灼熱Beach Side Bunny
    {song_id: "PIP1OIoObQ11Q0Po6idiloqOl9OQqqdd", difficulties: CSP_AND_CDP }, // なだめスかし Negotiation

    // A20 gold cab exclusive songs
    {song_id: "6dQQd1d1OQlqQdQ98i01DQ1i9P6QDQdQ"}, // BUTTERFLY (20th Anniversary Mix)
    {song_id: "8Io6oi89Q8DblI8IPdPPI0q98Ql9o98Q"}, // CARTOON HEROES (20th Anniversary Mix)
    {song_id: "lIlQ8DbPP6Iil1DOlQ6d8IPQblDQ8IiI"}, // HAVE YOU NEVER BEEN MELLOW (20th Anniversary Mix)
    {song_id: "D9IO16idQq6iiI88loI1i986lIID0O9O"}, // LONG TRAIN RUNNIN' (20th Anniversary Mix)
    {song_id: "IbI90PiioDlqPP19D1odPPbP1PP0009O"}, // SKY HIGH (20th Anniversary Mix)

    // GOLDEN LEAGUE PLUS songs that didn't unlock
    {song_id: "i6P0dI11PdoIIQ19D6PQPidqd0bI6lqi"}, // actualization of self (weaponized)
    {song_id: "8dqQDblP6dPI10qq10qiPbqi1llQ06iP"}, // Better Than Me
    {song_id: "O8oPP6D8OQq1Q6Q860dqlOi6609bO1lD"}, // Come Back To Me
    {song_id: "dQODIo01o98oPll086Qdol8bq9QP8d61"}, // DDR TAGMIX -LAST DanceR-
    {song_id: "i9PQoDbQI0qqd6I00d19bQo6q9PoOIbO"}, // Good Looking
    {song_id: "bqi9QiQ0lbi8id6lOi88iIi9lo6Pdd90"}, // Lightspeed
    {song_id: "I189iqQI6iPDdIDbo81b1iD6lIQiI0Po"}, // Run The Show
    {song_id: "8iiqQ9o1P089901DPIq8PDPOl6oDOl1P"}, // Step This Way
    {song_id: "Q88dlIQDd9lbiiiio0dddO6QP6O091lI"}, // THIS IS MY LAST RESORT
    {song_id: "OIOdod8llPlO0lOlb6P8iIQ90qQqoDiP"}, // Yuni's Nocturnal Days

    // returning licenses
    {song_id: "q6661PIbbb1O80OQQ11iD6bP1l6bio0Q"}, // The Light
    {song_id: "i0P1O6lbP1oDd6q6b08iPPoq6iPdI818"}, // 最終鬼畜妹フランドール・Ｓ
    {song_id: "IlbI1QQOPI0o0IdoPI6QPldqQob16DOq"}, // ナイト・オブ・ナイツ (Ryu☆Remix)
    {song_id: "illQ66d0QlbDl18OOb8P0ODD0oDP19PQ"}, // 令和

    // new restricted licenses
    {song_id: "dq6b0b6OD9DbDPQOO608oDo8Q80ODIqO"}, // Crazy Hot
    {song_id: "DDPPI6IIi0i9looibDbiODoOPOl6ID8i"}, // Feidie
    {song_id: "QbdQold98oq9lODoIloIbPiIqld6i0Qb"}, // GUILTY DIAMONDS
    {song_id: "oI0P1oq89blIobOd0QqilPqd9Didd0OD"}, // I believe what you said
    {song_id: "I9P1dbOqD1qIP8bd9O80Ooo869bldobD"}, // No Life Queen [DJ Command Remix]
    {song_id: "00ibl6biOOOdDd96OP0P0i8iObo8i09d"}, // Realize
    {song_id: "id099qDODdQ9Ooi9dq1I981Diq101QDO"}, // Seize The Day
    {song_id: "QIDqidPlPQll9q6Il0dblIo609lii1di"}, // SHINY DAYS
    {song_id: "POdll6oPi1dd68q19q8ID6iQ6d08bl99"}, // Together Going My Way
    {song_id: "IObPQb9QlP0iIiboObPoPqIqDo0O11Qi"}, // 春を告げる
    {song_id: "6lb86I9Q18Di6do1lDdod8b1Po688019"}, // 恋
    {song_id: "PIP1OIoObQ11Q0Po6idiloqOl9OQqqdd"}, // なだめスかし Negotiation
    {song_id: "1qPbqd11l6b8ibq1ODQ6di90PIo0D618"}, // ロキ(w/緒方恵美)
    {song_id: "o1d0DDobPPPlq0l8Qli1d6ODI8ldo1qb"}, // シル・ヴ・プレジデント
    {song_id: "o8IDq8P8lP9o8IIO6lPPqqQP91bo0ddl"}, // サイカ
    {song_id: "oIid19qq6dQ00O16IDiQ991D9OqdQil0"}, // 思想犯
    {song_id: "QiOl969Iq1Pl6o60QOQ9PooDbbiOPioo"}, // スカイクラッドの観測者
    {song_id: "dbod1o098DoibO0PoiPIiQ11Pdlqdoo9"}, // テレキャスタービーボーイ
    {song_id: "D6b8boIiOqQOq1QP9D1qd08I6Q0IIqq9"}, // 雑草魂なめんなよ！
]

function debug(logLine) {
//    console.debug(logLine);
}

/**
 * Builds a jQuery selector to find this song's jacket(s), then hides all matches.
 * `difficulty_id`, is optional and goes from 0-8: 0-4 are bSP thru CSP, 5-8 are BDP thru CSP.
 */
function hideSong(song_id, difficulty_id) {
    debug(`Removing ${window.ALL_SONG_DATA.find(e => e.song_id === song_id).song_name}, difficulty ${difficulty_id}`);

    let selector = (difficulty_id)
        ? `#div-jacket-${song_id}-${difficulty_id}` // exact match a chart by ID
        : `div[id^=div-jacket-${song_id}]`; // prefix match all charts

    $(selector).hide();
}

(function() {
    'use strict';

    /*
     * ALL_SONG_DATA contains an array of song data structured like {song_id, song_name, version_num}, etc:
     * pick out all the song IDs that map to DDR A3 (version_num === 19) and remove their icons from the page.
     */
    let songsToRemove = window.ALL_SONG_DATA.filter(e => e.version_num == 19);
    songsToRemove.forEach(e => hideSong(e.song_id));

    /*
     * Now, take one more pass through to remove charts that are locked (or missing) in A20 PLUS.
     * (Not sure what the `lock_types` means here, but we can guess what values should be filtered.)
     */
    let songsToCheck = window.ALL_SONG_DATA.filter(e => e.version_num <= 18 && Object.hasOwn(e, 'lock_types'));
    songsToCheck.forEach(e => {
        e.lock_types.forEach((lock_value, difficulty_id) => {
            if (LOCKED_CHART_TYPES.has(lock_value)) {
                hideSong(e.song_id, difficulty_id);
            }
        });
    });

    /*
     * Finally, apply the revocation list.
     */
    MANUAL_REVOCATION_LIST.forEach(e => {
        if (e.difficulties) {
            e.difficulties.forEach(difficulty_id => hideSong(e.song_id, difficulty_id));
        } else {
            hideSong(e.song_id);
        }
    });

    // always hide the 'Insufficient Data' row for cleanliness - iirc A20 PLUS songs are all ranked
    $("#no-rating-row").hide();
})();
