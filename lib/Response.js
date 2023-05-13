const Enum = require("../config/Enum");
const CustomError = require('./Error')
const ms = require('../lib/MagicStrings')

class Response {
    constructor() { }

    static successResponse(data, msgTittle, msgDesc, code = 200) {
        return {
            success: true,
            code,
            message: {
                title: msgTittle,
                desc: msgDesc
            },
            data
        }
    }

    static errorResponse(error) {
        if (error instanceof CustomError) {

            return {
                success: false,
                code: error.code,
                message: {
                    message: error.message,
                    description: error.description
                }
            }
        }else if(error.message.includes('E11000')){
            
            return {
                success: false,
                code: Enum.HTTP_CODES.CONFLICT,
                message: {
                    title: ms.Genel.zatenVarTitle,
                    desc: ms.Genel.zatenVarDesc
                }
            }
        }

        return {
            success: false,
            code: Enum.HTTP_CODES.INTERNAL_SERVER_ERROR,
            message: {
                title: "Unknown Error!",
                desc: error.message
            }
        }
    }
}

module.exports = Response;