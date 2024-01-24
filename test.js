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
        cookie: `sparebeat_session=s%3Au9mgzP4mSQ3Z7SYWjqpnH-FR7kJNjScA.D8QHwj4iP15y60k%2Fwi3DEDolVhdoZO202I0PK22dwCg`,
        Referer: "https://sparebeat.com/app/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: '{"musicId":"kirakirize_world","name":"MYST","level":"hard","score":999999,"rank":"B","emotion":"www","options":{"random":false,"mirror":false},"complete":true,"perfect":true}',
    method: "POST",
})
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    });
