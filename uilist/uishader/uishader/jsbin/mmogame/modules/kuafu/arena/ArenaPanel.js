var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var kuafu;
(function (kuafu) {
    var ArenaPanel = (function (_super) {
        __extends(ArenaPanel, _super);
        function ArenaPanel() {
            _super.call(this);
            this._selIdx = SharedDef.MODULE_ARENA_DOUJIANTAI;
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.center = 0;
            this.middle = 0;
            this._baseRender = new UIRenderComponent();
            this.addRender(this._baseRender);
            this._topRender = new UIRenderComponent();
            this.addRender(this._topRender);
            this._baseUiAtlas = new UIAtlas();
            this._arenaQualifying = new kuafu.ArenaQualifying();
            this._arenaDjPanel = new kuafu.ArenaDjPanel();
            //this._tripPanel = new FactionTripPanel();
        }
        ArenaPanel.prototype.dispose = function () {
            this._baseRender.dispose();
            this._baseRender = null;
            this._topRender.dispose();
            this._topRender = null;
            _super.prototype.dispose.call(this);
        };
        ArenaPanel.prototype.butClik = function (evt) {
            if (evt.target == this.w_close) {
                this.hide();
            }
            else if (evt.target == this.tab1dis) {
                msgtip.MsgTipManager.outStr(ColorType.colorce0a00 + "人物等级达到" + this.tab1dis.data.level + "级后解锁", 99);
            }
        };
        ArenaPanel.prototype.applyLoad = function () {
            var _this = this;
            this._baseUiAtlas.setInfo("ui/uidata/kuafu/arena/arena.xml", "ui/uidata/kuafu/arena/arena.png", function () { _this.loadConfigCom(); });
        };
        ArenaPanel.prototype.loadConfigCom = function () {
            this._baseRender.uiAtlas = this._baseUiAtlas;
            this._topRender.uiAtlas = this._baseUiAtlas;
            this.winmidRender.uiAtlas = this._baseUiAtlas;
            this.initUI();
            this._arenaDjPanel.setUIAtlas(this._baseUiAtlas, this.winmidRender);
            this._arenaQualifying.setUIAtlas(this._baseUiAtlas, this.winmidRender);
            // this.setIdx(0);
            console.log("---初始化结束");
            this.resize();
            this.applyLoadComplete();
        };
        ArenaPanel.prototype.djData = function ($ary) {
            console.log("---斗剑台排行---", $ary);
            if (this._arenaDjPanel && this._arenaDjPanel) {
                this._arenaDjPanel.setListData($ary);
            }
        };
        ArenaPanel.prototype.qualifyDataChg = function () {
            if (this._arenaQualifying && this._arenaQualifying.hasStage) {
                this._arenaQualifying.dataChg();
            }
        };
        ArenaPanel.prototype.qualifyRankChg = function ($rank) {
            if (this._arenaQualifying && this._arenaQualifying.hasStage) {
                this._arenaQualifying.drawRank($rank);
            }
        };
        ArenaPanel.prototype.djRewardChg = function () {
            if (this._arenaDjPanel && this._arenaDjPanel.hasStage) {
                this._arenaDjPanel.djRewardChg();
            }
        };
        ArenaPanel.prototype.initUI = function () {
            this.addUIList(["t_win_bian"], this.winmidRender);
            this.addUIList(["t_win_line"], this._topRender);
            this.addChild(this._baseRender.getComponent("t_win_title"));
            this.aryTab = new Array;
            for (var i = 0; i < 2; i++) {
                var a = this.addEvntBut("t_tab" + i, this._baseRender);
                a.data = SharedDef.MODULE_ARENA_DOUJIANTAI + i * 3;
                a.addEventListener(InteractiveEvent.Up, this.tabClick, this);
                this.aryTab.push(a);
            }
            // this.tab0 = <SelectButton>this._baseRender.getComponent("t_tab0");
            // this.addChild(this.tab0);
            // this.tab0.addEventListener(InteractiveEvent.Down, this.tabClick, this);
            // this.tab1 = <SelectButton>this._baseRender.getComponent("t_tab1");
            // //this.addChild(this.tab1);
            // this.tab1.addEventListener(InteractiveEvent.Down, this.tabClick, this);
            this.tab1dis = this._baseRender.getComponent("t_tab1_dis");
            this.tab1dis.addEventListener(InteractiveEvent.Up, this.butClik, this);
            // this.showTab1();
        };
        ArenaPanel.prototype.showTab1 = function () {
            if (this.tab1dis.parent) {
                this.refreshOpenLev(this.aryTab[1]);
            }
        };
        ArenaPanel.prototype.refreshOpenLev = function ($tab) {
            var $page = $tab.data;
            if ($page == SharedDef.MODULE_ARENA_DOUJIANTAI) {
                this.setUiListVisibleByItem([$tab], true);
                return;
            }
            if (GuidData.player.getsyspageopen(SharedDef.MODULE_ARENA, $page)) {
                this.setUiListVisibleByItem([$tab], true);
                this.setUiListVisibleByItem([this.tab1dis], false);
            }
            else {
                var $tb_system_base = tb.TB_system_base.getTempVo(Number(SharedDef.MODULE_ARENA * 10 + $page));
                this.setUiListVisibleByItem([$tab], false);
                this.setUiListVisibleByItem([this.tab1dis], true);
                this.tab1dis.data = $tb_system_base;
                this.tab1dis.y = $tab.y;
            }
        };
        ArenaPanel.prototype.tabClick = function ($e) {
            this.setIdx($e.target.data);
        };
        ArenaPanel.prototype.setIdx = function ($idx) {
            if ($idx == SharedDef.MODULE_ARENA_DOUJIANTAI) {
                this.aryTab[0].selected = true;
                this.aryTab[1].selected = false;
                this._arenaDjPanel.show();
                this._arenaQualifying.hide();
            }
            else if ($idx == SharedDef.MODULE_ARENA_RANK) {
                this.aryTab[0].selected = false;
                this.aryTab[1].selected = true;
                this._arenaDjPanel.hide();
                this._arenaQualifying.show();
            }
            this._selIdx = $idx;
        };
        ArenaPanel.prototype.getTabidx = function ($aryTab, $curTab) {
            return $aryTab.indexOf($curTab);
        };
        ArenaPanel.prototype.show = function ($tabary, $seltab) {
            UIManager.getInstance().addUIContainer(this);
            ModulePageManager.showResTittle([1, 2, 3]);
            for (var i = 0; i < this.aryTab.length; i++) {
                var $idx = this.getTabidx($tabary, Number(this.aryTab[i].data));
                if ($idx != -1) {
                    this.aryTab[i].y = $idx * 95 + 95;
                    this.refreshOpenLev(this.aryTab[i]);
                }
                else {
                    this.setUiListVisibleByItem([this.aryTab[i], this.tab1dis], false);
                }
            }
            if (this._baseRender.uiAtlas) {
                this.setIdx($seltab);
            }
        };
        ArenaPanel.prototype.hide = function () {
            UIManager.getInstance().removeUIContainer(this);
            if (this._selIdx == SharedDef.MODULE_ARENA_DOUJIANTAI) {
                this._arenaDjPanel.hide();
            }
            else if (this._selIdx == SharedDef.MODULE_ARENA_RANK) {
                this._arenaQualifying.hide();
            }
            SceneManager.getInstance().render = true;
            ModuleEventManager.dispatchEvent(new mainUi.MainUiEvent(mainUi.MainUiEvent.SHOW_MAINUI_EVENT));
            _super.prototype.hide.call(this);
        };
        ArenaPanel.prototype.leadDataChg = function () {
        };
        ArenaPanel.prototype.tripDataChg = function () {
        };
        ArenaPanel.prototype.djChg = function () {
            if (this._arenaDjPanel && this._arenaDjPanel.hasStage) {
                this._arenaDjPanel.dataChg();
            }
        };
        return ArenaPanel;
    })(WindowUi);
    kuafu.ArenaPanel = ArenaPanel;
})(kuafu || (kuafu = {}));
//# sourceMappingURL=ArenaPanel.js.map