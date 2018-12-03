export function timeout_fetch(fetch_promise, timeout = 10000) {
    let timeout_promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject('请求超时,请检查您的网络!');
        }, timeout);
    });

    return Promise.race([
        fetch_promise,
        timeout_promise
    ]);
}

export function postRequest(url, paramsMap) {
    console.log(url);
    return new Promise(function (resolve, reject) {
        timeout_fetch(fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paramsMap)
        })).then(
            (response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.text();
                } else {
                    reject("response not 200")
                }
                // return response.text();
            }
        ).then((text) => {
            // console.log(text);
            try {
                return JSON.parse(text);
            }catch(e){
                reject("json error")
            }
        }).then((responseJson) => {
            return resolve(responseJson);
        })
            .catch((error) => {
                console.log(error);
                if (typeof error.message === "string") {
                    error = error.message;
                }
                reject(error);
            });
    });
}