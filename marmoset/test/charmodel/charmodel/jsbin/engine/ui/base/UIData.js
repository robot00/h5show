var UIData = (function () {
    function UIData() {
    }
    UIData.setDesignWH = function ($width, $height) {
        this.designWidth = $width;
        this.designHeight = $height;
        //  this.Scale = Math.min(Scene_data.stageWidth / $width, Scene_data.stageHeight / $height);
        this.resize();
    };
    UIData.resize = function () {
        this.Scale = Math.min(Scene_data.stageWidth / this.designWidth, Scene_data.stageHeight / this.designHeight);
    };
    UIData.init = function ($res, $bfun, $loadFun) {
        if ($loadFun === void 0) { $loadFun = null; }
        this._itemLoad = $res; //初始化资源内容
        this._bFun = $bfun;
        this.loadFun = $loadFun;
        this.loadBaseConfigCom();
        return $res.length;
    };
    Object.defineProperty(UIData, "mainUIAtlas", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    UIData.loadBaseConfigCom = function () {
        for (var i = 0; i < this._itemLoad.length; i++) {
            this.loadUIdata(this._itemLoad[i].xmlurl, this._itemLoad[i].picurl, this._itemLoad[i].name);
        }
    };
    UIData.loadOkNum = function ($num) {
        if (this.loadFun) {
            this.loadFun($num);
        }
    };
    UIData.loadUIdata = function ($xmlUrl, $imgUrl, $key) {
        var _this = this;
        if ($key === void 0) { $key = "default"; }
        LoadManager.getInstance().load(Scene_data.fileRoot + $xmlUrl, LoadManager.XML_TYPE, function ($data) {
            var $arr = Array(JSON.parse($data))[0];
            _this._dic[$key] = $arr;
            kim.src = Scene_data.fileRoot + $imgUrl;
        });
        var kim = new Image();
        this._imgDic[$key] = kim;
        kim.onload = function (evt) {
            _this._skipnum++;
            _this.loadOkNum(_this._skipnum);
            if (_this._skipnum >= _this._itemLoad.length) {
                UIData.textImg = _this._imgDic[UIData.textlist]; //将指定图片给
                _this._bFun();
            }
        };
    };
    UIData.getImgByKey = function ($key) {
        if (this._imgDic.containsKey($key)) {
            return this._imgDic[$key];
        }
        console.log("uiData getImgByKey=>" + $key);
        return null;
    };
    UIData.getUiByName = function ($key, $name) {
        if (this._dic.containsKey($key)) {
            var uiArr = this._dic[$key].uiArr;
            for (var i = 0; i < uiArr.length; i++) {
                if (uiArr[i].name == $name) {
                    return uiArr[i];
                }
            }
        }
        console.log("uiData getUiByName =>" + $name);
        return null;
    };
    UIData.getUiArrByKey = function ($key) {
        if (this._dic.containsKey($key)) {
            return this._dic[$key].uiArr;
        }
        return null;
    };
    //设计宽高
    UIData.designWidth = 960;
    UIData.designHeight = 540;
    UIData.font = "Helvetica"; //Georgia
    UIData._skipnum = 0;
    UIData.textlist = "textlist";
    UIData.panelList = "panelList";
    UIData.publicUi = "publicUi";
    UIData.faceItem = ["/大笑", "/脸2", "/脸3", "/脸4", "/脸5", "/脸6", "/脸7", "/脸8", "/脸9", "/脸a", "/脸b", "/脸c", "/脸d", "/脸e", "/脸f", "/脸g", "/脸h", "/脸i"];
    UIData._dic = new Dictionary([]);
    UIData._imgDic = new Dictionary([]);
    return UIData;
})();
var UiDraw = (function () {
    function UiDraw() {
    }
    UiDraw.clearUI = function ($ui) {
        var $uiRect = $ui.uiRender.uiAtlas.getRec($ui.skinName);
        var $ctx = UIManager.getInstance().getContext2D($uiRect.pixelWitdh, $uiRect.pixelHeight, false);
        $ui.uiRender.uiAtlas.updateCtx($ctx, $uiRect.pixelX, $uiRect.pixelY);
    };
    UiDraw.drawTxtLab = function ($ui, $str, $fontsize, $align, $tx, $ty) {
        if ($tx === void 0) { $tx = 0; }
        if ($ty === void 0) { $ty = 3; }
        var $rec = $ui.uiRender.uiAtlas.getRec($ui.skinName);
        var ctx = UIManager.getInstance().getContext2D($rec.pixelWitdh, $rec.pixelHeight, false);
        UiDraw.cxtDrawImg(ctx, PuiData.TXTBG, new Rectangle(0, 0, $rec.pixelWitdh, $rec.pixelHeight), UIData.publicUi);
        LabelTextFont.writeSingleLabelToCtx(ctx, $str, $fontsize, $tx, $ty, $align);
        $ui.uiRender.uiAtlas.updateCtx(ctx, $rec.pixelX, $rec.pixelY);
    };
    /**属性 - value */
    UiDraw.drawAttVal = function ($ui, $att, $val) {
        var keyStr = "";
        if (typeof ($att) == "undefined") {
            UiDraw.clearUI($ui);
            return;
        }
        keyStr = ColorType.Orange7a2f21 + getKeyProById($att) + ":  " + ColorType.Orange9a683f + Snum($val);
        LabelTextFont.writeSingleLabel($ui.uiRender.uiAtlas, $ui.skinName, keyStr, 14, TextAlign.LEFT);
    };
    /**绘制未获得属性 - value */
    UiDraw.drawAttValAdd = function ($ui, $att, $val) {
        var keyStr = "";
        if (typeof ($att) == "undefined") {
            UiDraw.clearUI($ui);
            return;
        }
        keyStr = ColorType.Orange7a2f21 + getKeyProById($att) + ":    " + ColorType.Green2ca937 + "+" + Snum($val);
        LabelTextFont.writeSingleLabel($ui.uiRender.uiAtlas, $ui.skinName, keyStr, 14, TextAlign.LEFT);
    };
    /**绘制增加属性 向上箭头 */
    UiDraw.drawAddValTop = function ($ui, $val) {
        var addStr = "";
        if ($val > 0) {
            addStr = "+" + Snum($val);
        }
        else {
            UiDraw.clearUI($ui);
        }
        var $rec = $ui.uiRender.uiAtlas.getRec($ui.skinName);
        var ctx = UIManager.getInstance().getContext2D($rec.pixelWitdh, $rec.pixelHeight, false);
        if (addStr != "") {
            UiDraw.cxtDrawImg(ctx, PuiData.ARROW_TOP, new Rectangle(0, 3, 12, 16), UIData.publicUi);
        }
        LabelTextFont.writeSingleLabelToCtx(ctx, addStr, 14, 15, 0, TextAlign.LEFT, ColorType.Green2ca937);
        $ui.uiRender.uiAtlas.updateCtx(ctx, $rec.pixelX, $rec.pixelY);
    };
    /**绘制增加属性 向右箭头 */
    UiDraw.drawAddValRight = function ($ui, $val) {
        // var addStr: string = "";
        if ($val > 0) {
            // addStr = Snum($val);
            var $rec = $ui.uiRender.uiAtlas.getRec($ui.skinName);
            var ctx = UIManager.getInstance().getContext2D($rec.pixelWitdh, $rec.pixelHeight, false);
            UiDraw.cxtDrawImg(ctx, PuiData.ARROW_RIGHT, new Rectangle(0, 3, 16, 12), UIData.publicUi);
            LabelTextFont.writeSingleLabelToCtx(ctx, Snum($val), 14, 0, 0, TextAlign.RIGHT, ColorType.Green2ca937);
            $ui.uiRender.uiAtlas.updateCtx(ctx, $rec.pixelX, $rec.pixelY);
        }
        else {
            UiDraw.clearUI($ui);
        }
    };
    UiDraw.drawCost = function ($cxt, $tx, $ty, $type) {
        var name = "";
        switch ($type) {
            case 0:
                name = PuiData.A_YUANBAO;
                break;
            case 1:
                name = PuiData.A_BANGYUAN;
                break;
            case 2:
                name = PuiData.A_YINBI;
                break;
            case 6:
                name = PuiData.A_BANGGONG;
                break;
            case 7:
                name = PuiData.A_HONOR;
                break;
            case 8:
                name = PuiData.A_DOUHUN;
                break;
        }
        UiDraw.cxtDrawImg($cxt, name, new Rectangle($tx, $ty, 25, 25), UIData.publicUi);
    };
    //将目标的图绘制到CXT对象中，
    UiDraw.cxtDrawImg = function ($cxt, $name, $rect, $key) {
        var obj = UIData.getUiByName($key, $name);
        if (obj) {
            if ($rect.width == 0 || $rect.height == 0) {
                $rect.width = obj.ow;
                $rect.height = obj.oh;
            }
            if (obj.type == 0) {
                $cxt.drawImage(UIData.getImgByKey($key), obj.ox, obj.oy, obj.ow, obj.oh, $rect.x, $rect.y, $rect.width, $rect.height);
            }
            else if (obj.type == 1) {
                $cxt.drawImage(UIData.getImgByKey($key), obj.ox, obj.oy, obj.uow, obj.uoh, $rect.x, $rect.y, obj.uow, obj.uoh);
                $cxt.drawImage(UIData.getImgByKey($key), obj.ox + obj.uow, obj.oy, obj.ow - obj.uow * 2, obj.uoh, $rect.x + obj.uow, $rect.y, $rect.width - obj.uow * 2, obj.uoh);
                $cxt.drawImage(UIData.getImgByKey($key), obj.ox + obj.ow - obj.uow, obj.oy, obj.uow, obj.uoh, $rect.x + $rect.width - obj.uow, $rect.y, obj.uow, obj.uoh);
                $cxt.drawImage(UIData.getImgByKey($key), obj.ox, obj.oy + obj.uoh, obj.uow, obj.oh - obj.uoh * 2, $rect.x, $rect.y + obj.uoh, obj.uow, $rect.height - obj.uoh * 2);
                $cxt.drawImage(UIData.getImgByKey($key), obj.ox + obj.uow, obj.oy + obj.uoh, obj.ow - obj.uow * 2, obj.oh - obj.uoh * 2, $rect.x + obj.uow, $rect.y + obj.uoh, $rect.width - obj.uow * 2, $rect.height - obj.uoh * 2);
                $cxt.drawImage(UIData.getImgByKey($key), obj.ox + obj.ow - obj.uow, obj.oy + obj.uoh, obj.uow, obj.uoh, $rect.x + $rect.width - obj.uow, $rect.y + obj.uoh, obj.uow, $rect.height - obj.uoh * 2);
                $cxt.drawImage(UIData.getImgByKey($key), obj.ox, obj.oy + obj.oh - obj.uoh, obj.uow, obj.uoh, $rect.x, $rect.y + $rect.height - obj.uoh, obj.uow, obj.uoh);
                $cxt.drawImage(UIData.getImgByKey($key), obj.ox + obj.uow, obj.oy + obj.oh - obj.uoh, obj.ow - obj.uow * 2, obj.uoh, $rect.x + obj.uow, $rect.y + $rect.height - obj.uoh, $rect.width - obj.uow * 2, obj.uoh);
                $cxt.drawImage(UIData.getImgByKey($key), obj.ox + obj.ow - obj.uow, obj.oy + obj.oh - obj.uoh, obj.uow, obj.uoh, $rect.x + $rect.width - obj.uow, $rect.y + $rect.height - obj.uoh, obj.uow, obj.uoh);
            }
            else {
                alert("UiDraw没有绘制成功  " + obj.type);
            }
        }
    };
    //将目标的图绘制到$uiAtlas纹理对象中，
    UiDraw.uiAtlasDrawImg = function ($uiAtlas, $skinName, $key, $shareName) {
        var $uiRectangle = $uiAtlas.getRec($skinName);
        $uiAtlas.ctx = UIManager.getInstance().getContext2D($uiRectangle.pixelWitdh, $uiRectangle.pixelHeight, false);
        var obj = UIData.getUiByName($key, $shareName);
        //console.log("obj", obj)
        if (obj) {
            if (obj.type == 0) {
                $uiAtlas.ctx.drawImage(UIData.getImgByKey($key), obj.ox, obj.oy, obj.ow, obj.oh, 0, 0, $uiRectangle.pixelWitdh, $uiRectangle.pixelHeight);
            }
            else if (obj.type == 1) {
                $uiAtlas.ctx.drawImage(UIData.getImgByKey($key), obj.ox, obj.oy, obj.uow, obj.uoh, 0, 0, obj.uow, obj.uoh);
                $uiAtlas.ctx.drawImage(UIData.getImgByKey($key), obj.ox + obj.uow, obj.oy, obj.ow - obj.uow * 2, obj.uoh, obj.uow, 0, $uiRectangle.pixelWitdh - obj.uow * 2, obj.uoh);
                $uiAtlas.ctx.drawImage(UIData.getImgByKey($key), obj.ox + obj.ow - obj.uow, obj.oy, obj.uow, obj.uoh, $uiRectangle.pixelWitdh - obj.uow, 0, obj.uow, obj.uoh);
                $uiAtlas.ctx.drawImage(UIData.getImgByKey($key), obj.ox, obj.oy + obj.uoh, obj.uow, obj.oh - obj.uoh * 2, 0, obj.uoh, obj.uow, $uiRectangle.pixelHeight - obj.uoh * 2);
                $uiAtlas.ctx.drawImage(UIData.getImgByKey($key), obj.ox + obj.uow, obj.oy + obj.uoh, obj.ow - obj.uow * 2, obj.oh - obj.uoh * 2, obj.uow, obj.uoh, $uiRectangle.pixelWitdh - obj.uow * 2, $uiRectangle.pixelHeight - obj.uoh * 2);
                $uiAtlas.ctx.drawImage(UIData.getImgByKey($key), obj.ox + obj.ow - obj.uow, obj.oy + obj.uoh, obj.uow, obj.uoh, $uiRectangle.pixelWitdh - obj.uow, obj.uoh, obj.uow, $uiRectangle.pixelHeight - obj.uoh * 2);
                $uiAtlas.ctx.drawImage(UIData.getImgByKey($key), obj.ox, obj.oy + obj.oh - obj.uoh, obj.uow, obj.uoh, 0, $uiRectangle.pixelHeight - obj.uoh, obj.uow, obj.uoh);
                $uiAtlas.ctx.drawImage(UIData.getImgByKey($key), obj.ox + obj.uow, obj.oy + obj.oh - obj.uoh, obj.ow - obj.uow * 2, obj.uoh, obj.uow, $uiRectangle.pixelHeight - obj.uoh, $uiRectangle.pixelWitdh - obj.uow * 2, obj.uoh);
                $uiAtlas.ctx.drawImage(UIData.getImgByKey($key), obj.ox + obj.ow - obj.uow, obj.oy + obj.oh - obj.uoh, obj.uow, obj.uoh, $uiRectangle.pixelWitdh - obj.uow, $uiRectangle.pixelHeight - obj.uoh, obj.uow, obj.uoh);
            }
            else {
                console.log("11");
            }
            TextureManager.getInstance().updateTexture($uiAtlas.texture, $uiRectangle.pixelX, $uiRectangle.pixelY, $uiAtlas.ctx);
        }
        else {
            alert("uiAtlasDrawImg错误");
        }
    };
    /**
     * 将共享资源图绘制到$uiAtlas纹理对象中
     * $touiAtlas：绘制到的uiAtlas对象
     * $fromuiAtlas: 资源来源的uiAtlas对象
     * $skinName: 绘制对象名
     * $shareName：资源名
     * $tx：偏移量x
     * $ty：偏移量y
     */
    UiDraw.SharedDrawImg = function ($touiAtlas, $fromuiAtlas, $skinName, $shareName, $tx, $ty) {
        if ($tx === void 0) { $tx = 0; }
        if ($ty === void 0) { $ty = 0; }
        var $uiRectangle = $touiAtlas.getRec($skinName);
        $touiAtlas.ctx = UIManager.getInstance().getContext2D($uiRectangle.pixelWitdh, $uiRectangle.pixelHeight, false);
        var imgUseRect = $fromuiAtlas.getRec($shareName);
        $touiAtlas.ctx.drawImage($fromuiAtlas.useImg, imgUseRect.pixelX, imgUseRect.pixelY, imgUseRect.pixelWitdh, imgUseRect.pixelHeight, $tx, $ty, $uiRectangle.pixelWitdh, $uiRectangle.pixelHeight);
        TextureManager.getInstance().updateTexture($touiAtlas.texture, $uiRectangle.pixelX, $uiRectangle.pixelY, $touiAtlas.ctx);
    };
    UiDraw.drawToUiAtlasToCtx = function ($ctx, $fromuiAtlas, $shareName, $posRect) {
        var imgUseRect = $fromuiAtlas.getRec($shareName);
        if (!$posRect) {
            $posRect = new Rectangle(0, 0, 0, 0);
        }
        if ($posRect.width > 1 && $posRect.height > 1) {
            $ctx.drawImage($fromuiAtlas.useImg, imgUseRect.pixelX, imgUseRect.pixelY, imgUseRect.pixelWitdh, imgUseRect.pixelHeight, $posRect.x, $posRect.y, $posRect.width, $posRect.height);
        }
        else {
            $ctx.drawImage($fromuiAtlas.useImg, imgUseRect.pixelX, imgUseRect.pixelY, imgUseRect.pixelWitdh, imgUseRect.pixelHeight, $posRect.x, $posRect.y, imgUseRect.pixelWitdh, imgUseRect.pixelHeight);
        }
    };
    UiDraw.RepeatLoadImg = function ($url1, $url2, $backFuc) {
        if ($backFuc === void 0) { $backFuc = null; }
        var imgA = new Image();
        imgA.onload = function () {
            LoadManager.getInstance().load($url2, LoadManager.IMG_TYPE, function ($imgB) {
                if ($backFuc) {
                    $backFuc(imgA, $imgB);
                }
            });
        };
        imgA.src = $url1;
    };
    return UiDraw;
})();
var UIuitl = (function () {
    function UIuitl() {
    }
    UIuitl.getInstance = function () {
        if (!this._instance) {
            this._instance = new UIuitl();
        }
        return this._instance;
    };
    /**
     * 绘制背景图+资源icon+资源数目
     */
    UIuitl.prototype.drawCostUI = function ($uiAtlas, $skinName, $costary, $fontcolor, $bgwidth, $bgheight) {
        if ($fontcolor === void 0) { $fontcolor = "#000000"; }
        if ($bgwidth === void 0) { $bgwidth = 0; }
        if ($bgheight === void 0) { $bgheight = 0; }
        if ($fontcolor.indexOf("[") != -1) {
            $fontcolor = "#" + $fontcolor.substr(1, 6);
        }
        var $rec = $uiAtlas.getRec($skinName);
        var ctx = UIManager.getInstance().getContext2D($rec.pixelWitdh, $rec.pixelHeight, false);
        if ($bgwidth == 0) {
            $bgwidth = $rec.pixelWitdh;
            $bgheight = $rec.pixelHeight;
        }
        UiDraw.cxtDrawImg(ctx, PuiData.CostBg, new Rectangle($rec.pixelWitdh - $bgwidth, $rec.pixelHeight - $bgheight, $bgwidth, $bgheight), UIData.publicUi);
        var posx;
        var posy;
        if (Number($costary[0]) > -1) {
            UiDraw.cxtDrawImg(ctx, this.costtype(Number($costary[0])), new Rectangle(0, 0, 25, 25), UIData.publicUi);
            posx = ($bgwidth - 25) / 2 + 25;
            if ($bgheight >= 25) {
                posy = 2;
            }
            else {
                posy = 25 - $bgheight;
            }
        }
        else {
            posx = $bgwidth / 2 + ($rec.pixelWitdh - $bgwidth);
            posy = $rec.pixelHeight - $bgheight;
        }
        LabelTextFont.writeSingleLabelToCtx(ctx, $costary[1], 16, posx, posy, TextAlign.CENTER, $fontcolor);
        $uiAtlas.updateCtx(ctx, $rec.pixelX, $rec.pixelY);
    };
    UIuitl.prototype.costtype = function ($costid) {
        switch ($costid) {
            case 1:
                //元宝
                return PuiData.A_YUANBAO;
            case 3:
                //身上的银子
                return PuiData.A_YINBI;
            case 101:
                //真气
                return PuiData.A_ZHENQI;
            case 102:
                //兽灵
                return PuiData.A_SHOULING;
            case 103:
                //宝石精华
                return PuiData.A_JINGHUA;
            case 6:
                //帮贡
                return PuiData.A_BANGGONG;
            case 7:
                //荣誉
                return PuiData.A_HONOR;
            case 8:
                //斗魂
                return PuiData.A_DOUHUN;
            case 104:
                //经验
                return PuiData.A_EXP;
            default:
                break;
        }
    };
    return UIuitl;
})();
//# sourceMappingURL=UIData.js.map