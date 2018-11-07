
namespace Holy {
    export namespace UI {
        import Node = Laya.Node;
        import Sprite = Laya.Sprite;
        import Handler = Laya.Handler;

        /**
         * UI 基础属性
         */
        export interface UI_OPTION {
            /** Sprite 名称 */
            name: string;
            /** Z轴位置 */
            zOrder: number;
            /** x */
            x?: number;
            /** x */
            y?: number;
            /** x轴缩放值 取值[0,1] */
            scaleX?: number;
            /** y轴缩放值 取值[0,1] */
            scaleY?: number;
            /** 父节点 */
            node?: Laya.Node;
        }

        /**
         * 渲染参数
         */
        export interface RENDLER_OPTION extends UI_OPTION {
            /** width */
            width?: number;
            /** height */
            height?: number;
            /** 加载图片 */
            loadImage?: {
                /** 资源路径 */
                url: string;
                /** loadImage 加载完成回调 */
                complete?: Laya.Handler;
            },
            /** x轴锚点 取值[0,1] */
            anchorX?: number;
            /** y轴锚点 取值[0,1] */
            anchorY?: number;
        }

        /**
         * 渲染器
         */
        export class Render {
            /**
             * 加载精灵
             * @param opt 
             */
            static loadSprite(opt: RENDLER_OPTION): Sprite {
                const sprite: Sprite = new Sprite();
                return this.__optHandle(sprite, opt) as Sprite;
            }

            /**
             * 参数统一处理
             * 
             * @param node 
             * @param opt 
             */
            private static __optHandle(node: Node, opt: RENDLER_OPTION): Node {
                opt.loadImage && node.hasOwnProperty('loadImage') && (node as Sprite).loadImage(opt.loadImage.url);

                node.name = opt.name;
                node.hasOwnProperty('zOrder') && ((node as Sprite).zOrder = opt.zOrder);
                // 设置缩放
                opt.scaleX !== void 0 && node.hasOwnProperty('scaleX') && ((node as Sprite).scaleX = opt.scaleX);
                opt.scaleY !== void 0 && node.hasOwnProperty('scaleY') && ((node as Sprite).scaleY = opt.scaleY);
                // 设置大小
                opt.width !== void 0 && node.hasOwnProperty('width') && ((node as Sprite).width = opt.width);
                opt.height !== void 0 && node.hasOwnProperty('height') && ((node as Sprite).height = opt.height);
                // 设置位置
                opt.x !== void 0 && node.hasOwnProperty('x') && ((node as Sprite).x = opt.x);
                opt.y !== void 0 && node.hasOwnProperty('y') && ((node as Sprite).y = opt.y);
                // 设置锚点
                opt.anchorX !== void 0 && (node.hasOwnProperty('anchorX') ? (node as Laya.Image).anchorX = opt.anchorX : (node as Sprite).pivotX = (node as Sprite).width * opt.anchorX);
                opt.anchorY !== void 0 && (node.hasOwnProperty('anchorY') ? (node as Laya.Image).anchorY = opt.anchorY : (node as Sprite).pivotY = (node as Sprite).height * opt.anchorY);
                
                opt.node && opt.node.addChild(node);
                return node;
            }
        }
    }
}  
