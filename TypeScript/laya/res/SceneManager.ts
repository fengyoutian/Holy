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
            atlasIndex?: ATLAS_GROUP
        }

        /**
         * 强制替换规则
         * <p>
         *  1.filterLanguage 和 replaceLanguage 只需填一个，或则不填
         *  2.填两个按 replaceLanguage 处理
         *  3.都不填则默认全部替换，如全部都不替换则在 setLocale() 时不要传递参数
         * </p>
         */
        export interface FORCE_REPLAYCE_RULE {
            /** 
             * 默认语言 
             * <p>
             *  与目录相关
             * </p>
             */
            defaultLocale: string;
            /** 
             * 本地化根目录(需替换的值)
             * <p>
             *  替换规则:
             *      首次: localeRootDirs[locale] replace localeRootDirs[defaultLocale]
             *      之后: localeRootDirs[locale] replace localeRootDirs[preLocale]
             * </p>
             */
            localeRootDirs: { [key: string]: string };

            /** 过滤语言, 在列表的语言则不会替换 */
            filterLanguage?: string[];
            /** 替换的语言数组 */
            replaceLanguage?: string[];
        }

        /**
         * 场景加载
         */
        export class SceneManager {
            private readonly _TAG: string = 'SceneManager';
            /** 实例 */
            private static _instance: SceneManager;
            private constructor() { }
            public static getInstance(): SceneManager {
                if (!this._instance) {
                    this._instance = new SceneManager();
                }
                return this._instance;
            }

            /**
             * 之前的语言，防止多次替换无法替换回默认语言
             * <p>
             *  key: ui的存储键
             *  value: 对应的语言
             * </p>
             */
            private _uiLocal: { [symbol: string]: string } = { };
            private _locale: string = 'zh_CN'; // 默认中文（简体）
            private _forceReplace: FORCE_REPLAYCE_RULE; // 强制替换规则

            /**
             * 修改使用的语言环境
             * <p>
             *  默认使用中文简体: 'zh_CN'
             * </p>
             * @param language 请按国际标准格式填写，如: 'zh_CN', 'en_US' ...
             * @param forceReplace 强制替换规则，如需替换则传入规则
             */
            public setLocale(language: string = 'zh_CN', forceReplace?: FORCE_REPLAYCE_RULE): void {
                if (Holy.Common.Helper.getInstance().isEmpty(language)) {
                    return Holy.Util.Logger.warn(this._TAG, 'setLocale language is ' + language);
                }

                if (language === this._locale) {
                    return Holy.Util.Logger.debug(this._TAG, `setLocale language is ${language} equal current!`);
                }

                this._locale = language;
                this._forceReplace = forceReplace;
                this.__replaceEmbeddedScene();
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

                        Laya.View.uiMap[opt.fileUrl] = this.__forceReplace4Locale(opt.fileUrl, data);
                        this.__loadAtlas(opt, callback);
                    });
                } else if (SCENE_MODE.LOAD === opt.sceneMode && !Laya.View.uiMap) {
                    const url: string = 'ui.json';
                    FileManager.getInstance().loadByUrl(url, (data: any) => {
                        if (!data) {
                            return callback(false);
                        }

                        Laya.View.uiMap = this.__forceReplace4Locale(url, data);
                        this.__loadAtlas(opt, callback);
                    });
                } else {
                    this.__loadAtlas(opt, callback);
                }
            }

            /**
             * 替换嵌入式场景的 uiView
             * <p>
             *  主要替换 layaUI.max.all.ts 里的 uiView 
             * </p>
             */
            private __replaceEmbeddedScene(): void {
                if (Holy.Common.Helper.getInstance().isEmpty(this._forceReplace)) {
                    return;
                }

                this.__recursiveUIView();
            }
            
            private __recursiveUIView(obj: any = ui): void {
                if (Holy.Common.Helper.getInstance().isEmpty(obj)) {
                    return;
                }

                for (const key of Object.keys(obj)) {
                    const newObj: any = obj[key];
                    if (typeof (newObj) !== 'function') {
                        this.__recursiveUIView(newObj);
                        continue;
                    }

                    const uiView: any = newObj['uiView'];
                    if (Holy.Common.Helper.getInstance().isEmpty(uiView)) {
                        continue; // 非嵌入式，没有 uiView 参数，直接跳到下一个
                    }
                    
                    newObj['uiView'] = this.__forceReplace4Locale(key, uiView); // 强制替换
                }
            }

            /**
             * 强制替换 data 里的资源根目录
             * @param data 
             */
            private __forceReplace4Locale(uiKey: string, data: any): any {
                if (
                    Holy.Common.Helper.getInstance().isEmpty(this._forceReplace) ||
                    Holy.Common.Helper.getInstance().isEmpty(this._forceReplace.localeRootDirs) || 
                    Holy.Common.Helper.getInstance().isEmpty(this._forceReplace.localeRootDirs[this._locale]) ||
                    typeof (data) !== 'object'
                ) {
                    return data; // 不替换
                }

                if (!Holy.Common.Helper.getInstance().isEmpty(this._forceReplace.replaceLanguage)) {
                    for (const locale of this._forceReplace.replaceLanguage) {
                        if (this._locale == locale) {
                            return this.__replaceContent(uiKey, data);
                        }
                    }
                    return data; // 替换列表则不替换
                }

                if (!Holy.Common.Helper.getInstance().isEmpty(this._forceReplace.filterLanguage)) {
                    for (const locale of this._forceReplace.filterLanguage) {
                        if (this._locale == locale) {
                            return data; // 在过滤列表，不替换
                        }
                    }
                    return this.__replaceContent(uiKey, data);
                }
            }

            /**
             * 替换内容
             * @param data 
             */
            private __replaceContent(uiKey: string, data: any): any {
                const handleIndexOf = (str: string) => {
                    if (str.lastIndexOf('/') != -1) {
                        return str;
                    }
                    return str.concat('/');
                }
                // 判断 uiLocale 是否存在，不存在为未替换过，直接使用默认语言
                const preLocale: string = !Holy.Common.Helper.getInstance().isEmpty(this._uiLocal[uiKey]) ? this._uiLocal[uiKey] : this._forceReplace.defaultLocale;

                // 判断语言目录是否'/'结尾，不是则加上
                const searchValue: string = handleIndexOf(this._forceReplace.localeRootDirs[preLocale]);
                const replaceValue: string = handleIndexOf(this._forceReplace.localeRootDirs[this._locale]);

                const uiStr: string = JSON.stringify(data);
                this._uiLocal[uiKey] = this._locale; // 保存之前使用的语言先
                return JSON.parse(Holy.Util.StringUtil.replaceAll(uiStr, searchValue, replaceValue));
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