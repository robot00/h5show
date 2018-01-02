var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MountChar = (function (_super) {
    __extends(MountChar, _super);
    function MountChar() {
        _super.apply(this, arguments);
    }
    MountChar.prototype.setData = function ($rank, $iid) {
        if ($iid > 0) {
            var obj = TableData.getInstance().getData(TableData.tb_mount_illusion, $iid);
            var avatar = obj.mountID;
            this.setAvatar(avatar);
            return;
        }
        if ($rank > 0) {
            var obj = TableData.getInstance().getData(TableData.tb_mount_base, $rank);
            var avatar = obj.mountID;
            this.setAvatar(avatar);
        }
    };
    return MountChar;
})(SceneBaseChar);
//# sourceMappingURL=MountChar.js.map