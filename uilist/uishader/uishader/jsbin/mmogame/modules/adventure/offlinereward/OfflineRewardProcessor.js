var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var offlinereward;
(function (offlinereward) {
    var OfflineRewardModule = (function (_super) {
        __extends(OfflineRewardModule, _super);
        function OfflineRewardModule() {
            _super.apply(this, arguments);
        }
        OfflineRewardModule.prototype.getModuleName = function () {
            return "OfflineRewardModule";
        };
        OfflineRewardModule.prototype.listProcessors = function () {
            return [new OfflineRewardProcessor()];
        };
        return OfflineRewardModule;
    })(Module);
    offlinereward.OfflineRewardModule = OfflineRewardModule;
    var OfflineRewardEvent = (function (_super) {
        __extends(OfflineRewardEvent, _super);
        function OfflineRewardEvent() {
            _super.apply(this, arguments);
        }
        OfflineRewardEvent.SHOW_OFFLINE_REWARD_PANEL = "SHOW_OFFLINE_REWARD_PANEL";
        OfflineRewardEvent.HIDE_OFFLINE_REWARD_PANEL = "HIDE_OFFLINE_REWARD_PANEL";
        return OfflineRewardEvent;
    })(BaseEvent);
    offlinereward.OfflineRewardEvent = OfflineRewardEvent;
    var OfflineRewardProcessor = (function (_super) {
        __extends(OfflineRewardProcessor, _super);
        function OfflineRewardProcessor() {
            _super.apply(this, arguments);
        }
        OfflineRewardProcessor.prototype.getName = function () {
            return "OfflineRewardProcessor";
        };
        OfflineRewardProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof OfflineRewardEvent) {
                var evt = $event;
                if (evt.type == OfflineRewardEvent.SHOW_OFFLINE_REWARD_PANEL) {
                    this.showPanel(evt.data);
                }
                if (this.offlineRewardPanel) {
                    if (evt.type == OfflineRewardEvent.HIDE_OFFLINE_REWARD_PANEL) {
                        this.hidePanel();
                    }
                }
            }
        };
        OfflineRewardProcessor.prototype.hidePanel = function () {
            if (this.offlineRewardPanel) {
                UIManager.getInstance().removeUIContainer(this.offlineRewardPanel);
            }
        };
        OfflineRewardProcessor.prototype.showPanel = function ($data) {
            var _this = this;
            if (!this.offlineRewardPanel) {
                this.offlineRewardPanel = new offlinereward.OfflineRewardPanel();
            }
            this.offlineRewardPanel.load(function () {
                UIManager.getInstance().addUIContainer(_this.offlineRewardPanel);
                _this.offlineRewardPanel.refresh($data);
            }, false);
        };
        OfflineRewardProcessor.prototype.listenModuleEvents = function () {
            return [
                new OfflineRewardEvent(OfflineRewardEvent.SHOW_OFFLINE_REWARD_PANEL),
                new OfflineRewardEvent(OfflineRewardEvent.HIDE_OFFLINE_REWARD_PANEL),
            ];
        };
        return OfflineRewardProcessor;
    })(BaseProcessor);
    offlinereward.OfflineRewardProcessor = OfflineRewardProcessor;
})(offlinereward || (offlinereward = {}));
//# sourceMappingURL=OfflineRewardProcessor.js.map