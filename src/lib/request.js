const noop = () => { };
const NO_PARAMS = {}

function request({
    method = 'GET',
    url,
    params = NO_PARAMS,
    type = 'json',
    checkStatusInResponse = false,
    onSuccess = noop,
    onError = noop,
}) {
    const request = new XMLHttpRequest();

    const urlParams = new URLSearchParams(params);
    const queryString = urlParams.toString();

    request.open(method, url + (queryString ? `?${queryString}` : ''));
    request.responseType = type;

    request.onload = function (event) {
        const target = event.target;

        if (target.status !== 200) {
            onError(target.statusText);

            return
        }

        if (checkStatusInResponse && target.response.status != 'ok') {
            onError(target.statusText);

            return
        }

        onSuccess(target.response);

    }

    request.onerror = function () {
        onError();
    }

    request.send();
}