import { apiResponse } from "./apiResponse";

export const created = (res, message = "Created", data = null, additionalFields = {}) => {
    apiResponse({
        res,
        status: 201,
        success: true,
        message,
        data,
        ...additionalFields
    })
}