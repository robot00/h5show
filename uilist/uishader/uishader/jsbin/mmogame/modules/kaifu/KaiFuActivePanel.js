var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var kaifu;
(function (kaifu) {
    var KaiFuActivePanel = (function (_super) {
        __extends(KaiFuActivePanel, _super);
        function KaiFuActivePanel() {
            _super.call(this);
            this.uiAtlasComplet = false;
            this.tabNameAry = ["开服寻宝", "七日目标", "每日礼包", "开服礼包"];
            this._currentIdx = -1;
            this.panelDic = [];
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.middle = 0;
            this.center = 0;
            this._bgRender = new UIRenderComponent;
            this.addRender(this._bgRender);
            this._baseRender = new UIRenderComponent;
            this.addRender(this._baseRender);
        }
        KaiFuActivePanel.prototype.applyLoad = function () {
            var _this = this;
            this._baseUiAtlas = new UIAtlas();
            this._baseUiAtlas.setInfo("ui/uidata/kaifu/kaifuactive.xml", "ui/uidata/kaifu/kaifuactive.png", function () { _this.loadConfigCom(); }, "ui/uidata/kaifu/kaifuactiveuse.png");
        };
        KaiFuActivePanel.prototype.loadConfigCom = function () {
            this._baseRender.uiAtlas = this._baseUiAtlas;
            this._bgRender.uiAtlas = this._baseUiAtlas;
            this.winmidRender.uiAtlas = this._baseUiAtlas;
            this.addChild(this.winmidRender.getComponent("t_list_bg"));
            this.addChild(this._bgRender.getComponent("t_win_title"));
            var ui;
            //this.initTabList();
            this.uiAtlasComplet = true;
            this.applyLoadComplete();
        };
        KaiFuActivePanel.prototype.initTabList = function () {
            if (this._btnAry) {
                return;
            }
            this._btnAry = new Array;
            var yOff = 55;
            for (var i = 0; i < this._activeAry.length; i++) {
                var data = TableData.getInstance().getData(TableData.tb_activity_time, this._activeAry[i]);
                var btn = this.addChild(this._bgRender.getComponent("t_list_btn_bg"));
                btn.data = i;
                btn.y = btn.baseRec.y + i * yOff;
                this._btnAry.push(btn);
                btn.addEventListener(InteractiveEvent.Down, this.tabclick, this);
                var lab = this.addChild(this._baseRender.getComponent("t_list_lab"));
                lab.y = lab.baseRec.y + i * yOff;
                lab.goToAndStop(i);
                this.drawTabName(lab, i, data.name);
            }
            //this.setIdx(0)
        };
        KaiFuActivePanel.prototype.tabclick = function ($e) {
            this.setIdx($e.target.data);
        };
        KaiFuActivePanel.prototype.setIdx = function ($id) {
            for (var i = 0; i < this._btnAry.length; i++) {
                if (this._btnAry[i].data == $id) {
                    this._btnAry[i].selected = true;
                }
                else {
                    this._btnAry[i].selected = false;
                }
            }
            if (this._currentIdx != $id) {
                if (!this.panelDic[$id]) {
                    this.panelDic[$id] = this.getPanel($id);
                }
                this.panelDic[$id].show();
                if (this.panelDic[this._currentIdx]) {
                    this.panelDic[this._currentIdx].hide();
                }
            }
            this._currentIdx = $id;
        };
        KaiFuActivePanel.prototype.getPanel = function ($id) {
            var data = TableData.getInstance().getData(TableData.tb_activity_time, this._activeAry[$id]);
            var type = data.scriptIndx;
            if (type == 2) {
                var panel = new kaifu.KaifuChoujiangPanel();
                panel.setActiveID(data.id);
                panel.setUIAtlas(this._baseUiAtlas, this.winmidRender);
                return panel;
            }
            else if (type == 3) {
                var panel1 = new kaifu.KaifuDayTargetPanel();
                panel1.setActiveID(data.id);
                panel1.setUIAtlas(this._baseUiAtlas, this.winmidRender);
                return panel1;
            }
            else if (type == 4) {
                var panel2 = new kaifu.KaifuRewardPanel();
                panel2.setActiveID(data.id);
                panel2.setUIAtlas(this._baseUiAtlas, this.winmidRender);
                return panel2;
            }
            else if (type == 1) {
                var panel3 = new kaifu.KaifuVIPRewardPanel();
                panel3.setActiveID(data.id);
                panel3.setUIAtlas(this._baseUiAtlas, this.winmidRender);
                return panel3;
            }
        };
        KaiFuActivePanel.prototype.drawTabName = function (lab, $id, $name) {
            var $ctx = UIManager.getInstance().getContext2D(lab.baseRec.width, lab.baseRec.height, false);
            LabelTextFont.writeSingleLabelToCtx($ctx, $name, 16, 0, 0, TextAlign.CENTER, ColorType.Brown7a2f21);
            var $uiRect = this._baseUiAtlas.getRec(lab.skinName);
            this._baseUiAtlas.updateCtx($ctx, $uiRect.pixelX, $uiRect.pixelY + lab.baseRec.height * $id);
        };
        KaiFuActivePanel.prototype.butClik = function (evt) {
            if (evt.target == this.w_close) {
                this.hide();
            }
        };
        KaiFuActivePanel.prototype.hide = function () {
            UIManager.getInstance().removeUIContainer(this);
            this.panelDic[this._currentIdx].hide();
            this._currentIdx = -1;
            _super.prototype.hide.call(this);
        };
        KaiFuActivePanel.prototype.show = function ($activeAry) {
            this._activeAry = $activeAry;
            UIManager.getInstance().addUIContainer(this);
            ModulePageManager.showResTittle([1, 2, 3]);
            this.initTabList();
            this.setIdx(0);
        };
        KaiFuActivePanel.prototype.getRankActiveID = function () {
            for (var i = 0; i < this._activeAry.length; i++) {
                var tabObj = TableData.getInstance().getData(TableData.tb_activity_time, this._activeAry[i]);
                if (tabObj.scriptIndx == 3) {
                    return this._activeAry[i];
                }
            }
            return 0;
        };
        KaiFuActivePanel.prototype.getChouJiangActiveID = function () {
            return 2;
        };
        KaiFuActivePanel.prototype.choujiangChg = function () {
            if (this._currentIdx == 0) {
                this.panelDic[0].drawReward();
            }
        };
        KaiFuActivePanel.prototype.playerDataChg = function () {
            if (this._currentIdx == 1) {
                this.panelDic[1].drawReward();
            }
            else if (this._currentIdx == 2) {
                this.panelDic[2].refresh();
            }
            else if (this._currentIdx == 3) {
                this.panelDic[3].draw();
            }
        };
        KaiFuActivePanel.prototype.dayTargetList = function (saosrl) {
            if (this._currentIdx == 1) {
                this.panelDic[1].setListData(saosrl);
            }
        };
        return KaiFuActivePanel;
    })(WindowUi);
    kaifu.KaiFuActivePanel = KaiFuActivePanel;
})(kaifu || (kaifu = {}));
//# sourceMappingURL=KaiFuActivePanel.js.map