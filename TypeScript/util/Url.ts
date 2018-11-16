namespace Holy {
    export namespace Util {

        /**
         * url 工具类
         */
        export class Url {
            private static _instance: Url;
            private constructor() { }
            public static getInstance(): Url {
                if (!this._instance) {
                    this._instance = new Url();
                }
                return this._instance;
            }

            /**
             * 获取 URL 里的参数
             * @param key 参数键名 
             */
            getQueryString(key: string): string {
                const reg: RegExp = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
                const regExpMatchArray: RegExpMatchArray = window.location.search.substr(1).match(reg);
                if (regExpMatchArray) {
                    return decodeURIComponent(regExpMatchArray[2]);
                }
                
                return null;
            }


        }
    }
}