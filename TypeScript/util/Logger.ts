namespace Holy {
    export namespace Util {

        const enum LOGGER_CODE {
            DEBUG = 0,
            INFO = 1,
            WARNING = 400,
            ERROR = 500
        }
    
        /**
         * 日志管理
         */
        export class Logger {
            private static _TAG: string = '[Holy]';
            private constructor() {}
    
            /**
             * Debug日志
             * 
             * @param msg 
             */
            public static debug(msg: any, ...optionalParams: any[]): void {
                console.debug(this._TAG, LOGGER_CODE.DEBUG, msg, optionalParams);
            }
    
            /**
             * 正常日志
             * 
             * @param msg 
             * @param code  默认0 
             */
            public static info(msg: any, ...optionalParams: any[]): void {
                console.info(this._TAG, LOGGER_CODE.INFO, msg, optionalParams);
            }
    
            /**
             * 警告信息
             * 
             * @param msg 
             * @param code 默认400
             */
            public static warn(msg: any, ...optionalParams: any[]): void {
                console.warn(this._TAG, LOGGER_CODE.WARNING, msg, optionalParams);
            }        
    
            /**
             * 异常信息
             * 
             * @param msg
             * @param code  默认500
             */
            public static error(msg: any, ...optionalParams: any[]): void {
                console.error(this._TAG, LOGGER_CODE.ERROR, msg, optionalParams);
            }
        }
    }
}