/**
 * 利用 onShow 和 onHide 组合来判断是否进入分享界面
 * @author holy
 */
class ShareTools {
    private static _instance: ShareTools;

    private startTime: number;
    private timeSpan: number;
    private callback: (success: boolean) => void;

    constructor() {
        this.startTime = -1;
        this.timeSpan = 3000;
        wx.onShow((res: any) => {
            if (this.callback && -1 !== this.startTime) {
                const time = new Date().getTime() - this.startTime;
                if (time > this.timeSpan) {
                    this.callback && this.callback(true);
                } else {
                    this.callback && this.callback(false);
                }
                this.callback = null;
                this.startTime = -1;
            }
        });
        wx.onHide(() => {
            if (this.callback) {
                this.startTime = new Date().getTime();
            }
        });
    }

    static get instance(): ShareTools {
        return ShareTools._instance || (ShareTools._instance = new ShareTools());
    }

    share(req: {
        title?: string,
        imageUrl?: string,
        query?: string,
        success: (success: boolean) => void, 
        fail: () => void,
    }): void {
        this.callback = req.success;
        wx.shareAppMessage(req);

        setTimeout(() => {
            if (this.callback && -1 == this.startTime) {
                this.callback = null;
                this.startTime = -1;
            }
        }, this.timeSpan);
    }
    
}
export default ShareTools;
