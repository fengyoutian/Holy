
/**
 * 图集资源管理
 */
namespace Holy {
    export namespace Res {
        /**
         * 图集配置分组数据
         */
        export type ATLAS_GROUP_OPTION = {
            /** 备注说明 */
            desc?: string;
            /** 
             * 图集基础文件夹
             * <p>
             *  需要支持国际化时在key后加上语言，如: dir_en_US
             *  dir 必须保留一个，其他语言支持时添加对应的key，如不支持的语言默认走 dir
             * </p>
             */
            dir: string;
            /** 图集分组 */
            arr: [ATLAS_URL_OPTION];
        }

        type ATLAS_URL_OPTION = {
            /** 备注说明 */
            desc?: string;
            /** 图集名称 (作为标识) */
            name: string;
            /** 图集路径 (url = dir + path) */
            path: string;
        }

        /**
         * 图集加载场景分组枚举，不能定义成const，需要同时拿到 key 和 value
         */
        export enum ATLAS_GROUP {
            main = 0,
            home,
            store,
            room,
            game,
            gameOver,
            ranking,
            activity
        }

        /**
         * 图集资源管理
         *  <p>得先在 Json 配置，自行对图集进行分组，ATLAS_GROUP_INDEX 和 ATLAS_GROUP_NAME 一一对应</p>
         *  <p>json格式: 
         *      {
         *          ATLAS_GROUP_NAME: ATLAS_GROUP_OPTION
         *      }
         *  </p>
         * 
         * @author Holy
         * @date 2018-10-30
         */
        export class Atlas {
            private readonly _TAG: string = 'Atlas';
            private _jsonIsLoad: boolean = false; // json 文件是否加载

            private _json4AtlasGroup: ATLAS_GROUP_OPTION; // 图集分组内容

            private _locale: string = 'zh_CN'; // 默认中文（简体）

            private static _instance: Atlas;
            private constructor() { }
            public static getInstance(): Atlas {
                if (!this._instance) {
                    this._instance = new Atlas();
                }
                return this._instance;
            }

            /**
             * 修改使用的语言环境
             * <p>
             *  默认使用中文简体: 'zh_CN'
             * </p>
             * @param language 请按国际标准格式填写，如: 'zh_CN', 'en_US' ...
             */
            public setLocale(language: string = 'zh_CN'): void {
                if (Holy.Common.Helper.getInstance().isEmpty(language)) {
                    return Holy.Util.Logger.warn(this._TAG, 'setLocale language is ' + language);
                }
                this._locale = language;
            }

            /**
             * 清除分组缓存
             * @param index 
             */
            public clearAtlasGroup(index: ATLAS_GROUP): void {
                Laya.Loader.clearResByGroup(this.__getGroupName(index));
            }

            /**
             * 根据分组索引加载一组图集
             * @param index 
             * @param callback 
             */
            public loadAtlasByIndex(index: ATLAS_GROUP | ATLAS_GROUP[], callback: (flag: boolean) => void): void {
                if (this._jsonIsLoad) {
                    return this.__loadAtlas(index, callback);
                }

                // 先加载文件
                this.__loadJson((flag: boolean) => {
                    if (flag) {
                        this.__loadAtlas(index, callback);
                    } else {
                        Util.Logger.warn(this._TAG, '__loadJson 读取文件异常!');
                        callback(false);
                    }
                });
            }

            /**
             * 加载图集
             * @param index 
             * @param callback 
             */
            private __loadAtlas(index: ATLAS_GROUP | ATLAS_GROUP[], callback: (flag: boolean) => void): void {
                let atlas: any[];
                if (typeof (index) === 'object' && index instanceof Array) {
                    atlas = new Array();
                    for (const group of index) {
                        const tempArr: any[] = this.__getAtlasUrl(group);
                        if (Holy.Common.Helper.getInstance().isEmpty(tempArr)) {
                            return callback(false);
                        }
                        atlas = atlas.concat(tempArr);
                    }
                } else {
                    atlas = this.__getAtlasUrl(index);
                }

                // 单个加载成功时会返回对象本身，多个加载时会返回 true or false
                Laya.loader.load(atlas, Laya.Handler.create(this, (flag: any) => {
                    callback(flag);
                }));
            }

            /**
             * 获取图集链接
             * @param index 
             */
            private __getAtlasUrl(index: ATLAS_GROUP): any[] {
                const atlasName: string = ATLAS_GROUP[index];
                if (!this._json4AtlasGroup[atlasName]) {
                    Util.Logger.warn(this._TAG, '__loadAtlas 所加载的图集组 ' + atlasName + ' 不存在');
                    return;
                }

                // 判断是否有图集需要加载
                const arr: Array<ATLAS_URL_OPTION> = (this._json4AtlasGroup[atlasName] as ATLAS_GROUP_OPTION).arr;
                if (!arr || arr.length === 0) {
                    Util.Logger.debug(this._TAG, '__loadAtlas 没有要加载的图集文件');
                    return;
                }

                const atlas: Array<any> = [];
                for (let obj of arr) {
                    const url: string = this.__getLocaleDir(atlasName) + obj.path;
                    atlas.push({ url: url, type: Laya.Loader.ATLAS });

                    Laya.Loader.setGroup(url, this.__getGroupName(index)); // 设置资源分组
                }

                return atlas;
            }

            /**
             * 加载Json文件
             * @param callback 
             */
            private __loadJson(callback: (flag: boolean) => void): void {
                if (this._jsonIsLoad) {
                    callback(false);
                }

                FileManager.getInstance().loadJsonByIndex(FILE_NAME.atlas, (json: any) => {
                    this._jsonIsLoad = !!json; // 单个加载成功时会返回对象本身，多个加载时会返回 true or false

                    this._jsonIsLoad && this.__parseAtlsGroup4Json(json); // 解析数据
                    callback(this._jsonIsLoad);
                });
            }

            /**
             * 解析图集数组数据
             * @param data 
             */
            private __parseAtlsGroup4Json(data: ATLAS_GROUP_OPTION): void {
                Util.Logger.debug(this._TAG, '__parseAtlsGroup4Json callback state: ' + this._jsonIsLoad);

                this._json4AtlasGroup = data;
            }

            /**
             * 获取本地化目录
             * @param atlasName 
             */
            private __getLocaleDir(atlasName: string): string {
                const atlasGroup: ATLAS_GROUP_OPTION = this._json4AtlasGroup[atlasName];
                const localeDir: string = atlasGroup['dir_'.concat(this._locale)];
                if (!Holy.Common.Helper.getInstance().isNull(localeDir)) {
                    return localeDir;
                }

                return atlasGroup.dir;
            }

            /**
             * 获取资源分组名
             * @param index 
             */
            private __getGroupName(index: ATLAS_GROUP): string {
                return 'Holy'.concat('_', ATLAS_GROUP[index], '_', String(index));
            }

        }
    }
}