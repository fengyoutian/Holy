namespace Holy {
    export namespace Util {

        /**
         * 时间工具类
         */
        export class Time {
            static Now: number; // 预留字段，以后可能从服务器传递日期过来，防止客户端修改时间

            private static _instance: Time;
            private constructor() { }
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
             * 获取当前时间
             */
            public getNow(): Date {
                let date: Date = new Date();

                if (Time.Now !== void 0) {
                    // 服务器日期替换本地日期
                    const serverDate: Date = new Date(Time.Now);
                    serverDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                    date = serverDate;
                }
                return date;
            }

            /**
             * 获取当前时间戳 (10位, 不包含毫秒)
             */
            public getNowTs(): number {
                return Math.floor(this.getNow().getTime() / 1000);
            }

            /**
             * 格式化日期成字符串
             *
             * @param {Date} date
             * @return {string} year-month-day
             */
            public formatDate2Str(date: Date): string {
                let year: number = date.getFullYear();
                let month: number = date.getMonth() + 1;
                let day: number = date.getDate();
                return year + '-' + month + '-' + day;
            }

            public getCurrDate4Srt(): string {
                return this.formatDate2Str(this.getNow());
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
                let date: Date = this.getNow();
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
                let date = this.getNow();
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
                let date: Date = this.getNow();
                let monthday: number = date.getDate();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                return (date.getTime() / 1000 - 86400 * (monthday - 1));
            }

            /**
             * 比较日期字符串：格式 getCurrDate()输出
             *
             * @author Holy
             * @date   2018-06-11
             * @param  {[string]}   date1 [必选参数]
             * @param  {[string]}   date2 [可选，不传则与当前时间比较]
             * @return {[boolean]}        [1:date1 > date2, 0:date1 == date2, -1:date1 < date2]
             */
            public compareDate4Str(date1: string, date2: string = this.getCurrDate4Srt()) {
                // 等于直接使用字符串比较即可
                if (date1 == date2) {
                    return 0;
                }

                return new Date(date1) > new Date(date2) ? 1 : -1;
            }
        }
    }
}