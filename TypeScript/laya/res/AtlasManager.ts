
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
            desc?: string,
            /** 图集基础文件夹 */
            dir: string,
            /** 图集分组 */
            arr: [ATLAS_URL_OPTION]
        }

        type ATLAS_URL_OPTION = {
            /** 备注说明 */
            desc?: string,
            /** 图集名称 (作为标识) */
            name: string,
            /** 图集路径 (path = dir + url) */
            url: string,
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
            scoring,
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

            private static _instance: Atlas;
            private constructor() {}
            public static getInstance(): Atlas {
                if (!this._instance) {
                    this._instance = new Atlas();
                }
                return this._instance;
            }

            /**
             * 根据分组索引加载一组图集
             * @param index 
             * @param callback 
             */
            public loadAtlasByIndex(index: number, callback: (flag: boolean) => void): void {
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
            private __loadAtlas(index: number, callback: (flag: boolean) => void): void {
                const atlasName: string = ATLAS_GROUP[index];
                if (!this._json4AtlasGroup[atlasName]) {
                    return Util.Logger.warn(this._TAG, '__loadAtlas 所加载的图集组 ' + atlasName + ' 不存在');
                }

                // 判断是否有图集需要加载
                const arr: Array<ATLAS_URL_OPTION> = (this._json4AtlasGroup[atlasName] as ATLAS_GROUP_OPTION).arr;
                if (!arr || arr.length === 0) {
                    Util.Logger.debug(this._TAG, '__loadAtlas 没有要加载的图集文件');
                    return callback(false);
                }

                const dir: string = (this._json4AtlasGroup[atlasName] as ATLAS_GROUP_OPTION).dir;
                const atlas: Array<any> = [];
                for (let obj of arr) {
                    atlas.push({ url: dir + obj.url, type: Laya.Loader.ATLAS });
                }

                // 单个加载成功时会返回对象本身，多个加载时会返回 true or false
                Laya.loader.load(atlas, Laya.Handler.create(this, (flag: any) => {
                    callback(flag);
                }));
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
        }
    }
}