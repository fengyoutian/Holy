namespace Holy {
    export namespace Common {

        /**
         * 统一常用方法
         */
        export class Helper {
            private static _instance: Helper;
            private constructor() { }
            public static getInstance(): Helper {
                if (!this._instance) {
                    this._instance = new Helper();
                }
                return this._instance;
            }

            /**
             * 判断是否为空
             * @param data 
             * @author Holy
             * @date 2018-11-09
             */
            isNull(data: any): boolean {
                return data == void 0;
            }

            /**
             * 判断是否为空
             *  <p>
             *      主要用于判断数组和对象是否为空
             *      非数组和对象则视为判空
             *  </p>
             * @param data 
             * @author Holy
             * @date 2018-11-09
             */
            isEmpty(data: any): boolean {
                if (this.isNull(data)) {
                    return true; // typeof(data) !== 'object' 无法判断 null, null 也是对象
                }

                // 字符串判断
                if (typeof(data) == 'string' || data instanceof String) {
                    return data == '' || data.length == 0;
                }

                // 数组
                if (data instanceof Array) {
                    return data.length === 0;
                }
                // 对象
                if (data instanceof Object) {
                    return Object.keys(data).length === 0;
                }

                return false;
            }

        }
    }
}