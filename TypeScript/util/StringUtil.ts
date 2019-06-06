
namespace Holy {
    export namespace Util {

        /**
         * 字符串工具
         */
        export class StringUtil {
            private constructor() { }

            /**
             * 全文替换
             * <p>
             *  在 orgStr 中搜做到 searchValue 并全部替换成 replaceValue
             * </p>
             * @param orgStr 源字符串
             * @param searchValue 要替换掉的字符串
             * @param replaceValue 需要替换成的字符串
             */
            static replaceAll(orgStr: string, searchValue: string, replaceValue: string): string {
                const reg: RegExp = new RegExp(searchValue, 'g');
                return orgStr.replace(reg, replaceValue);
            }

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

            /**
             * 在字符串之间插入分隔符
             * <example>
             *  ('example', ' ', 1) => 'e x a m p l e';
             *  ('example', '_', 2) => 'ex_am_pl_e';
             *  ('example', '-', 7) => 'example';
             * </example>
             * @param orgStr 原字符串
             * @param separator 分隔符
             * @param splitLen 字符分割长度
             */
            static insertSplitter(orgStr: string, separator: string = ' ', splitLen: number = 1): string {
                const length: number = orgStr.length;
                let newStr: string = '';

                if (length == 1 || length <= splitLen) return orgStr; // 只有一个字符 或 小于分割数 直接返回原字符串

                for (let i: number = 0; i < length; i += splitLen) {
                    if (i < length) {
                        // ('example', ' ', 3) => 'exa ';
                        newStr = newStr.concat(orgStr.substr(i, splitLen));
                    }
                    // 剩余的字符串长度大于分割量
                    if (length - i - 1 >= splitLen) {
                        newStr = newStr.concat(separator);
                    }
                }

                return newStr;
            }

        }

    }
}