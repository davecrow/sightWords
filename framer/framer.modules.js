require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"DevicePixelRatio":[function(require,module,exports){
exports.DevicePixelRatio = (function() {
  var VALUE, dpr, log;

  function DevicePixelRatio() {}

  log = function(v) {
    console.log("DevicePixelRatio set as:", v);
    return v;
  };

  dpr = function() {
    var devicePixelRatio, device_2x, device_3p5x, device_3x, i, initialValue, j, k, len, len1, len2, ref, ref1, ref2, value;
    initialValue = 1;
    value = initialValue;
    if (Utils.isFramerStudio() || Utils.isDesktop()) {
      ref = ['apple-', 'google-nexus-', 'iphone-6-', 'iphone-5', 'ipad-air', 'nexus-9', 'applewatch'];
      for (i = 0, len = ref.length; i < len; i++) {
        device_2x = ref[i];
        if (_.startsWith(Framer.Device.deviceType, device_2x)) {
          value = 2;
        }
      }
      ref1 = ['apple-iphone-6s-plus', 'google-nexus-5', 'htc-one-', 'microsoft-lumia-', 'samsung-galaxy-note-', 'iphone-6plus', 'nexus-5'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        device_3x = ref1[j];
        if (_.startsWith(Framer.Device.deviceType, device_3x)) {
          value = 3;
        }
      }
      ref2 = ['google-nexus-6'];
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        device_3p5x = ref2[k];
        if (_.startsWith(Framer.Device.deviceType, device_3p5x)) {
          value = 3.5;
        }
      }
    }
    if (value !== initialValue) {
      return log(value);
    }
    if (!Utils.isDesktop()) {
      devicePixelRatio = Utils.devicePixelRatio();
      if (devicePixelRatio > initialValue) {
        value = devicePixelRatio;
      }
    }
    return log(value);
  };

  VALUE = dpr();

  DevicePixelRatio.calc = function(v) {
    return v * VALUE;
  };

  DevicePixelRatio.value = VALUE;

  return DevicePixelRatio;

})();

exports.dpr = exports.DevicePixelRatio.calc;


},{}],"FontFace":[function(require,module,exports){
exports.FontFace = (function() {
  var TEST, addFontFace, loadTestingFileError, missingArgumentError, removeTestLayer, testNewFace;

  TEST = {
    face: "monospace",
    text: "foo",
    time: .01,
    maxLoadAttempts: 50,
    hideErrorMessages: true
  };

  TEST.style = {
    width: "auto",
    fontSize: "150px",
    fontFamily: TEST.face
  };

  TEST.layer = new Layer({
    name: "FontFace Tester",
    width: 0,
    height: 1,
    maxX: -Screen.width,
    visible: false,
    html: TEST.text,
    style: TEST.style
  });

  function FontFace(options) {
    this.name = this.file = this.testLayer = this.isLoaded = this.loadFailed = this.loadAttempts = this.originalSize = this.hideErrors = null;
    if (options != null) {
      this.name = options.name || null;
      this.file = options.file || null;
    }
    if (!((this.name != null) && (this.file != null))) {
      return missingArgumentError();
    }
    this.testLayer = TEST.layer.copy();
    this.testLayer.style = TEST.style;
    this.testLayer.maxX = -Screen.width;
    this.testLayer.visible = true;
    this.isLoaded = false;
    this.loadFailed = false;
    this.loadAttempts = 0;
    this.hideErrors = options.hideErrors;
    return addFontFace(this.name, this.file, this);
  }

  addFontFace = function(name, file, object) {
    var faceCSS, styleTag;
    styleTag = document.createElement('style');
    faceCSS = document.createTextNode("@font-face { font-family: '" + name + "'; src: url('" + file + "') format('truetype'); }");
    styleTag.appendChild(faceCSS);
    document.head.appendChild(styleTag);
    return testNewFace(name, object);
  };

  removeTestLayer = function(object) {
    object.testLayer.destroy();
    return object.testLayer = null;
  };

  testNewFace = function(name, object) {
    var initialWidth, widthUpdate;
    initialWidth = object.testLayer._element.getBoundingClientRect().width;
    if (initialWidth === 0) {
      if (object.hideErrors === false || TEST.hideErrorMessages === false) {
        print("Load testing failed. Attempting again.");
      }
      return Utils.delay(TEST.time, function() {
        return testNewFace(name, object);
      });
    }
    object.loadAttempts++;
    if (object.originalSize === null) {
      object.originalSize = initialWidth;
      object.testLayer.style = {
        fontFamily: name + ", " + TEST.face
      };
    }
    widthUpdate = object.testLayer._element.getBoundingClientRect().width;
    if (object.originalSize === widthUpdate) {
      if (object.loadAttempts < TEST.maxLoadAttempts) {
        return Utils.delay(TEST.time, function() {
          return testNewFace(name, object);
        });
      }
      if (!object.hideErrors) {
        print("⚠️ Failed loading FontFace: " + name);
      }
      object.isLoaded = false;
      object.loadFailed = true;
      if (!object.hideErrors) {
        loadTestingFileError(object);
      }
      return;
    } else {
      if (!(object.hideErrors === false || TEST.hideErrorMessages)) {
        print("LOADED: " + name);
      }
      object.isLoaded = true;
      object.loadFailed = false;
    }
    removeTestLayer(object);
    return name;
  };

  missingArgumentError = function() {
    error(null);
    return console.error("Error: You must pass name & file properites when creating a new FontFace. \n\nExample: myFace = new FontFace name:\"Gotham\", file:\"gotham.ttf\" \n");
  };

  loadTestingFileError = function(object) {
    error(null);
    return console.error("Error: Couldn't detect the font: \"" + object.name + "\" and file: \"" + object.file + "\" was loaded.  \n\nEither the file couldn't be found or your browser doesn't support the file type that was provided. \n\nSuppress this message by adding \"hideErrors: true\" when creating a new FontFace. \n");
  };

  return FontFace;

})();


},{}],"TextLayer":[function(require,module,exports){
var TextLayer, convertTextLayers, convertToTextLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TextLayer = (function(superClass) {
  extend(TextLayer, superClass);

  function TextLayer(options) {
    if (options == null) {
      options = {};
    }
    this.doAutoSize = false;
    this.doAutoSizeHeight = false;
    if (options.backgroundColor == null) {
      options.backgroundColor = options.setup ? "hsla(60, 90%, 47%, .4)" : "transparent";
    }
    if (options.color == null) {
      options.color = "red";
    }
    if (options.lineHeight == null) {
      options.lineHeight = 1.25;
    }
    if (options.fontFamily == null) {
      options.fontFamily = "Helvetica";
    }
    if (options.fontSize == null) {
      options.fontSize = 20;
    }
    if (options.text == null) {
      options.text = "Use layer.text to add text";
    }
    TextLayer.__super__.constructor.call(this, options);
    this.style.whiteSpace = "pre-line";
    this.style.outline = "none";
  }

  TextLayer.prototype.setStyle = function(property, value, pxSuffix) {
    if (pxSuffix == null) {
      pxSuffix = false;
    }
    this.style[property] = pxSuffix ? value + "px" : value;
    this.emit("change:" + property, value);
    if (this.doAutoSize) {
      return this.calcSize();
    }
  };

  TextLayer.prototype.calcSize = function() {
    var constraints, size, sizeAffectingStyles;
    sizeAffectingStyles = {
      lineHeight: this.style["line-height"],
      fontSize: this.style["font-size"],
      fontWeight: this.style["font-weight"],
      paddingTop: this.style["padding-top"],
      paddingRight: this.style["padding-right"],
      paddingBottom: this.style["padding-bottom"],
      paddingLeft: this.style["padding-left"],
      textTransform: this.style["text-transform"],
      borderWidth: this.style["border-width"],
      letterSpacing: this.style["letter-spacing"],
      fontFamily: this.style["font-family"],
      fontStyle: this.style["font-style"],
      fontVariant: this.style["font-variant"]
    };
    constraints = {};
    if (this.doAutoSizeHeight) {
      constraints.width = this.width;
    }
    size = Utils.textSize(this.text, sizeAffectingStyles, constraints);
    if (this.style.textAlign === "right") {
      this.width = size.width;
      this.x = this.x - this.width;
    } else {
      this.width = size.width;
    }
    return this.height = size.height;
  };

  TextLayer.define("autoSize", {
    get: function() {
      return this.doAutoSize;
    },
    set: function(value) {
      this.doAutoSize = value;
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("autoSizeHeight", {
    set: function(value) {
      this.doAutoSize = value;
      this.doAutoSizeHeight = value;
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("contentEditable", {
    set: function(boolean) {
      this._element.contentEditable = boolean;
      this.ignoreEvents = !boolean;
      return this.on("input", function() {
        if (this.doAutoSize) {
          return this.calcSize();
        }
      });
    }
  });

  TextLayer.define("text", {
    get: function() {
      return this._element.textContent;
    },
    set: function(value) {
      this._element.textContent = value;
      this.emit("change:text", value);
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("fontFamily", {
    get: function() {
      return this.style.fontFamily;
    },
    set: function(value) {
      return this.setStyle("fontFamily", value);
    }
  });

  TextLayer.define("fontSize", {
    get: function() {
      return this.style.fontSize.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("fontSize", value, true);
    }
  });

  TextLayer.define("lineHeight", {
    get: function() {
      return this.style.lineHeight;
    },
    set: function(value) {
      return this.setStyle("lineHeight", value);
    }
  });

  TextLayer.define("fontWeight", {
    get: function() {
      return this.style.fontWeight;
    },
    set: function(value) {
      return this.setStyle("fontWeight", value);
    }
  });

  TextLayer.define("fontStyle", {
    get: function() {
      return this.style.fontStyle;
    },
    set: function(value) {
      return this.setStyle("fontStyle", value);
    }
  });

  TextLayer.define("fontVariant", {
    get: function() {
      return this.style.fontVariant;
    },
    set: function(value) {
      return this.setStyle("fontVariant", value);
    }
  });

  TextLayer.define("padding", {
    set: function(value) {
      this.setStyle("paddingTop", value, true);
      this.setStyle("paddingRight", value, true);
      this.setStyle("paddingBottom", value, true);
      return this.setStyle("paddingLeft", value, true);
    }
  });

  TextLayer.define("paddingTop", {
    get: function() {
      return this.style.paddingTop.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingTop", value, true);
    }
  });

  TextLayer.define("paddingRight", {
    get: function() {
      return this.style.paddingRight.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingRight", value, true);
    }
  });

  TextLayer.define("paddingBottom", {
    get: function() {
      return this.style.paddingBottom.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingBottom", value, true);
    }
  });

  TextLayer.define("paddingLeft", {
    get: function() {
      return this.style.paddingLeft.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingLeft", value, true);
    }
  });

  TextLayer.define("textAlign", {
    set: function(value) {
      return this.setStyle("textAlign", value);
    }
  });

  TextLayer.define("textTransform", {
    get: function() {
      return this.style.textTransform;
    },
    set: function(value) {
      return this.setStyle("textTransform", value);
    }
  });

  TextLayer.define("letterSpacing", {
    get: function() {
      return this.style.letterSpacing.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("letterSpacing", value, true);
    }
  });

  TextLayer.define("length", {
    get: function() {
      return this.text.length;
    }
  });

  return TextLayer;

})(Layer);

convertToTextLayer = function(layer) {
  var css, cssObj, importPath, t;
  t = new TextLayer({
    name: layer.name,
    frame: layer.frame,
    parent: layer.parent
  });
  cssObj = {};
  css = layer._info.metadata.css;
  css.forEach(function(rule) {
    var arr;
    if (_.includes(rule, '/*')) {
      return;
    }
    arr = rule.split(': ');
    return cssObj[arr[0]] = arr[1].replace(';', '');
  });
  t.style = cssObj;
  importPath = layer.__framerImportedFromPath;
  if (_.includes(importPath, '@2x')) {
    t.fontSize *= 2;
    t.lineHeight = (parseInt(t.lineHeight) * 2) + 'px';
    t.letterSpacing *= 2;
  }
  t.y -= (parseInt(t.lineHeight) - t.fontSize) / 2;
  t.y -= t.fontSize * 0.1;
  t.x -= t.fontSize * 0.08;
  t.width += t.fontSize * 0.5;
  t.text = layer._info.metadata.string;
  layer.destroy();
  return t;
};

Layer.prototype.convertToTextLayer = function() {
  return convertToTextLayer(this);
};

convertTextLayers = function(obj) {
  var layer, prop, results;
  results = [];
  for (prop in obj) {
    layer = obj[prop];
    if (layer._info.kind === "text") {
      results.push(obj[prop] = convertToTextLayer(layer));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

Layer.prototype.frameAsTextLayer = function(properties) {
  var t;
  t = new TextLayer;
  t.frame = this.frame;
  t.superLayer = this.superLayer;
  _.extend(t, properties);
  this.destroy();
  return t;
};

exports.TextLayer = TextLayer;

exports.convertTextLayers = convertTextLayers;


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vbW9kdWxlcy9UZXh0TGF5ZXIuY29mZmVlIiwiLi4vbW9kdWxlcy9Gb250RmFjZS5jb2ZmZWUiLCIuLi9tb2R1bGVzL0RldmljZVBpeGVsUmF0aW8uY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIiwiY2xhc3MgVGV4dExheWVyIGV4dGVuZHMgTGF5ZXJcblx0XHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdEBkb0F1dG9TaXplID0gZmFsc2Vcblx0XHRAZG9BdXRvU2l6ZUhlaWdodCA9IGZhbHNlXG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gaWYgb3B0aW9ucy5zZXR1cCB0aGVuIFwiaHNsYSg2MCwgOTAlLCA0NyUsIC40KVwiIGVsc2UgXCJ0cmFuc3BhcmVudFwiXG5cdFx0b3B0aW9ucy5jb2xvciA/PSBcInJlZFwiXG5cdFx0b3B0aW9ucy5saW5lSGVpZ2h0ID89IDEuMjVcblx0XHRvcHRpb25zLmZvbnRGYW1pbHkgPz0gXCJIZWx2ZXRpY2FcIlxuXHRcdG9wdGlvbnMuZm9udFNpemUgPz0gMjBcblx0XHRvcHRpb25zLnRleHQgPz0gXCJVc2UgbGF5ZXIudGV4dCB0byBhZGQgdGV4dFwiXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdEBzdHlsZS53aGl0ZVNwYWNlID0gXCJwcmUtbGluZVwiICMgYWxsb3cgXFxuIGluIC50ZXh0XG5cdFx0QHN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIiAjIG5vIGJvcmRlciB3aGVuIHNlbGVjdGVkXG5cdFx0XG5cdHNldFN0eWxlOiAocHJvcGVydHksIHZhbHVlLCBweFN1ZmZpeCA9IGZhbHNlKSAtPlxuXHRcdEBzdHlsZVtwcm9wZXJ0eV0gPSBpZiBweFN1ZmZpeCB0aGVuIHZhbHVlK1wicHhcIiBlbHNlIHZhbHVlXG5cdFx0QGVtaXQoXCJjaGFuZ2U6I3twcm9wZXJ0eX1cIiwgdmFsdWUpXG5cdFx0aWYgQGRvQXV0b1NpemUgdGhlbiBAY2FsY1NpemUoKVxuXHRcdFxuXHRjYWxjU2l6ZTogLT5cblx0XHRzaXplQWZmZWN0aW5nU3R5bGVzID1cblx0XHRcdGxpbmVIZWlnaHQ6IEBzdHlsZVtcImxpbmUtaGVpZ2h0XCJdXG5cdFx0XHRmb250U2l6ZTogQHN0eWxlW1wiZm9udC1zaXplXCJdXG5cdFx0XHRmb250V2VpZ2h0OiBAc3R5bGVbXCJmb250LXdlaWdodFwiXVxuXHRcdFx0cGFkZGluZ1RvcDogQHN0eWxlW1wicGFkZGluZy10b3BcIl1cblx0XHRcdHBhZGRpbmdSaWdodDogQHN0eWxlW1wicGFkZGluZy1yaWdodFwiXVxuXHRcdFx0cGFkZGluZ0JvdHRvbTogQHN0eWxlW1wicGFkZGluZy1ib3R0b21cIl1cblx0XHRcdHBhZGRpbmdMZWZ0OiBAc3R5bGVbXCJwYWRkaW5nLWxlZnRcIl1cblx0XHRcdHRleHRUcmFuc2Zvcm06IEBzdHlsZVtcInRleHQtdHJhbnNmb3JtXCJdXG5cdFx0XHRib3JkZXJXaWR0aDogQHN0eWxlW1wiYm9yZGVyLXdpZHRoXCJdXG5cdFx0XHRsZXR0ZXJTcGFjaW5nOiBAc3R5bGVbXCJsZXR0ZXItc3BhY2luZ1wiXVxuXHRcdFx0Zm9udEZhbWlseTogQHN0eWxlW1wiZm9udC1mYW1pbHlcIl1cblx0XHRcdGZvbnRTdHlsZTogQHN0eWxlW1wiZm9udC1zdHlsZVwiXVxuXHRcdFx0Zm9udFZhcmlhbnQ6IEBzdHlsZVtcImZvbnQtdmFyaWFudFwiXVxuXHRcdGNvbnN0cmFpbnRzID0ge31cblx0XHRpZiBAZG9BdXRvU2l6ZUhlaWdodCB0aGVuIGNvbnN0cmFpbnRzLndpZHRoID0gQHdpZHRoXG5cdFx0c2l6ZSA9IFV0aWxzLnRleHRTaXplIEB0ZXh0LCBzaXplQWZmZWN0aW5nU3R5bGVzLCBjb25zdHJhaW50c1xuXHRcdGlmIEBzdHlsZS50ZXh0QWxpZ24gaXMgXCJyaWdodFwiXG5cdFx0XHRAd2lkdGggPSBzaXplLndpZHRoXG5cdFx0XHRAeCA9IEB4LUB3aWR0aFxuXHRcdGVsc2Vcblx0XHRcdEB3aWR0aCA9IHNpemUud2lkdGhcblx0XHRAaGVpZ2h0ID0gc2l6ZS5oZWlnaHRcblxuXHRAZGVmaW5lIFwiYXV0b1NpemVcIixcblx0XHRnZXQ6IC0+IEBkb0F1dG9TaXplXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QGRvQXV0b1NpemUgPSB2YWx1ZVxuXHRcdFx0aWYgQGRvQXV0b1NpemUgdGhlbiBAY2FsY1NpemUoKVxuXHRAZGVmaW5lIFwiYXV0b1NpemVIZWlnaHRcIixcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAZG9BdXRvU2l6ZSA9IHZhbHVlXG5cdFx0XHRAZG9BdXRvU2l6ZUhlaWdodCA9IHZhbHVlXG5cdFx0XHRpZiBAZG9BdXRvU2l6ZSB0aGVuIEBjYWxjU2l6ZSgpXG5cdEBkZWZpbmUgXCJjb250ZW50RWRpdGFibGVcIixcblx0XHRzZXQ6IChib29sZWFuKSAtPlxuXHRcdFx0QF9lbGVtZW50LmNvbnRlbnRFZGl0YWJsZSA9IGJvb2xlYW5cblx0XHRcdEBpZ25vcmVFdmVudHMgPSAhYm9vbGVhblxuXHRcdFx0QG9uIFwiaW5wdXRcIiwgLT4gQGNhbGNTaXplKCkgaWYgQGRvQXV0b1NpemVcblx0QGRlZmluZSBcInRleHRcIixcblx0XHRnZXQ6IC0+IEBfZWxlbWVudC50ZXh0Q29udGVudFxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QF9lbGVtZW50LnRleHRDb250ZW50ID0gdmFsdWVcblx0XHRcdEBlbWl0KFwiY2hhbmdlOnRleHRcIiwgdmFsdWUpXG5cdFx0XHRpZiBAZG9BdXRvU2l6ZSB0aGVuIEBjYWxjU2l6ZSgpXG5cdEBkZWZpbmUgXCJmb250RmFtaWx5XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRGYW1pbHlcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udEZhbWlseVwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRTaXplXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRTaXplLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRTaXplXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwibGluZUhlaWdodFwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5saW5lSGVpZ2h0IFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJsaW5lSGVpZ2h0XCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwiZm9udFdlaWdodFwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250V2VpZ2h0IFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250V2VpZ2h0XCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwiZm9udFN0eWxlXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRTdHlsZVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250U3R5bGVcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250VmFyaWFudFwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250VmFyaWFudFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250VmFyaWFudFwiLCB2YWx1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdcIixcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nVG9wXCIsIHZhbHVlLCB0cnVlKVxuXHRcdFx0QHNldFN0eWxlKFwicGFkZGluZ1JpZ2h0XCIsIHZhbHVlLCB0cnVlKVxuXHRcdFx0QHNldFN0eWxlKFwicGFkZGluZ0JvdHRvbVwiLCB2YWx1ZSwgdHJ1ZSlcblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdMZWZ0XCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ1RvcFwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5wYWRkaW5nVG9wLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdUb3BcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nUmlnaHRcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ1JpZ2h0LnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdSaWdodFwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdCb3R0b21cIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ0JvdHRvbS5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJwYWRkaW5nQm90dG9tXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ0xlZnRcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5wYWRkaW5nTGVmdC5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJwYWRkaW5nTGVmdFwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInRleHRBbGlnblwiLFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJ0ZXh0QWxpZ25cIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJ0ZXh0VHJhbnNmb3JtXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLnRleHRUcmFuc2Zvcm0gXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInRleHRUcmFuc2Zvcm1cIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJsZXR0ZXJTcGFjaW5nXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmxldHRlclNwYWNpbmcucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwibGV0dGVyU3BhY2luZ1wiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcImxlbmd0aFwiLCBcblx0XHRnZXQ6IC0+IEB0ZXh0Lmxlbmd0aFxuXG5jb252ZXJ0VG9UZXh0TGF5ZXIgPSAobGF5ZXIpIC0+XG5cdHQgPSBuZXcgVGV4dExheWVyXG5cdFx0bmFtZTogbGF5ZXIubmFtZVxuXHRcdGZyYW1lOiBsYXllci5mcmFtZVxuXHRcdHBhcmVudDogbGF5ZXIucGFyZW50XG5cdFxuXHRjc3NPYmogPSB7fVxuXHRjc3MgPSBsYXllci5faW5mby5tZXRhZGF0YS5jc3Ncblx0Y3NzLmZvckVhY2ggKHJ1bGUpIC0+XG5cdFx0cmV0dXJuIGlmIF8uaW5jbHVkZXMgcnVsZSwgJy8qJ1xuXHRcdGFyciA9IHJ1bGUuc3BsaXQoJzogJylcblx0XHRjc3NPYmpbYXJyWzBdXSA9IGFyclsxXS5yZXBsYWNlKCc7JywnJylcblx0dC5zdHlsZSA9IGNzc09ialxuXHRcblx0aW1wb3J0UGF0aCA9IGxheWVyLl9fZnJhbWVySW1wb3J0ZWRGcm9tUGF0aFxuXHRpZiBfLmluY2x1ZGVzIGltcG9ydFBhdGgsICdAMngnXG5cdFx0dC5mb250U2l6ZSAqPSAyXG5cdFx0dC5saW5lSGVpZ2h0ID0gKHBhcnNlSW50KHQubGluZUhlaWdodCkqMikrJ3B4J1xuXHRcdHQubGV0dGVyU3BhY2luZyAqPSAyXG5cdFx0XHRcdFx0XG5cdHQueSAtPSAocGFyc2VJbnQodC5saW5lSGVpZ2h0KS10LmZvbnRTaXplKS8yICMgY29tcGVuc2F0ZSBmb3IgaG93IENTUyBoYW5kbGVzIGxpbmUgaGVpZ2h0XG5cdHQueSAtPSB0LmZvbnRTaXplICogMC4xICMgc2tldGNoIHBhZGRpbmdcblx0dC54IC09IHQuZm9udFNpemUgKiAwLjA4ICMgc2tldGNoIHBhZGRpbmdcblx0dC53aWR0aCArPSB0LmZvbnRTaXplICogMC41ICMgc2tldGNoIHBhZGRpbmdcblxuXHR0LnRleHQgPSBsYXllci5faW5mby5tZXRhZGF0YS5zdHJpbmdcblx0bGF5ZXIuZGVzdHJveSgpXG5cdHJldHVybiB0XG5cbkxheWVyOjpjb252ZXJ0VG9UZXh0TGF5ZXIgPSAtPiBjb252ZXJ0VG9UZXh0TGF5ZXIoQClcblxuY29udmVydFRleHRMYXllcnMgPSAob2JqKSAtPlxuXHRmb3IgcHJvcCxsYXllciBvZiBvYmpcblx0XHRpZiBsYXllci5faW5mby5raW5kIGlzIFwidGV4dFwiXG5cdFx0XHRvYmpbcHJvcF0gPSBjb252ZXJ0VG9UZXh0TGF5ZXIobGF5ZXIpXG5cbiMgQmFja3dhcmRzIGNvbXBhYmlsaXR5LiBSZXBsYWNlZCBieSBjb252ZXJ0VG9UZXh0TGF5ZXIoKVxuTGF5ZXI6OmZyYW1lQXNUZXh0TGF5ZXIgPSAocHJvcGVydGllcykgLT5cbiAgICB0ID0gbmV3IFRleHRMYXllclxuICAgIHQuZnJhbWUgPSBAZnJhbWVcbiAgICB0LnN1cGVyTGF5ZXIgPSBAc3VwZXJMYXllclxuICAgIF8uZXh0ZW5kIHQscHJvcGVydGllc1xuICAgIEBkZXN0cm95KClcbiAgICB0XG5cbmV4cG9ydHMuVGV4dExheWVyID0gVGV4dExheWVyXG5leHBvcnRzLmNvbnZlcnRUZXh0TGF5ZXJzID0gY29udmVydFRleHRMYXllcnNcbiIsIiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIENyZWF0ZWQgYnkgSm9yZGFuIFJvYmVydCBEb2Jzb24gb24gMDUgT2N0b2JlciAyMDE1XG4jIFxuIyBVc2UgdG8gYWRkIGZvbnQgZmlsZXMgYW5kIHJlZmVyZW5jZSB0aGVtIGluIHlvdXIgQ1NTIHN0eWxlIHNldHRpbmdzLlxuI1xuIyBUbyBHZXQgU3RhcnRlZC4uLlxuI1xuIyAxLiBQbGFjZSB0aGUgRm9udEZhY2UuY29mZmVlIGZpbGUgaW4gRnJhbWVyIFN0dWRpbyBtb2R1bGVzIGRpcmVjdG9yeVxuI1xuIyAyLiBJbiB5b3VyIHByb2plY3QgaW5jbHVkZTpcbiMgICAgIHtGb250RmFjZX0gPSByZXF1aXJlIFwiRm9udEZhY2VcIlxuI1xuIyAzLiBUbyBhZGQgYSBmb250IGZhY2U6IFxuIyAgICAgZ290aGFtID0gbmV3IEZvbnRGYWNlIG5hbWU6IFwiR290aGFtXCIsIGZpbGU6IFwiR290aGFtLnR0ZlwiXG4jIFxuIyA0LiBJdCBjaGVja3MgdGhhdCB0aGUgZm9udCB3YXMgbG9hZGVkLiBFcnJvcnMgY2FuIGJlIHN1cHByZXNzZWQgbGlrZSBzby4uLlxuIyAgICBnb3RoYW0gPSBuZXcgRm9udEZhY2UgbmFtZTogXCJHb3RoYW1cIiwgZmlsZTogXCJHb3RoYW0udHRmXCIsIGhpZGVFcnJvcnM6IHRydWUgXG4jXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5jbGFzcyBleHBvcnRzLkZvbnRGYWNlXG5cblx0VEVTVCA9XG5cdFx0ZmFjZTogXCJtb25vc3BhY2VcIlxuXHRcdHRleHQ6IFwiZm9vXCJcblx0XHR0aW1lOiAuMDFcblx0XHRtYXhMb2FkQXR0ZW1wdHM6IDUwXG5cdFx0aGlkZUVycm9yTWVzc2FnZXM6IHRydWVcblx0XHRcblx0VEVTVC5zdHlsZSA9IFxuXHRcdHdpZHRoOiBcImF1dG9cIlxuXHRcdGZvbnRTaXplOiBcIjE1MHB4XCJcblx0XHRmb250RmFtaWx5OiBURVNULmZhY2Vcblx0XHRcblx0VEVTVC5sYXllciA9IG5ldyBMYXllclxuXHRcdG5hbWU6XCJGb250RmFjZSBUZXN0ZXJcIlxuXHRcdHdpZHRoOiAwXG5cdFx0aGVpZ2h0OiAxXG5cdFx0bWF4WDogLShTY3JlZW4ud2lkdGgpXG5cdFx0dmlzaWJsZTogZmFsc2Vcblx0XHRodG1sOiBURVNULnRleHRcblx0XHRzdHlsZTogVEVTVC5zdHlsZVxuXHRcdFxuXHRcblx0IyBTRVRVUCBGT1IgRVZFUlkgSU5TVEFOQ0Vcblx0Y29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuXHRcblx0XHRAbmFtZSA9IEBmaWxlID0gQHRlc3RMYXllciA9IEBpc0xvYWRlZCA9IEBsb2FkRmFpbGVkID0gQGxvYWRBdHRlbXB0cyA9IEBvcmlnaW5hbFNpemUgPSBAaGlkZUVycm9ycyA9ICBudWxsXG5cdFx0XG5cdFx0aWYgb3B0aW9ucz9cblx0XHRcdEBuYW1lID0gb3B0aW9ucy5uYW1lIHx8IG51bGxcblx0XHRcdEBmaWxlID0gb3B0aW9ucy5maWxlIHx8IG51bGxcblx0XHRcblx0XHRyZXR1cm4gbWlzc2luZ0FyZ3VtZW50RXJyb3IoKSB1bmxlc3MgQG5hbWU/IGFuZCBAZmlsZT9cblx0XHRcblx0XHRAdGVzdExheWVyICAgICAgICAgPSBURVNULmxheWVyLmNvcHkoKVxuXHRcdEB0ZXN0TGF5ZXIuc3R5bGUgICA9IFRFU1Quc3R5bGVcblx0XHRAdGVzdExheWVyLm1heFggICAgPSAtKFNjcmVlbi53aWR0aClcblx0XHRAdGVzdExheWVyLnZpc2libGUgPSB0cnVlXG5cdFx0XG5cdFx0QGlzTG9hZGVkICAgICA9IGZhbHNlXG5cdFx0QGxvYWRGYWlsZWQgICA9IGZhbHNlXG5cdFx0QGxvYWRBdHRlbXB0cyA9IDBcblx0XHRAaGlkZUVycm9ycyAgID0gb3B0aW9ucy5oaWRlRXJyb3JzXG5cblx0XHRyZXR1cm4gYWRkRm9udEZhY2UgQG5hbWUsIEBmaWxlLCBAXG5cdFx0XG5cdCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQjIFByaXZhdGUgSGVscGVyIE1ldGhvZHMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0XHRcblx0YWRkRm9udEZhY2UgPSAobmFtZSwgZmlsZSwgb2JqZWN0KSAtPlxuXHRcdCMgQ3JlYXRlIG91ciBFbGVtZW50ICYgTm9kZVxuXHRcdHN0eWxlVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnc3R5bGUnXG5cdFx0ZmFjZUNTUyAgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSBcIkBmb250LWZhY2UgeyBmb250LWZhbWlseTogJyN7bmFtZX0nOyBzcmM6IHVybCgnI3tmaWxlfScpIGZvcm1hdCgndHJ1ZXR5cGUnKTsgfVwiXG5cdFx0IyBBZGQgdGhlIEVsZW1lbnQgJiBOb2RlIHRvIHRoZSBkb2N1bWVudFxuXHRcdHN0eWxlVGFnLmFwcGVuZENoaWxkIGZhY2VDU1Ncblx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkIHN0eWxlVGFnXG5cdFx0IyBUZXN0IG91dCB0aGUgRmFzdCB0byBzZWUgaWYgaXQgY2hhbmdlZFxuXHRcdHRlc3ROZXdGYWNlIG5hbWUsIG9iamVjdFxuXHRcdFxuXHQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0XHRcblx0cmVtb3ZlVGVzdExheWVyID0gKG9iamVjdCkgLT5cblx0XHRvYmplY3QudGVzdExheWVyLmRlc3Ryb3koKVxuXHRcdG9iamVjdC50ZXN0TGF5ZXIgPSBudWxsXG5cdFx0XG5cdCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHRcdFxuXHR0ZXN0TmV3RmFjZSA9IChuYW1lLCBvYmplY3QpIC0+XG5cdFx0XG5cdFx0aW5pdGlhbFdpZHRoID0gb2JqZWN0LnRlc3RMYXllci5fZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuXHRcdFxuXHRcdCMgQ2hlY2sgdG8gc2VlIGlmIGl0J3MgcmVhZHkgeWV0XG5cdFx0aWYgaW5pdGlhbFdpZHRoIGlzIDBcblx0XHRcdGlmIG9iamVjdC5oaWRlRXJyb3JzIGlzIGZhbHNlIG9yIFRFU1QuaGlkZUVycm9yTWVzc2FnZXMgaXMgZmFsc2Vcblx0XHRcdFx0cHJpbnQgXCJMb2FkIHRlc3RpbmcgZmFpbGVkLiBBdHRlbXB0aW5nIGFnYWluLlwiXG5cdFx0XHRyZXR1cm4gVXRpbHMuZGVsYXkgVEVTVC50aW1lLCAtPiB0ZXN0TmV3RmFjZSBuYW1lLCBvYmplY3Rcblx0XHRcblx0XHRvYmplY3QubG9hZEF0dGVtcHRzKytcblx0XHRcblx0XHRpZiBvYmplY3Qub3JpZ2luYWxTaXplIGlzIG51bGxcblx0XHRcdG9iamVjdC5vcmlnaW5hbFNpemUgPSBpbml0aWFsV2lkdGhcblx0XHRcdG9iamVjdC50ZXN0TGF5ZXIuc3R5bGUgPSBmb250RmFtaWx5OiBcIiN7bmFtZX0sICN7VEVTVC5mYWNlfVwiXG5cdFx0XG5cdFx0d2lkdGhVcGRhdGUgPSBvYmplY3QudGVzdExheWVyLl9lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG5cblx0XHRpZiBvYmplY3Qub3JpZ2luYWxTaXplIGlzIHdpZHRoVXBkYXRlXG5cdFx0XHQjIElmIHdlIGNhbiBhdHRlbXB0IHRvIGNoZWNrIGFnYWluLi4uIERvIGl0XG5cdFx0XHRpZiBvYmplY3QubG9hZEF0dGVtcHRzIDwgVEVTVC5tYXhMb2FkQXR0ZW1wdHNcblx0XHRcdFx0cmV0dXJuIFV0aWxzLmRlbGF5IFRFU1QudGltZSwgLT4gdGVzdE5ld0ZhY2UgbmFtZSwgb2JqZWN0XG5cdFx0XHRcdFxuXHRcdFx0cHJpbnQgXCLimqDvuI8gRmFpbGVkIGxvYWRpbmcgRm9udEZhY2U6ICN7bmFtZX1cIiB1bmxlc3Mgb2JqZWN0LmhpZGVFcnJvcnNcblx0XHRcdG9iamVjdC5pc0xvYWRlZCAgID0gZmFsc2Vcblx0XHRcdG9iamVjdC5sb2FkRmFpbGVkID0gdHJ1ZVxuXHRcdFx0bG9hZFRlc3RpbmdGaWxlRXJyb3Igb2JqZWN0IHVubGVzcyBvYmplY3QuaGlkZUVycm9yc1xuXHRcdFx0cmV0dXJuXG5cdFx0XHRcblx0XHRlbHNlXG5cdFx0XHRwcmludCBcIkxPQURFRDogI3tuYW1lfVwiIHVubGVzcyBvYmplY3QuaGlkZUVycm9ycyBpcyBmYWxzZSBvciBURVNULmhpZGVFcnJvck1lc3NhZ2VzXG5cdFx0XHRvYmplY3QuaXNMb2FkZWQgICA9IHRydWVcblx0XHRcdG9iamVjdC5sb2FkRmFpbGVkID0gZmFsc2VcblxuXHRcdHJlbW92ZVRlc3RMYXllciBvYmplY3Rcblx0XHRyZXR1cm4gbmFtZVxuXG5cdCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQjIEVycm9yIEhhbmRsZXIgTWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHRtaXNzaW5nQXJndW1lbnRFcnJvciA9IC0+XG5cdFx0ZXJyb3IgbnVsbFxuXHRcdGNvbnNvbGUuZXJyb3IgXCJcIlwiXG5cdFx0XHRFcnJvcjogWW91IG11c3QgcGFzcyBuYW1lICYgZmlsZSBwcm9wZXJpdGVzIHdoZW4gY3JlYXRpbmcgYSBuZXcgRm9udEZhY2UuIFxcblxuXHRcdFx0RXhhbXBsZTogbXlGYWNlID0gbmV3IEZvbnRGYWNlIG5hbWU6XFxcIkdvdGhhbVxcXCIsIGZpbGU6XFxcImdvdGhhbS50dGZcXFwiIFxcblwiXCJcIlxuXHRcdFx0XG5cdGxvYWRUZXN0aW5nRmlsZUVycm9yID0gKG9iamVjdCkgLT5cblx0XHRlcnJvciBudWxsXG5cdFx0Y29uc29sZS5lcnJvciBcIlwiXCJcblx0XHRcdEVycm9yOiBDb3VsZG4ndCBkZXRlY3QgdGhlIGZvbnQ6IFxcXCIje29iamVjdC5uYW1lfVxcXCIgYW5kIGZpbGU6IFxcXCIje29iamVjdC5maWxlfVxcXCIgd2FzIGxvYWRlZC4gIFxcblxuXHRcdFx0RWl0aGVyIHRoZSBmaWxlIGNvdWxkbid0IGJlIGZvdW5kIG9yIHlvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgdGhlIGZpbGUgdHlwZSB0aGF0IHdhcyBwcm92aWRlZC4gXFxuXG5cdFx0XHRTdXBwcmVzcyB0aGlzIG1lc3NhZ2UgYnkgYWRkaW5nIFxcXCJoaWRlRXJyb3JzOiB0cnVlXFxcIiB3aGVuIGNyZWF0aW5nIGEgbmV3IEZvbnRGYWNlLiBcXG5cIlwiXCJcbiIsIiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBDcmVhdGVkIG9uIDIzIERFQyAyMDE1IGJ5IEpvcmRhbiBEb2Jzb24gLyBAam9yZGFuZG9ic29uIC8gam9yZGFuQGJyb3RoZS5yc1xuIyBVcGRhdGVkIG9uIDEyIEFQUiAyMDE2IGJ5IEpvcmRhbiBEb2Jzb24gd2l0aCB0aGFua3MgdG8gTmlrb2xheSBCZXJlem92c2tpeSFcbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIyBVc2UgdG8gbWVhc3VyZSBwaXhlbHMgYXQgMXggYW5kIGhhdmUgaXQgYWRqdXN0IGZvciB0aGUgUGl4ZWwgUmF0aW9cbiNcbiMgVG8gR2V0IFN0YXJ0ZWQuLi5cbiNcbiMgIDEuIFBsYWNlIHRoaXMgZmlsZSBpbiBGcmFtZXIgU3R1ZGlvIG1vZHVsZXMgZGlyZWN0b3J5XG4jXG4jICAyLiBJbiB5b3VyIHByb2plY3QgaW5jbHVkZTpcbiNcbiMgICAgIHtkcHJ9ID0gcmVxdWlyZSAnRGV2aWNlUGl4ZWxSYXRpbydcbiNcbiMgIDMuIFdoZW4geW91IGNyZWF0ZSBhIGxheWVyIGRvIHNvIEAgMXggYW5kIGFkZCB0aGUgZHByIGZ1bmN0aW9uIHRvIHRoZSB2YWx1ZVxuI1xuIyAgICAgcmVjdCA9IG5ldyBMYXllclxuIyAgICAgICB3aWR0aDogIGRwcigzMDApXG4jICAgICAgIGhlaWdodDogZHByIDUwXG4jICAgICAgIHg6ICAgICAgKGRwciAxNilcbiMgXG4jICA0LiBVc2UgaXQgZm9yIG1vcmUgdGhhbiBsYXllciBzaXplLiBIZXJlJ3MgYWR2YW5jZWQgdXNhZ2UgZm9yIG11bHRpIGRldmljZXM6XG4jXG4jXHRcdFx0IyBBZGQgYSBsaXN0IHJvdyB3LyB0aGUgaGVpZ2h0ICYgdGV4dCBzaXppbmcvbGF5b3V0IHVzaW5nIGRwcigpXG4jXG4jICAgICBsaXN0Um93ID0gbmV3IExheWVyXG4jICAgICAgIHdpZHRoOiBTY3JlZW4ud2lkdGhcbiMgICAgICAgaGVpZ2h0OiBkcHIgNDRcbiMgICAgICAgaHRtbDogXCJMaXN0IEl0ZW1cIlxuIyAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG4jICAgICAgIGNvbG9yOiBcIiMwMDBcIlxuIyAgICAgICBzdHlsZTogXG4jICAgICAgICAgZm9udDogXCI0MDAgI3tkcHIgMTR9cHgvI3tkcHIgNDJ9cHggLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhIE5ldWVcIlxuIyAgICAgICAgIHRleHRJbmRlbnQ6IFwiI3tkcHIgMTV9cHhcIlxuI1xuIyBcdFx0IyBBZGQgYSBjaGV2cm9uIHdpdGggdGhlIHNpemUsIHJpZ2h0IG1hcmdpbiAmIHNoYWRvdyBzdHJva2UgdXNpbmcgZHByKClcbiMgICAgIFxuIyAgICAgbGlzdENoZXZyb24gPSBuZXcgTGF5ZXJcbiMgICAgIFx0c3VwZXJMYXllcjogbGlzdFJvd1xuIyAgICAgXHR3aWR0aDogIGRwciA5XG4jICAgICBcdGhlaWdodDogZHByIDlcbiMgICAgIFx0bWF4WDogbGlzdFJvdy53aWR0aCAtIGRwciAxNVxuIyAgICAgXHR5OiAgICBsaXN0Um93LmhlaWdodCAvIDJcbiMgICAgIFx0b3JpZ2luWDogMVxuIyAgICAgXHRvcmlnaW5ZOiAwXG4jICAgICBcdHJvdGF0aW9uOiA0NVxuIyAgICAgXHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcbiMgICAgIFx0c3R5bGU6XG4jICAgICBcdFx0Ym94U2hhZG93OiBcImluc2V0IC0je2RwciAyfXB4ICN7ZHByIDJ9cHggMCAjQkNCQ0MxXCJcbiNcbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5jbGFzcyBleHBvcnRzLkRldmljZVBpeGVsUmF0aW9cblxuXHQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQjIFByaXZhdGUgTWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHRcblx0bG9nID0gKHYpIC0+XG5cdFx0Y29uc29sZS5sb2cgXCJEZXZpY2VQaXhlbFJhdGlvIHNldCBhczpcIiwgdlxuXHRcdHJldHVybiB2XG5cblx0ZHByID0gKCkgLT5cblx0XHRpbml0aWFsVmFsdWUgPSAxXG5cdFx0dmFsdWUgPSBpbml0aWFsVmFsdWVcblx0XHQjIENoZWNrIGlmIGluIFN0dWRpbyBvciBEZXNrdG9wIHRvIGZpZ3VyZSBvdXQgd2hhdCB0aGUgc2NhbGluZyBzaG91bGQgYmVcblx0XHRpZiBVdGlscy5pc0ZyYW1lclN0dWRpbygpIG9yIFV0aWxzLmlzRGVza3RvcCgpXG5cblx0XHRcdCMgQ2hlY2sgZm9yIDJ4IGRldmljZXMgXG5cdFx0XHRmb3IgZGV2aWNlXzJ4IGluIFsnYXBwbGUtJywgJ2dvb2dsZS1uZXh1cy0nLCAnaXBob25lLTYtJywgJ2lwaG9uZS01JywgJ2lwYWQtYWlyJywgJ25leHVzLTknLCAnYXBwbGV3YXRjaCddXG5cdFx0XHRcdHZhbHVlID0gMiBpZiBfLnN0YXJ0c1dpdGgoRnJhbWVyLkRldmljZS5kZXZpY2VUeXBlLCBkZXZpY2VfMngpXG5cblx0XHRcdCMgQ2hlY2sgZm9yIDN4IGRldmljZXNcblx0XHRcdGZvciBkZXZpY2VfM3ggaW4gWydhcHBsZS1pcGhvbmUtNnMtcGx1cycsICdnb29nbGUtbmV4dXMtNScsICdodGMtb25lLScsICdtaWNyb3NvZnQtbHVtaWEtJywgJ3NhbXN1bmctZ2FsYXh5LW5vdGUtJywgJ2lwaG9uZS02cGx1cycsICduZXh1cy01J11cblx0XHRcdFx0dmFsdWUgPSAzIGlmIF8uc3RhcnRzV2l0aChGcmFtZXIuRGV2aWNlLmRldmljZVR5cGUsIGRldmljZV8zeClcblx0XHRcdFx0XG5cdFx0XHQjIENoZWNrIGZvciAzLjV4IGRldmljZXNcblx0XHRcdGZvciBkZXZpY2VfM3A1eCBpbiBbJ2dvb2dsZS1uZXh1cy02J11cblx0XHRcdFx0dmFsdWUgPSAzLjUgaWYgXy5zdGFydHNXaXRoKEZyYW1lci5EZXZpY2UuZGV2aWNlVHlwZSwgZGV2aWNlXzNwNXgpXG5cblx0XHQjIFJldHVybiBpZiB0aGUgdmFsdWUgY2hhbmdlZC4uLiBvdGhlcndpc2UgY29udGludWVcblx0XHRyZXR1cm4gbG9nIHZhbHVlIHVubGVzcyB2YWx1ZSBpcyBpbml0aWFsVmFsdWVcblx0XHRcblx0XHQjIFNldCBVbml0cyBiYXNlZCBvbiBEZXZpY2UgUGl4ZWwgUmF0aW8gRXhjZXB0IGZvciBEZXNrdG9wXG5cdFx0dW5sZXNzIFV0aWxzLmlzRGVza3RvcCgpXG5cdFx0XHRkZXZpY2VQaXhlbFJhdGlvID0gVXRpbHMuZGV2aWNlUGl4ZWxSYXRpbygpXG5cdFx0XHQjIGlmIGl0J3MgZ3JlYXRlciB0aGFuIDEgdGhlbiB1cGRhdGUgaXQhXG5cdFx0XHR2YWx1ZSA9IGRldmljZVBpeGVsUmF0aW8gaWYgZGV2aWNlUGl4ZWxSYXRpbyA+IGluaXRpYWxWYWx1ZVxuXG5cdFx0IyByZXR1cm4gdGhlIHZhbHVlIGV2ZW4gaWYgaXQgaGFzbid0IGNoYW5nZWQgYW5kIGxvZyBpdCBldmVyeXRpbWUgaXRzIHNldFxuXHRcdHJldHVybiBsb2cgdmFsdWVcblx0XHRcblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyBDb25zdGFudCAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0XG5cdFZBTFVFID0gZHByKClcblxuXHQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQjIFB1YmxpYyBNZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHRcblx0QC5jYWxjICA9ICh2KSAtPiByZXR1cm4gdiAqIFZBTFVFXG5cdFxuXHRALnZhbHVlID0gVkFMVUVcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgQ3JlYXRlIGEgc2hvcnRoYW5kIHRvIGdldCBkaXJlY3RseSB0byB0aGUgY2FsYyBzdGF0ZW1lbnRcblxuZXhwb3J0cy5kcHIgPSBleHBvcnRzLkRldmljZVBpeGVsUmF0aW8uY2FsY1xuIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFJQUE7QURxRE0sT0FBTyxDQUFDO0FBS2IsTUFBQTs7OztFQUFBLEdBQUEsR0FBTSxTQUFDLENBQUQ7SUFDTCxPQUFPLENBQUMsR0FBUixDQUFZLDBCQUFaLEVBQXdDLENBQXhDO0FBQ0EsV0FBTztFQUZGOztFQUlOLEdBQUEsR0FBTSxTQUFBO0FBQ0wsUUFBQTtJQUFBLFlBQUEsR0FBZTtJQUNmLEtBQUEsR0FBUTtJQUVSLElBQUcsS0FBSyxDQUFDLGNBQU4sQ0FBQSxDQUFBLElBQTBCLEtBQUssQ0FBQyxTQUFOLENBQUEsQ0FBN0I7QUFHQztBQUFBLFdBQUEscUNBQUE7O1FBQ0MsSUFBYSxDQUFDLENBQUMsVUFBRixDQUFhLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBM0IsRUFBdUMsU0FBdkMsQ0FBYjtVQUFBLEtBQUEsR0FBUSxFQUFSOztBQUREO0FBSUE7QUFBQSxXQUFBLHdDQUFBOztRQUNDLElBQWEsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQTNCLEVBQXVDLFNBQXZDLENBQWI7VUFBQSxLQUFBLEdBQVEsRUFBUjs7QUFERDtBQUlBO0FBQUEsV0FBQSx3Q0FBQTs7UUFDQyxJQUFlLENBQUMsQ0FBQyxVQUFGLENBQWEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUEzQixFQUF1QyxXQUF2QyxDQUFmO1VBQUEsS0FBQSxHQUFRLElBQVI7O0FBREQsT0FYRDs7SUFlQSxJQUF3QixLQUFBLEtBQVMsWUFBakM7QUFBQSxhQUFPLEdBQUEsQ0FBSSxLQUFKLEVBQVA7O0lBR0EsSUFBQSxDQUFPLEtBQUssQ0FBQyxTQUFOLENBQUEsQ0FBUDtNQUNDLGdCQUFBLEdBQW1CLEtBQUssQ0FBQyxnQkFBTixDQUFBO01B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
