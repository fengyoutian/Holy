namespace Holy {
    export namespace Util {

        /**
         * 时间工具类
         */
        export class Time {
            private static _instance: Time;
            private constructor() {}
            /**
             * 采用单例模式管理工具类，没使用的工具类不会创建实例
             */
            public static getInstance(): Time {
                if (!this._instance) {
                    this._instance = new Time();
                }

                return this._instance;
            }

            /**
             * 获取当前日期
             *
             * @param {Date} date
             * @return {string} year-month-day
             */
            public getDateStr(date: Date): string {
                let year: number = date.getFullYear();
                let month: number = date.getMonth() + 1;
                let day: number = date.getDate();
                return year + '-' + month + '-' + day;
            }

            /**
             * 获取当前时间
             * 
             * @param {Date} date
             * @return {string} hh:mm:ss
             */
            public getTimeStr(data: Date): string {
                return data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds();
            }

            /**
             * 获取给定时间的当天开始时间戳，单位秒
             * 
             * @param {number} timestamp 时间戳 (s)
             */
            public getTimeBeginTs(timestamp: number): number {
                let date: Date = new Date(timestamp * 1000);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                return date.getTime() / 1000;
            }

            /**
             * 获取当天的开始时间戳，单位秒
             */
            public getTodayBeginTs(): number {
                let date: Date = new Date();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                return date.getTime() / 1000;
            }

            /**
             * 获取当周的开始时间戳，单位秒
             */
            public getWeekBeginTs(): number {
                let date = new Date();
                let weekday = date.getDay();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                return date.getTime() / 1000 - 86400 * weekday;
            }

            /**
             * 获取当月的开始时间戳，单位秒
             */
            public getMonthBeginTs(): number {
                let date: Date = new Date();
                let monthday: number = date.getDate();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                return (date.getTime() / 1000 - 86400 * (monthday - 1));
            }

            /**
             * 获取当前时间戳
             */
            public getNowTs(): number {
                return Math.floor(new Date().getTime() / 1000);
            }
        }
    }
}