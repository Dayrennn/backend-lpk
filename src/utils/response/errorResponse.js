import { apiResponse } from "./apiResponse";

export const badRequest = (res, message = "Bad Request", data = null, additionalFields = {}) => {
    apiResponse({
        res,
        status: 400,
        success: false,
        message,
        ...(errors && { errors }),
        ...additionalFields,
    });
};

export const Unauthorized = (res, message = "Unauthorized", data = null, additionalFields = {}) => {
    apiResponse({
        res,
        status: 401,
        success: false,
        message,
        data,
        ...additionalFields,
    });
};

export const Forbidden = (res, message = "Forbidden", data = null, additionalFields = {}) => {
    apiResponse({
        res,
        status: 403,
        success: false,
        message,
        data,
        ...additionalFields,
    });
};

export const internalServerError = (res, message = "Internal Server Error", data = undefined, additionalFields = {}) => {
    apiResponse({
        res,
        status: 500,
        success: false,
        message,
        data,
        ...additionalFields
    })
}