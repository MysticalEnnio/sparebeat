const cheerio = require("cheerio");
const inquirer = require("inquirer");
inquirer.registerPrompt("search-list", require("inquirer-search-list"));

function getCookie(cookieObj, name) {
    const value = `; ${cookieObj}`;
    const parts = value.split(`${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}

async function uploadScore() {
    console.log("Loading Songs...");
    let data = await fetch("https://sparebeat.com");
    let cookies = data.headers.get("set-cookie");
    let html = await data.text();
    const $ = cheerio.load(html);
    let songs = [];

    $("ul.music-list")
        .children()
        .each((i, el) => {
            if (i == 0) return;
            let onclick = $(el).attr("onclick");
            songs.push({
                songId: onclick.slice(
                    getPosition(onclick, "/", 2) + 1,
                    getPosition(onclick, "/", 3)
                ),
                songName: $(el).children().first().children().first().text(),
            });
        });
    let songIds = new Map(songs.map((obj) => [obj.songName, obj.songId]));
    let songNames = [];
    songs.map((e) => songNames.push(e.songName));
    let songId = songIds.get(
        (
            await inquirer.prompt([
                {
                    type: "search-list",
                    message: "Select Song",
                    name: "song",
                    choices: songNames,
                },
            ])
        ).song
    );

    let name = (
        await inquirer.prompt([
            {
                type: "input",
                message: "Choose a Name",
                name: "name",
            },
        ])
    ).name;

    let difficulty = (
        await inquirer.prompt([
            {
                type: "list",
                message: "Select a Difficulty",
                name: "difficulty",
                choices: ["easy", "normal", "hard"],
            },
        ])
    ).difficulty;

    let score = (
        await inquirer.prompt([
            {
                type: "number",
                message: "Enter a Score between 1 and 999999",
                name: "score",
                validate: (score) => {
                    if (score < 1) {
                        return "Enter a score bigger than 0";
                    } else if (score > 999999) {
                        return "Enter a score smaller than 1000000";
                    } else {
                        return true;
                    }
                },
            },
        ])
    ).difficulty;

    let rank = (
        await inquirer.prompt([
            {
                type: "list",
                message: "Choose a Rank",
                name: "rank",
                choices: [
                    "B",
                    "B+",
                    new inquirer.Separator(),
                    "A",
                    "AA",
                    "AAA",
                    new inquirer.Separator(),
                    "S",
                    "SS",
                    "SSS",
                    new inquirer.Separator(),
                ],
            },
        ])
    ).rank;

    let emotion = (
        await inquirer.prompt([
            {
                type: "input",
                message: "Enter an Emotion",
                name: "emotion",
            },
        ])
    ).emotion;

    let random = (
        await inquirer.prompt([
            {
                type: "confirm",
                message: "Random?",
                name: "random",
            },
        ])
    ).random;

    let mirror = (
        await inquirer.prompt([
            {
                type: "confirm",
                message: "Mirror?",
                name: "mirror",
            },
        ])
    ).mirror;

    let complete = (
        await inquirer.prompt([
            {
                type: "confirm",
                message: "Complete?",
                name: "complete",
            },
        ])
    ).complete;

    let perfect = (
        await inquirer.prompt([
            {
                type: "confirm",
                message: "Perfect?",
                name: "perfect",
            },
        ])
    ).perfect;

    fetch("https://sparebeat.com/timelines", {
        headers: {
            accept: "application/json, text/plain, _/_",
            "accept-language": "de,en-US;q=0.9,en;q=0.8",
            "content-type": "application/json;charset=UTF-8",
            "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            cookie: `sparebeat_session=${getCookie(
                cookies,
                "sparebeat_session"
            )}`,
            Referer: "https://sparebeat.com/app/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `{"musicId":"${songId}","name":"${name}","level":"${difficulty}","score":${score},"rank":"${rank}","emotion":"${emotion}","options":{"random":${random},"mirror":${mirror}},"complete":${complete},"perfect":${perfect}}`,
        method: "POST",
    })
        .then((res) => res.text())
        .then((data) => {
            if (data == {}) {
                console.log("Success!");
                process.exit();
            } else {
                console.log("Error!", data);
                uploadScore();
            }
        })
        .catch((err) => console.error(err));
}

uploadScore();
