namespace Holy {
    export namespace UI {

        /**
         * 销毁工具类
         */
        export class Destroy {
            private readonly _TAG: string = 'Destroy';
            private static _instance: Destroy;
            private constructor() {}
            /**
             * 获取实例
             */
            public static getInstance(): Destroy {
                if (!this._instance) {
                    this._instance = new Destroy();
                }
                return this._instance;
            }

            /**
             * 销毁统一入口
             * @param node 
             */
            public execute(node: Laya.Node): void {
                if (!node || node.destroyed) {
                    return;
                }

                if (node instanceof Laya.Skeleton) {
                    return this.__skeleton(node);
                }

                node.offAll();
                node.hasOwnProperty('visible') && (node['visible'] = false);
                node.destroy(true);
            }
            
            /**
             * 销毁动画
             * @param node 
             */
            private __skeleton(node: Laya.Skeleton): void {
                node.offAll(); // 停止所有监听
                node.stop();
                node.visible = false;
                node.destroy(true);
            }

        }

    }
}