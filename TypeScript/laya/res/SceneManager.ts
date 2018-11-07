namespace Holy {
    export namespace Res {
        /**
         * 场景加载模式
         */
        export const enum SCENE_MODE {
            EMBEDDED = 0,
            LOAD,
            SPLIT
        }

        /**
         * 加载场景所需参数
         */
        export type SCENE_OPTION = {
            /** 场景加载模式 */
            sceneMode: SCENE_MODE, 
            /** 场景json文件url, 不包含后缀 (分离模式) */
            fileUrl?: string, 
            /** 图集索引 */
            atlasIndex?: ATLAS_GROUP_INDEX
        }

        /**
         * 场景加载
         */
        export class SceneManager {
            /** 实例 */
            private static _instance: SceneManager;
            private constructor() {}
            public static getInstance(): SceneManager {
                if (!this._instance) {
                    this._instance = new SceneManager();
                }
                return this._instance;
            }

            /**
             * 加载场景资源
             * @param { SCENE_OPTION } opt 场景参数
             * @param { (flag: boolean } callback
             */
            public loadScene(opt: SCENE_OPTION, callback: (flag: boolean) => void): void {
                /*
                 * step 1.先加载场景资源
                 */
                if (SCENE_MODE.SPLIT === opt.sceneMode && !Laya.View.uiMap[opt.fileUrl] && opt.fileUrl) {
                    FileManager.getInstance().loadByUrl(`${opt.fileUrl}.json`, (data: any) => {
                        if (!data) {
                            return callback(false);
                        }

                        Laya.View.uiMap[opt.fileUrl] = data;
                        this.__loadAtlas(opt, callback);
                    });
                } else if (SCENE_MODE.LOAD === opt.sceneMode && !Laya.View.uiMap) {
                    FileManager.getInstance().loadByUrl('ui.json', (data: any) => {
                        if (!data) {
                            return callback(false);
                        }

                        Laya.View.uiMap = data;
                        this.__loadAtlas(opt, callback);
                    });
                } else {
                    this.__loadAtlas(opt, callback);
                }
            }

            /**
             * 加载图集
             * @param { SCENE_OPTION } opt 
             * @param { (flag: boolean, data?: any) => void } callback 
             */
            private __loadAtlas(opt: SCENE_OPTION, callback: (flag: boolean, data?: any) => void): void {
                if (opt.atlasIndex === void 0) {
                    return callback(true);
                }

                /*
                 * step 2.加载图集
                 */
                Atlas.getInstance().loadAtlasByIndex(opt.atlasIndex, (flag: boolean) => {
                    if (!flag) {
                        return callback(false);
                    }

                    callback(true);
                });
            }
        }
    }
}