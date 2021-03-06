var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutNrmTextureModelShader = (function (_super) {
    __extends(OutNrmTextureModelShader, _super);
    function OutNrmTextureModelShader() {
        _super.call(this);
    }
    OutNrmTextureModelShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "u2Texture");
    };
    OutNrmTextureModelShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec3 nrm3Position;" +
            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform mat3 rotationMatrix3D;" +
            "varying vec3 v_texCoord;" +
            "void main(void)" +
            "{" +
            "   v_texCoord = rotationMatrix3D*nrm3Position;" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = camMatrix3D * vt0;" +
            "   vt0 = viewMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "}";
        return $str;
    };
    OutNrmTextureModelShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "varying vec3 v_texCoord;\n" +
            "void main(void)\n" +
            "{\n" +
            "gl_FragColor =vec4(v_texCoord,1.0);\n" +
            "}";
        return $str;
    };
    OutNrmTextureModelShader.OutNrmTextureModelShader = "OutNrmTextureModelShader";
    return OutNrmTextureModelShader;
})(Shader3D);
var OutNrmTextureModel = (function () {
    function OutNrmTextureModel() {
        this.rotationNum = 0;
    }
    OutNrmTextureModel.getInstance = function () {
        if (!this._instance) {
            this._instance = new OutNrmTextureModel();
        }
        return this._instance;
    };
    OutNrmTextureModel.prototype.getFBO = function () {
        this.renderContext = Scene_data.context3D.renderContext;
        var gl = Scene_data.context3D.renderContext;
        var fbo = new FBO();
        fbo.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, FBO.fw, FBO.fh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        fbo.frameBuffer = gl.createFramebuffer();
        fbo.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, FBO.fw, FBO.fh);
        return fbo;
    };
    OutNrmTextureModel.prototype.updateDepthTexture = function (fbo) {
        var gl = Scene_data.context3D.renderContext;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fbo.depthBuffer);
    };
    OutNrmTextureModel.prototype.renderNrm = function () {
        if (!this.fbo) {
            this.fbo = this.getFBO(); //512*512
        }
        this.updateDepthTexture(this.fbo);
        this.renderContext.viewport(0, 0, FBO.fw, FBO.fh);
        this.renderContext.clearColor(0, 0, 0, 1);
        this.renderContext.clearDepth(1.0);
        this.renderContext.enable(this.renderContext.DEPTH_TEST);
        this.renderContext.depthMask(true);
        Scene_data.context3D.setWriteDepth(true);
        Scene_data.context3D.setDepthTest(true);
        this.renderContext.frontFace(this.renderContext.CW);
        this.renderContext.clear(this.renderContext.COLOR_BUFFER_BIT | this.renderContext.DEPTH_BUFFER_BIT);
        for (var j = 0; j < SceneManager.getInstance().displayList.length; j++) {
            var $display3d = SceneManager.getInstance().displayList[j];
            if ($display3d.sceneVisible) {
                if ($display3d instanceof OutLineSprite) {
                    var $oso = $display3d;
                    this.updateDic($oso);
                }
            }
        }
        var gl = Scene_data.context3D.renderContext;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        Engine.resetSize();
    };
    OutNrmTextureModel.prototype.updateDic = function ($display) {
        if ($display.objData && $display.objData.indexBuffer) {
            var tf = Scene_data.context3D.pushVa($display.objData.vertexBuffer);
            ProgrmaManager.getInstance().registe(OutNrmTextureModelShader.OutNrmTextureModelShader, new OutNrmTextureModelShader);
            var $shader = ProgrmaManager.getInstance().getProgram(OutNrmTextureModelShader.OutNrmTextureModelShader);
            Scene_data.context3D.setProgram($shader.program);
            Scene_data.context3D.setVcMatrix4fv($shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv($shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv($shader, "posMatrix3D", $display.posMatrix.m);
            if (!this.rotationData) {
                this.rotationData = new Float32Array(9);
            }
            var $rotationM = Scene_data.cam3D.cameraMatrix.clone();
            $rotationM.appendRotation(180, Vector3D.Y_AXIS);
            $rotationM.prepend($display.posMatrix);
            $rotationM.getRotaion(this.rotationData);
            Scene_data.context3D.setVcMatrix3fv($shader, "rotationMatrix3D", this.rotationData);
            Scene_data.context3D.setVaOffset(0, 3, $display.objData.stride, 0);
            Scene_data.context3D.setVaOffset(1, 3, $display.objData.stride, $display.objData.normalsOffsets);
            Scene_data.context3D.drawCall($display.objData.indexBuffer, $display.objData.treNum);
        }
    };
    return OutNrmTextureModel;
})();
//# sourceMappingURL=OutNrmTextureModel.js.map