namespace Holy {
    export namespace Util {

        /**
         * 随机数工具类
         */
        export class Random {
            private static _instance: Random;
            private constructor() { }
            public static getInstance(): Random {
                if (!this._instance) {
                    this._instance = new Random();
                }
                return this._instance;
            }

            /**
             * 随机数
             */
            ran(): number {
                return Math.random();
            }

            /**
             * 根据种子取随机数
             * @author Holy
             * @date   2018-03-24
             * @param seed 随机数种子
             * @param min 最小值
             * @param max 最大值
             * @param isInteger 是否取整，默认取整
             */
            ranBySeed(seed: number, min: number, max: number, isInteger: boolean = true) {
                max = max || 1;
                min = min || 0;

                seed = (seed * 9301 + 49297) % 233280;
                const rnd: number = seed / 233280.0;

                const result: number = rnd * (max - min) + min;
                return isInteger ? Math.floor(result) : result;
            }

            /**
             * 根据取值范围计算随机数 [min, max）
             * @author Holy
             * @date 2018-11-09
             */
            ranByRanges(min: number, max: number): number {
                return (Math.random() * (max - min)) + min;
            }

            /**
             * 根据最大值计算随机数[0, max)
             * @author Holy
             * @date 2018-11-09
             */
            ranByMax(max: number): number {
                return Math.floor(Math.random() * max); // [0, max)
            }

            /**
             * 随机获取数组中的一条数据
             * @author Holy
             * @date 2018-11-09
             */
            ranByArr<T>(arr: T[]): T {
                if (!(arr instanceof Array)) {
                    throw TypeError('Please pass in an array!');
                }

                let index = this.ranByMax(arr.length);
                return arr[index];
            }

        }
    }
}