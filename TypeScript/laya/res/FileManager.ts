
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
        export enum FILE_NAME {
            /** 图集 */
            atlas = 0,
            /** 资源 */
            res,
            /** 动画 */
            ani,
            /** 游戏配置文件 */
            config,
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

            private static _instance: FileManager;
            private constructor() {}
            public static getInstance(): FileManager {
                if (!this._instance) {
                    this._instance = new FileManager();
                }
                return this._instance;
            }

            /**
             * 根据索引获取res file对象
             * @param index 
             */
            private __getUrlByIndex(index: number): FILE_OPTION {
                const fileName: string = FILE_NAME[index];
                if (!fileName) {
                    Util.Logger.warn(this._TAG, 'index ' + index + ' 不存在');
                    return;
                }

                return { name: fileName, url: this.DIR + fileName + '.json' };
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