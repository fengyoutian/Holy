
namespace Holy {
    export namespace Util {

        /**
         * 数组工具
         */
        export class Array {
            /**
             * 模拟 ES6 的fill, 修改数组本身
             * 
             * @param [any[]]   arr 
             * @param [any]     value 
             * @param [number]  start 
             * @param [number]  end 
             */
            static fill<T>(arr: T[], value: any, start?: number, end?: number): T[] {
                if (start !== void 0 && start >= arr.length) {
                    throw Error('start 超出数组长度');
                }

                if (end !== void 0 && end < 0) {
                    throw Error('end 必须大于0');
                }

                start === void 0 && (start = 0);
                end === void 0 && (end = arr.length);

                for (let index = start; index < end; index++) {
                    arr[index] = value;
                }
                return arr;
            }
        }
        
    }
}
