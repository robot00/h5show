var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dialog;
(function (dialog) {
    var DialogueModule = (function (_super) {
        __extends(DialogueModule, _super);
        function DialogueModule() {
            _super.apply(this, arguments);
        }
        DialogueModule.prototype.getModuleName = function () {
            return "DialogueModule";
        };
        DialogueModule.prototype.listProcessors = function () {
            return [new DialogueProcessor()];
        };
        return DialogueModule;
    })(Module);
    dialog.DialogueModule = DialogueModule;
    var DialogueEvent = (function (_super) {
        __extends(DialogueEvent, _super);
        function DialogueEvent() {
            _super.apply(this, arguments);
        }
        DialogueEvent.SHOW_DIALOGUE_PANEL = "SHOW_DIALOGUE_PANEL";
        DialogueEvent.HIDE_DIALOGUE_PANEL = "HIDE_DIALOGUE_PANEL";
        return DialogueEvent;
    })(BaseEvent);
    dialog.DialogueEvent = DialogueEvent;
    var DialogueProcessor = (function (_super) {
        __extends(DialogueProcessor, _super);
        function DialogueProcessor() {
            _super.apply(this, arguments);
        }
        DialogueProcessor.prototype.getName = function () {
            return "DialogueProcessor";
        };
        DialogueProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof DialogueEvent) {
                var evt = $event;
                if (evt.type == DialogueEvent.SHOW_DIALOGUE_PANEL) {
                    if (SceneManager.getInstance().render == true) {
                        this.showDialoguePanel(evt.entryId);
                    }
                }
                if (evt.type == DialogueEvent.HIDE_DIALOGUE_PANEL) {
                    if (this._dialoguePanel) {
                        if (this._dialoguePanel.hasStage) {
                            UIManager.getInstance().removeUIContainer(this._dialoguePanel);
                            ModuleEventManager.dispatchEvent(new mainUi.MainUiEvent(mainUi.MainUiEvent.SHOW_MAINUI_EVENT));
                        }
                    }
                }
            }
            if ($event instanceof UIPanelEvent) {
                var panelEvent = $event;
                if (panelEvent.panel == this._dialoguePanel) {
                    this._dialoguePanel.dispose();
                    this._dialoguePanel = null;
                    console.log("释放面板 _dialoguePanel");
                }
            }
        };
        DialogueProcessor.prototype.showDialoguePanel = function ($id) {
            var _this = this;
            if (GuidData.map.isBaseMap()) {
                var $taskItem = quest.QuestModel.getInstance().getQuestDialogueVo($id);
                if ($taskItem.length == 0) {
                    var $entryVo = tb.TB_creature_template.get_TB_creature_template($id);
                    if (this.npcFun($entryVo.dialogue_id)) {
                        return;
                    }
                }
                if (!this._dialoguePanel) {
                    this._dialoguePanel = new dialog.DialoguePanel();
                }
                this._dialoguePanel.show($id);
                this._dialoguePanel.load(function () {
                    ModuleEventManager.dispatchEvent(new mainUi.MainUiEvent(mainUi.MainUiEvent.HIDE_MAINUI_EVENT));
                    UIManager.getInstance().addUIContainer(_this._dialoguePanel);
                    _this._dialoguePanel.setCamViewMatrx3d();
                });
            }
        };
        DialogueProcessor.prototype.npcFun = function ($dialogueId) {
            var sdv = tb.TB_creature_dialogue.get_TB_creature_dialogue($dialogueId);
            if (sdv.type > 0) {
                if (sdv.type == 1) {
                    ModulePageManager.openNpcPanel(sdv.typedata[0][0], sdv.typedata[1]);
                }
                return true;
            }
            return false;
        };
        DialogueProcessor.prototype.listenModuleEvents = function () {
            return [
                new DialogueEvent(DialogueEvent.SHOW_DIALOGUE_PANEL),
                new DialogueEvent(DialogueEvent.HIDE_DIALOGUE_PANEL),
                new UIPanelEvent(UIPanelEvent.DISPOSE_PANEL_EVENT),
            ];
        };
        return DialogueProcessor;
    })(BaseProcessor);
    dialog.DialogueProcessor = DialogueProcessor;
})(dialog || (dialog = {}));
//# sourceMappingURL=DialogueProcessor.js.map