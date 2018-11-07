namespace Holy {
    export namespace UI {

        /**
         * 龙骨动画加载参数
         */
        export interface SKELETON_OPTION extends UI_OPTION {
            /**
             * .sk 文件路径
             */
            url: string;
            /**
             * 龙骨加载完成回调，sk 为龙骨本身实例
             */
            callback?: (sk: Laya.Skeleton) => void;
            /**
             * 加载完成后默认播放动作
             */
            play?: {
                /**
                 * 动作名称或索引
                 */
                nameOrIndex: any;
                /**
                 * 是否循环播放
                 */
                loop: boolean;
            }
        }

        /**
         * 封装龙骨动画常用加载参数
         *  .sk 文件
         */
        export class SK {
            /**
             * 加载龙骨动画
             */
            static loadSK(opt: SKELETON_OPTION): Laya.Skeleton {
                const sk: Laya.Skeleton = new Laya.Skeleton();
                return this.__optHandle(sk, opt);
            }
            
            /**
             * 参数统一处理
             * @param sk 
             * @param opt 
             */
            private static __optHandle(sk: Laya.Skeleton, opt: SKELETON_OPTION): Laya.Skeleton {
                sk.name = opt.name;
                sk.zOrder = opt.zOrder;
                // 设置位置
                opt.x !== void 0 && sk.hasOwnProperty('x') && (sk.x = opt.x);
                opt.y !== void 0 && sk.hasOwnProperty('y') && (sk.y = opt.y);
                // 设置缩放
                opt.scaleX !== void 0 && (sk.scaleX = opt.scaleX);
                opt.scaleY !== void 0 && (sk.scaleY = opt.scaleY);

                sk.load(opt.url, Laya.Handler.create(this, () => {
                    opt.play && sk.play(opt.play.nameOrIndex, opt.play.loop);
                    opt.callback && opt.callback(sk);
                }));
                opt.node && opt.node.addChild(sk);
                return sk;
            }
        }
    }
}