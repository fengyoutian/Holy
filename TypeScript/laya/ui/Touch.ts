namespace Holy {
    export namespace UI {
        /**
         * 点击触控参数
         */
        const TOUCH_CLICK = {
            /**
             * id参数名称，保存到 target 参数列表中
             */
            idName: 'HolyOnClickId',
            /** 缩放/恢复 比例 */
            scale: 0.05,
            /** alpha 减小恢复比例 */
            alpha: 0.05,
            /**
             * 代理接收UP事件
             */
            upProxy: {
                /** 是否绑定了事件 */
                bindEvent: false,
                /** 本身节点 */
                owner: void 0,
                /** 作用节点 */
                target: void 0,
            },
        }

        /**
         * 触控方式参数
         */
        type TOUCH_OPTION = {
            /** 给添加触控的精灵赋一个id */
            id: number,
            /** 触控参数 */
            touch?: TOUCH_PARAM,
            /**
             * 原始样式
             */
            originStyle: {
                scaleX: number,
                scaleY: number,
                alpha: number,
            },
            /**
             * 触控回调
             */
            callback: (node: any, touch?: TOUCH_PARAM) => void,
        }

        /**
         * 触控参数
         */
        export type TOUCH_PARAM = {
            /** 开始触控的位置 */
            beginPos: { x: number, y: number },
            /** 开始触控时精灵的位置 */
            beginSpPos: { x: number, y: number },
            /** 结束触控的位置 */
            endPos?: { x: number, y: number },
            /** 结束触控时精灵的位置 */
            endSpPos?: { x: number, y: number },
        }

        /**
         * 触控事件封装
         */
        export class Touch {
            private readonly _TAG: string = 'Touch';
            private static _instance: Touch;
            private constructor() {}
            /**
             * 获取实例
             */
            public static getInstance(): Touch {
                if (!this._instance) {
                    this._instance = new Touch();
                }
                return this._instance;
            }

            private _click: TOUCH_OPTION[] = [];

            /**
             * 按钮 显示/隐藏
             * @param btn 按钮
             * @param visible 默认显示，(true: 显示, false: 隐藏)
             * @param skin 切换皮肤 (可选) 
             */
            visible(btn: Laya.Sprite, visible: boolean = true, skin?: string): void {
                btn.visible = visible;
                btn.mouseEnabled = visible;

                if (skin) {
                    if (btn.hasOwnProperty('skin')) {
                        (btn as Laya.Image).skin = skin;
                    } else if (btn.hasOwnProperty('texture')) {
                        const texture: Laya.Texture = Laya.loader.getRes(skin);
                        btn.texture = texture;
                    }
                }
            }

            /**
             * 按钮 允许/禁止 交互
             * @param btn 按钮
             * @param disable 默认允许交互 (true: 禁止, false: 允许)
             * @param skin 切换皮肤 (可选), 注: btn 有 gray 属性时, 禁止时不填 skin 则默认设置灰度使按钮变灰, 允许交互时恢复
             */
            disable(btn: Laya.Sprite, disable: boolean = false, skin?: string): any {
                btn.mouseEnabled = !disable;

                if (skin) {
                    if (btn.hasOwnProperty('skin')) {
                        (btn as Laya.Image).skin = skin;
                    } else if (btn.hasOwnProperty('texture')) {
                        const texture: Laya.Texture = Laya.loader.getRes(skin);
                        btn.texture = texture;
                    }
                } else if (btn.hasOwnProperty('gray')) {
                    (btn as Laya.Button).gray = disable;
                }
            }

            /**
             * 点击事件
             * @param { Laya.Sprite } node 
             * @param { callback: (node: any, touch?: any) => void } callback tou 为TOUCH_OPTION.touch
             */
            onClick(node: Laya.Sprite, callback: (node: any, touch?: TOUCH_PARAM) => void): void {
                const upProxy: Laya.Sprite = this.__loadUpProxy();

                const touchEvent: any = (e: Laya.Event) => {
                    e.stopPropagation(); // 终止事件下发
                    
                    // 直接使用 node 会在使用 upProxy 时作用域污染
                    let target: Laya.Sprite = e.target === node ? e.target : TOUCH_CLICK.upProxy.target;
                    let opt: TOUCH_OPTION = this._click[target[TOUCH_CLICK.idName]];
                    switch (e.type) {
                        case Laya.Event.CLICK:
                            opt.callback && opt.callback(target, opt.touch);
                            break;
                        case Laya.Event.MOUSE_DOWN:
                            // 修改样式
                            target.alpha = opt.originStyle.alpha - TOUCH_CLICK.alpha;
                            target.scale(opt.originStyle.scaleX - TOUCH_CLICK.scale, opt.originStyle.scaleY - TOUCH_CLICK.scale);
                            // 初始参数
                            opt.touch = {
                                beginPos: { x: e.stageX, y: e.stageY },
                                beginSpPos: { x: target.x, y: target.y }
                            }
                            // 处理 up 事件代理
                            TOUCH_CLICK.upProxy.target = target;
                            upProxy.zOrder = target.zOrder + 1;
                            upProxy.visible = true;
                            break;
                        case Laya.Event.MOUSE_UP:
                            // 恢复样式
                            if (target) {
                                target.alpha = opt.originStyle.alpha;
                                target.scale(opt.originStyle.scaleX, opt.originStyle.scaleY);
                            }
                            // 结束参数
                            if (opt) {
                                opt.touch.endPos = { x: e.stageX, y: e.stageY };
                                opt.touch.endSpPos = { x: target.x, y: target.y };
                            }
                            // 处理 up 事件代理
                            upProxy.visible = false;
                            // 处理点击
                            if (this.__hittest(target, opt)) {
                                Util.Logger.debug(this._TAG, target.name + ' clicked.');
                                opt.callback && opt.callback(target, opt.touch);
                            }
                            break;
                    }
                }

                // node.on(Laya.Event.CLICK, node, touchEvent); // 没代理遮盖，不能起作用
                node.on(Laya.Event.MOUSE_DOWN, this, touchEvent);
                if (!TOUCH_CLICK.upProxy.bindEvent) {
                    upProxy.on(Laya.Event.MOUSE_UP, this, touchEvent);
                    TOUCH_CLICK.upProxy.bindEvent = true;
                }

                this._click.push({ 
                    id: (node[TOUCH_CLICK.idName] = this._click.length), 
                    originStyle: { 
                        scaleX: node.scaleX, 
                        scaleY: node.scaleY,
                        alpha: node.alpha
                    },
                    callback: callback
                });
            }

            /**
             * 加载 UP 事件代理
             */
            private __loadUpProxy(): Laya.Sprite {
                if (!TOUCH_CLICK.upProxy.owner) {
                    TOUCH_CLICK.upProxy.owner = Render.loadSprite({ 
                        name: 'HolyTouchProxyUp', 
                        zOrder: 0, 
                        width: Laya.stage.width, 
                        height: Laya.stage.height,
                        node: Laya.stage
                    });
                    (TOUCH_CLICK.upProxy.owner as Laya.Sprite).visible = false; // 默认不可见
                }

                return TOUCH_CLICK.upProxy.owner;
            }

            /**
             * 判断节点是否点击
             * @param node
             * @param opt 
             */
            private __hittest(node: Laya.Sprite, opt: TOUCH_OPTION): boolean {
                if (!opt.touch || !opt.touch.endPos) {
                    return false;
                }

                // const beginPoint: Laya.Point = node.globalToLocal(new Laya.Point(opt.touch.beginPos.x, opt.touch.beginPos.y));
                // const endPoint: Laya.Point = node.globalToLocal(new Laya.Point(opt.touch.endPos.x, opt.touch.endPos.y));
                return node.hitTestPoint(opt.touch.beginPos.x, opt.touch.beginPos.y) && node.hitTestPoint(opt.touch.endPos.x, opt.touch.endPos.y);
            }
            
        }
    }
}