
/**
 * json 配置文件资源管理
 */
namespace Holy {
    export namespace Res {
        export type FILE_OPTION = {
            /** 文件名称 */
            name: string,
            /** 文件路径 */
            url: string,
        }

        /**
         * 资源文件文件索引
         */
        export const enum FILE_INDEX {
            /** 图集 */
            ATLAS = 0,
            /** 资源 */
            RES,
            /** 动画 */
            ANI,
            /** 游戏配置文件 */
            CONFIG,
        }

        /**
         * 文件名
         */
        export const RES_FILE_NAME = {
            ATLAS: 'atlas',
            RES: 'res',
            ANI: 'ani',
            CONFIG: 'config',
        }

        /**
         * 资源文件管理
         */
        export class FileManager {
            private readonly _TAG: string = 'Url';
            /** 
             * 文件保存目录
             *  <p>默认目录为 config/ </p>
             *  <p>如需修改默认目录，请注意 / 结尾，使用到路径的地方一律未加</p>
             */
            public DIR: string = 'config/';

            /**
             * 文件路径管理
             */
            private FILE_URL: Array<FILE_OPTION>;

            private static _instance: FileManager;
            private constructor() {
                this.__initJsonPath(); // 初始化
            }
            public static getInstance(): FileManager {
                if (!this._instance) {
                    this._instance = new FileManager();
                }
                return this._instance;
            }

            private __initJsonPath(): void {
                this.FILE_URL = new Array();

                for (let key in RES_FILE_NAME) {
                    if (RES_FILE_NAME.hasOwnProperty(key)) {
                        this.FILE_URL[this.FILE_URL.length] = { name: RES_FILE_NAME[key], url: this.DIR + RES_FILE_NAME[key] + '.json' };
                    }
                }

                // Util.Logger.debug(this._TAG, '__initJsonPath: ' + JSON.stringify(this.JSON_URL));
            }

            /**
             * 根据索引获取res file对象
             * @param index 
             */
            private __getUrlByIndex(index: number): FILE_OPTION {
                if (index >= this.FILE_URL.length || !this.FILE_URL[index]) {
                    Util.Logger.warn(this._TAG, 'index ' + index + ' 不存在');
                    return;
                }

                return this.FILE_URL[index];
            }

            /**
             * 根据索引直接加载文件内容
             * @param index 
             * @param callback 
             */
            public loadJsonByIndex(index: number, callback: (data?: any) => void): void {
                const resFileUrl: FILE_OPTION = this.__getUrlByIndex(index);
                if (!resFileUrl) {
                    return callback();
                }

                Laya.loader.load(resFileUrl.url, Laya.Handler.create(this, callback));
            }

            /**
             * 根据 url 加载文件
             * @param { string } url
             * @param { (data: any) => void } callabck 
             */
            public loadByUrl(url: string, callabck: (data: any) => void): void {
                Laya.loader.load(url, Laya.Handler.create(this, callabck));
            }

            /**
             * 根据 url 加载一组文件
             * @param { { url: string, type?: any }[] } urls 
             * @param { (flag: boolean) => void } callabck 
             */
            public loadByUrls(urls: { url: string, type?: any }[], callabck: (flag: boolean) => void): void {
                Laya.loader.load(urls, Laya.Handler.create(this, callabck));
            }
        }

    }
}