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
             * 根据取值范围计算随机数 [min, max）
             * @author Holy
             * @date 2018-11-09
             */
            ranBySeed(min: number, max: number): number {
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
            ranByArr(arr: any[]): number {
                if (!(arr instanceof Array)) {
                    throw TypeError('Please pass in an array!');
                }

                let index = this.ranByMax(arr.length);
                return arr[index];
            }

        }
    }
}