export function apiResponse({ res = null, status = 200, success = true, message = "", data = undefined, ...additionalFields }) {
    if (!res) {
        console.error("Invalid response object");
        return;
    }

    const responseBody = {
        success,
        message,
    };

    if (data !== undefined) {
        responseBody.data = data;
    }

    Object.assign(responseBody, additionalFields);

    return res.status(status).json(responseBody);
}
