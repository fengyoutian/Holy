
namespace Holy {
    export namespace Util {

        /**
         * 字符串工具
         */
        export class StringUtil {
            private constructor() { }

            /**
             * 获取字符串长度
             * @param str 
             */
            static getLength(str: string): number {
                let realLength: number = 0;
                let charCode: number = -1;
                for (let i = 0; i < str.length; i++) {
                    charCode = str.charCodeAt(i);
                    realLength += (charCode >= 0 && charCode <= 128) ? 1 : 2;
                }
                return realLength;
            }

            /**
             * 根据字号截取替换字符串
             * @param str 
             * @param fontSize 字号大小
             * @param containerWidth 容器宽度 
             * @param endChar 结尾字符
             */
            static substrBySize(str: string, fontSize: number, containerWidth: number, endChar: string = '...'): string {
                if (Holy.Common.Helper.getInstance().isEmpty(str)) {
                    return str;
                }

                const realLength: number = this.getLength(str);
                if (realLength * (fontSize / 2) > containerWidth) {
                    str = str.substring(0, Math.floor(containerWidth / fontSize) - 1) + endChar; // 实际切割字符串时用真实宽度切割
                }

                return str;
            }

        }

    }
}