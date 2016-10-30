require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"FontFace":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vbW9kdWxlcy9UZXh0TGF5ZXIuY29mZmVlIiwiLi4vbW9kdWxlcy9Gb250RmFjZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCJjbGFzcyBUZXh0TGF5ZXIgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0QGRvQXV0b1NpemUgPSBmYWxzZVxuXHRcdEBkb0F1dG9TaXplSGVpZ2h0ID0gZmFsc2Vcblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBpZiBvcHRpb25zLnNldHVwIHRoZW4gXCJoc2xhKDYwLCA5MCUsIDQ3JSwgLjQpXCIgZWxzZSBcInRyYW5zcGFyZW50XCJcblx0XHRvcHRpb25zLmNvbG9yID89IFwicmVkXCJcblx0XHRvcHRpb25zLmxpbmVIZWlnaHQgPz0gMS4yNVxuXHRcdG9wdGlvbnMuZm9udEZhbWlseSA/PSBcIkhlbHZldGljYVwiXG5cdFx0b3B0aW9ucy5mb250U2l6ZSA/PSAyMFxuXHRcdG9wdGlvbnMudGV4dCA/PSBcIlVzZSBsYXllci50ZXh0IHRvIGFkZCB0ZXh0XCJcblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QHN0eWxlLndoaXRlU3BhY2UgPSBcInByZS1saW5lXCIgIyBhbGxvdyBcXG4gaW4gLnRleHRcblx0XHRAc3R5bGUub3V0bGluZSA9IFwibm9uZVwiICMgbm8gYm9yZGVyIHdoZW4gc2VsZWN0ZWRcblx0XHRcblx0c2V0U3R5bGU6IChwcm9wZXJ0eSwgdmFsdWUsIHB4U3VmZml4ID0gZmFsc2UpIC0+XG5cdFx0QHN0eWxlW3Byb3BlcnR5XSA9IGlmIHB4U3VmZml4IHRoZW4gdmFsdWUrXCJweFwiIGVsc2UgdmFsdWVcblx0XHRAZW1pdChcImNoYW5nZToje3Byb3BlcnR5fVwiLCB2YWx1ZSlcblx0XHRpZiBAZG9BdXRvU2l6ZSB0aGVuIEBjYWxjU2l6ZSgpXG5cdFx0XG5cdGNhbGNTaXplOiAtPlxuXHRcdHNpemVBZmZlY3RpbmdTdHlsZXMgPVxuXHRcdFx0bGluZUhlaWdodDogQHN0eWxlW1wibGluZS1oZWlnaHRcIl1cblx0XHRcdGZvbnRTaXplOiBAc3R5bGVbXCJmb250LXNpemVcIl1cblx0XHRcdGZvbnRXZWlnaHQ6IEBzdHlsZVtcImZvbnQtd2VpZ2h0XCJdXG5cdFx0XHRwYWRkaW5nVG9wOiBAc3R5bGVbXCJwYWRkaW5nLXRvcFwiXVxuXHRcdFx0cGFkZGluZ1JpZ2h0OiBAc3R5bGVbXCJwYWRkaW5nLXJpZ2h0XCJdXG5cdFx0XHRwYWRkaW5nQm90dG9tOiBAc3R5bGVbXCJwYWRkaW5nLWJvdHRvbVwiXVxuXHRcdFx0cGFkZGluZ0xlZnQ6IEBzdHlsZVtcInBhZGRpbmctbGVmdFwiXVxuXHRcdFx0dGV4dFRyYW5zZm9ybTogQHN0eWxlW1widGV4dC10cmFuc2Zvcm1cIl1cblx0XHRcdGJvcmRlcldpZHRoOiBAc3R5bGVbXCJib3JkZXItd2lkdGhcIl1cblx0XHRcdGxldHRlclNwYWNpbmc6IEBzdHlsZVtcImxldHRlci1zcGFjaW5nXCJdXG5cdFx0XHRmb250RmFtaWx5OiBAc3R5bGVbXCJmb250LWZhbWlseVwiXVxuXHRcdFx0Zm9udFN0eWxlOiBAc3R5bGVbXCJmb250LXN0eWxlXCJdXG5cdFx0XHRmb250VmFyaWFudDogQHN0eWxlW1wiZm9udC12YXJpYW50XCJdXG5cdFx0Y29uc3RyYWludHMgPSB7fVxuXHRcdGlmIEBkb0F1dG9TaXplSGVpZ2h0IHRoZW4gY29uc3RyYWludHMud2lkdGggPSBAd2lkdGhcblx0XHRzaXplID0gVXRpbHMudGV4dFNpemUgQHRleHQsIHNpemVBZmZlY3RpbmdTdHlsZXMsIGNvbnN0cmFpbnRzXG5cdFx0aWYgQHN0eWxlLnRleHRBbGlnbiBpcyBcInJpZ2h0XCJcblx0XHRcdEB3aWR0aCA9IHNpemUud2lkdGhcblx0XHRcdEB4ID0gQHgtQHdpZHRoXG5cdFx0ZWxzZVxuXHRcdFx0QHdpZHRoID0gc2l6ZS53aWR0aFxuXHRcdEBoZWlnaHQgPSBzaXplLmhlaWdodFxuXG5cdEBkZWZpbmUgXCJhdXRvU2l6ZVwiLFxuXHRcdGdldDogLT4gQGRvQXV0b1NpemVcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAZG9BdXRvU2l6ZSA9IHZhbHVlXG5cdFx0XHRpZiBAZG9BdXRvU2l6ZSB0aGVuIEBjYWxjU2l6ZSgpXG5cdEBkZWZpbmUgXCJhdXRvU2l6ZUhlaWdodFwiLFxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBkb0F1dG9TaXplID0gdmFsdWVcblx0XHRcdEBkb0F1dG9TaXplSGVpZ2h0ID0gdmFsdWVcblx0XHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0QGRlZmluZSBcImNvbnRlbnRFZGl0YWJsZVwiLFxuXHRcdHNldDogKGJvb2xlYW4pIC0+XG5cdFx0XHRAX2VsZW1lbnQuY29udGVudEVkaXRhYmxlID0gYm9vbGVhblxuXHRcdFx0QGlnbm9yZUV2ZW50cyA9ICFib29sZWFuXG5cdFx0XHRAb24gXCJpbnB1dFwiLCAtPiBAY2FsY1NpemUoKSBpZiBAZG9BdXRvU2l6ZVxuXHRAZGVmaW5lIFwidGV4dFwiLFxuXHRcdGdldDogLT4gQF9lbGVtZW50LnRleHRDb250ZW50XG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAX2VsZW1lbnQudGV4dENvbnRlbnQgPSB2YWx1ZVxuXHRcdFx0QGVtaXQoXCJjaGFuZ2U6dGV4dFwiLCB2YWx1ZSlcblx0XHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0QGRlZmluZSBcImZvbnRGYW1pbHlcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udEZhbWlseVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250RmFtaWx5XCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwiZm9udFNpemVcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFNpemUucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFNpemVcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJsaW5lSGVpZ2h0XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmxpbmVIZWlnaHQgXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImxpbmVIZWlnaHRcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250V2VpZ2h0XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRXZWlnaHQgXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRXZWlnaHRcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250U3R5bGVcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFN0eWxlXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRTdHlsZVwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRWYXJpYW50XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRWYXJpYW50XG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRWYXJpYW50XCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ1wiLFxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdUb3BcIiwgdmFsdWUsIHRydWUpXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nUmlnaHRcIiwgdmFsdWUsIHRydWUpXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nQm90dG9tXCIsIHZhbHVlLCB0cnVlKVxuXHRcdFx0QHNldFN0eWxlKFwicGFkZGluZ0xlZnRcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nVG9wXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdUb3AucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ1RvcFwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdSaWdodFwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5wYWRkaW5nUmlnaHQucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ1JpZ2h0XCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ0JvdHRvbVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5wYWRkaW5nQm90dG9tLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdCb3R0b21cIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nTGVmdFwiLFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdMZWZ0LnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdMZWZ0XCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwidGV4dEFsaWduXCIsXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInRleHRBbGlnblwiLCB2YWx1ZSlcblx0QGRlZmluZSBcInRleHRUcmFuc2Zvcm1cIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUudGV4dFRyYW5zZm9ybSBcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwidGV4dFRyYW5zZm9ybVwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImxldHRlclNwYWNpbmdcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUubGV0dGVyU3BhY2luZy5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJsZXR0ZXJTcGFjaW5nXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwibGVuZ3RoXCIsIFxuXHRcdGdldDogLT4gQHRleHQubGVuZ3RoXG5cbmNvbnZlcnRUb1RleHRMYXllciA9IChsYXllcikgLT5cblx0dCA9IG5ldyBUZXh0TGF5ZXJcblx0XHRuYW1lOiBsYXllci5uYW1lXG5cdFx0ZnJhbWU6IGxheWVyLmZyYW1lXG5cdFx0cGFyZW50OiBsYXllci5wYXJlbnRcblx0XG5cdGNzc09iaiA9IHt9XG5cdGNzcyA9IGxheWVyLl9pbmZvLm1ldGFkYXRhLmNzc1xuXHRjc3MuZm9yRWFjaCAocnVsZSkgLT5cblx0XHRyZXR1cm4gaWYgXy5pbmNsdWRlcyBydWxlLCAnLyonXG5cdFx0YXJyID0gcnVsZS5zcGxpdCgnOiAnKVxuXHRcdGNzc09ialthcnJbMF1dID0gYXJyWzFdLnJlcGxhY2UoJzsnLCcnKVxuXHR0LnN0eWxlID0gY3NzT2JqXG5cdFxuXHRpbXBvcnRQYXRoID0gbGF5ZXIuX19mcmFtZXJJbXBvcnRlZEZyb21QYXRoXG5cdGlmIF8uaW5jbHVkZXMgaW1wb3J0UGF0aCwgJ0AyeCdcblx0XHR0LmZvbnRTaXplICo9IDJcblx0XHR0LmxpbmVIZWlnaHQgPSAocGFyc2VJbnQodC5saW5lSGVpZ2h0KSoyKSsncHgnXG5cdFx0dC5sZXR0ZXJTcGFjaW5nICo9IDJcblx0XHRcdFx0XHRcblx0dC55IC09IChwYXJzZUludCh0LmxpbmVIZWlnaHQpLXQuZm9udFNpemUpLzIgIyBjb21wZW5zYXRlIGZvciBob3cgQ1NTIGhhbmRsZXMgbGluZSBoZWlnaHRcblx0dC55IC09IHQuZm9udFNpemUgKiAwLjEgIyBza2V0Y2ggcGFkZGluZ1xuXHR0LnggLT0gdC5mb250U2l6ZSAqIDAuMDggIyBza2V0Y2ggcGFkZGluZ1xuXHR0LndpZHRoICs9IHQuZm9udFNpemUgKiAwLjUgIyBza2V0Y2ggcGFkZGluZ1xuXG5cdHQudGV4dCA9IGxheWVyLl9pbmZvLm1ldGFkYXRhLnN0cmluZ1xuXHRsYXllci5kZXN0cm95KClcblx0cmV0dXJuIHRcblxuTGF5ZXI6OmNvbnZlcnRUb1RleHRMYXllciA9IC0+IGNvbnZlcnRUb1RleHRMYXllcihAKVxuXG5jb252ZXJ0VGV4dExheWVycyA9IChvYmopIC0+XG5cdGZvciBwcm9wLGxheWVyIG9mIG9ialxuXHRcdGlmIGxheWVyLl9pbmZvLmtpbmQgaXMgXCJ0ZXh0XCJcblx0XHRcdG9ialtwcm9wXSA9IGNvbnZlcnRUb1RleHRMYXllcihsYXllcilcblxuIyBCYWNrd2FyZHMgY29tcGFiaWxpdHkuIFJlcGxhY2VkIGJ5IGNvbnZlcnRUb1RleHRMYXllcigpXG5MYXllcjo6ZnJhbWVBc1RleHRMYXllciA9IChwcm9wZXJ0aWVzKSAtPlxuICAgIHQgPSBuZXcgVGV4dExheWVyXG4gICAgdC5mcmFtZSA9IEBmcmFtZVxuICAgIHQuc3VwZXJMYXllciA9IEBzdXBlckxheWVyXG4gICAgXy5leHRlbmQgdCxwcm9wZXJ0aWVzXG4gICAgQGRlc3Ryb3koKVxuICAgIHRcblxuZXhwb3J0cy5UZXh0TGF5ZXIgPSBUZXh0TGF5ZXJcbmV4cG9ydHMuY29udmVydFRleHRMYXllcnMgPSBjb252ZXJ0VGV4dExheWVyc1xuIiwiIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgQ3JlYXRlZCBieSBKb3JkYW4gUm9iZXJ0IERvYnNvbiBvbiAwNSBPY3RvYmVyIDIwMTVcbiMgXG4jIFVzZSB0byBhZGQgZm9udCBmaWxlcyBhbmQgcmVmZXJlbmNlIHRoZW0gaW4geW91ciBDU1Mgc3R5bGUgc2V0dGluZ3MuXG4jXG4jIFRvIEdldCBTdGFydGVkLi4uXG4jXG4jIDEuIFBsYWNlIHRoZSBGb250RmFjZS5jb2ZmZWUgZmlsZSBpbiBGcmFtZXIgU3R1ZGlvIG1vZHVsZXMgZGlyZWN0b3J5XG4jXG4jIDIuIEluIHlvdXIgcHJvamVjdCBpbmNsdWRlOlxuIyAgICAge0ZvbnRGYWNlfSA9IHJlcXVpcmUgXCJGb250RmFjZVwiXG4jXG4jIDMuIFRvIGFkZCBhIGZvbnQgZmFjZTogXG4jICAgICBnb3RoYW0gPSBuZXcgRm9udEZhY2UgbmFtZTogXCJHb3RoYW1cIiwgZmlsZTogXCJHb3RoYW0udHRmXCJcbiMgXG4jIDQuIEl0IGNoZWNrcyB0aGF0IHRoZSBmb250IHdhcyBsb2FkZWQuIEVycm9ycyBjYW4gYmUgc3VwcHJlc3NlZCBsaWtlIHNvLi4uXG4jICAgIGdvdGhhbSA9IG5ldyBGb250RmFjZSBuYW1lOiBcIkdvdGhhbVwiLCBmaWxlOiBcIkdvdGhhbS50dGZcIiwgaGlkZUVycm9yczogdHJ1ZSBcbiNcbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbmNsYXNzIGV4cG9ydHMuRm9udEZhY2VcblxuXHRURVNUID1cblx0XHRmYWNlOiBcIm1vbm9zcGFjZVwiXG5cdFx0dGV4dDogXCJmb29cIlxuXHRcdHRpbWU6IC4wMVxuXHRcdG1heExvYWRBdHRlbXB0czogNTBcblx0XHRoaWRlRXJyb3JNZXNzYWdlczogdHJ1ZVxuXHRcdFxuXHRURVNULnN0eWxlID0gXG5cdFx0d2lkdGg6IFwiYXV0b1wiXG5cdFx0Zm9udFNpemU6IFwiMTUwcHhcIlxuXHRcdGZvbnRGYW1pbHk6IFRFU1QuZmFjZVxuXHRcdFxuXHRURVNULmxheWVyID0gbmV3IExheWVyXG5cdFx0bmFtZTpcIkZvbnRGYWNlIFRlc3RlclwiXG5cdFx0d2lkdGg6IDBcblx0XHRoZWlnaHQ6IDFcblx0XHRtYXhYOiAtKFNjcmVlbi53aWR0aClcblx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdGh0bWw6IFRFU1QudGV4dFxuXHRcdHN0eWxlOiBURVNULnN0eWxlXG5cdFx0XG5cdFxuXHQjIFNFVFVQIEZPUiBFVkVSWSBJTlNUQU5DRVxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG5cdFxuXHRcdEBuYW1lID0gQGZpbGUgPSBAdGVzdExheWVyID0gQGlzTG9hZGVkID0gQGxvYWRGYWlsZWQgPSBAbG9hZEF0dGVtcHRzID0gQG9yaWdpbmFsU2l6ZSA9IEBoaWRlRXJyb3JzID0gIG51bGxcblx0XHRcblx0XHRpZiBvcHRpb25zP1xuXHRcdFx0QG5hbWUgPSBvcHRpb25zLm5hbWUgfHwgbnVsbFxuXHRcdFx0QGZpbGUgPSBvcHRpb25zLmZpbGUgfHwgbnVsbFxuXHRcdFxuXHRcdHJldHVybiBtaXNzaW5nQXJndW1lbnRFcnJvcigpIHVubGVzcyBAbmFtZT8gYW5kIEBmaWxlP1xuXHRcdFxuXHRcdEB0ZXN0TGF5ZXIgICAgICAgICA9IFRFU1QubGF5ZXIuY29weSgpXG5cdFx0QHRlc3RMYXllci5zdHlsZSAgID0gVEVTVC5zdHlsZVxuXHRcdEB0ZXN0TGF5ZXIubWF4WCAgICA9IC0oU2NyZWVuLndpZHRoKVxuXHRcdEB0ZXN0TGF5ZXIudmlzaWJsZSA9IHRydWVcblx0XHRcblx0XHRAaXNMb2FkZWQgICAgID0gZmFsc2Vcblx0XHRAbG9hZEZhaWxlZCAgID0gZmFsc2Vcblx0XHRAbG9hZEF0dGVtcHRzID0gMFxuXHRcdEBoaWRlRXJyb3JzICAgPSBvcHRpb25zLmhpZGVFcnJvcnNcblxuXHRcdHJldHVybiBhZGRGb250RmFjZSBAbmFtZSwgQGZpbGUsIEBcblx0XHRcblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdCMgUHJpdmF0ZSBIZWxwZXIgTWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHRcdFxuXHRhZGRGb250RmFjZSA9IChuYW1lLCBmaWxlLCBvYmplY3QpIC0+XG5cdFx0IyBDcmVhdGUgb3VyIEVsZW1lbnQgJiBOb2RlXG5cdFx0c3R5bGVUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdzdHlsZSdcblx0XHRmYWNlQ1NTICA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlIFwiQGZvbnQtZmFjZSB7IGZvbnQtZmFtaWx5OiAnI3tuYW1lfSc7IHNyYzogdXJsKCcje2ZpbGV9JykgZm9ybWF0KCd0cnVldHlwZScpOyB9XCJcblx0XHQjIEFkZCB0aGUgRWxlbWVudCAmIE5vZGUgdG8gdGhlIGRvY3VtZW50XG5cdFx0c3R5bGVUYWcuYXBwZW5kQ2hpbGQgZmFjZUNTU1xuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQgc3R5bGVUYWdcblx0XHQjIFRlc3Qgb3V0IHRoZSBGYXN0IHRvIHNlZSBpZiBpdCBjaGFuZ2VkXG5cdFx0dGVzdE5ld0ZhY2UgbmFtZSwgb2JqZWN0XG5cdFx0XG5cdCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHRcdFxuXHRyZW1vdmVUZXN0TGF5ZXIgPSAob2JqZWN0KSAtPlxuXHRcdG9iamVjdC50ZXN0TGF5ZXIuZGVzdHJveSgpXG5cdFx0b2JqZWN0LnRlc3RMYXllciA9IG51bGxcblx0XHRcblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdFx0XG5cdHRlc3ROZXdGYWNlID0gKG5hbWUsIG9iamVjdCkgLT5cblx0XHRcblx0XHRpbml0aWFsV2lkdGggPSBvYmplY3QudGVzdExheWVyLl9lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG5cdFx0XG5cdFx0IyBDaGVjayB0byBzZWUgaWYgaXQncyByZWFkeSB5ZXRcblx0XHRpZiBpbml0aWFsV2lkdGggaXMgMFxuXHRcdFx0aWYgb2JqZWN0LmhpZGVFcnJvcnMgaXMgZmFsc2Ugb3IgVEVTVC5oaWRlRXJyb3JNZXNzYWdlcyBpcyBmYWxzZVxuXHRcdFx0XHRwcmludCBcIkxvYWQgdGVzdGluZyBmYWlsZWQuIEF0dGVtcHRpbmcgYWdhaW4uXCJcblx0XHRcdHJldHVybiBVdGlscy5kZWxheSBURVNULnRpbWUsIC0+IHRlc3ROZXdGYWNlIG5hbWUsIG9iamVjdFxuXHRcdFxuXHRcdG9iamVjdC5sb2FkQXR0ZW1wdHMrK1xuXHRcdFxuXHRcdGlmIG9iamVjdC5vcmlnaW5hbFNpemUgaXMgbnVsbFxuXHRcdFx0b2JqZWN0Lm9yaWdpbmFsU2l6ZSA9IGluaXRpYWxXaWR0aFxuXHRcdFx0b2JqZWN0LnRlc3RMYXllci5zdHlsZSA9IGZvbnRGYW1pbHk6IFwiI3tuYW1lfSwgI3tURVNULmZhY2V9XCJcblx0XHRcblx0XHR3aWR0aFVwZGF0ZSA9IG9iamVjdC50ZXN0TGF5ZXIuX2VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcblxuXHRcdGlmIG9iamVjdC5vcmlnaW5hbFNpemUgaXMgd2lkdGhVcGRhdGVcblx0XHRcdCMgSWYgd2UgY2FuIGF0dGVtcHQgdG8gY2hlY2sgYWdhaW4uLi4gRG8gaXRcblx0XHRcdGlmIG9iamVjdC5sb2FkQXR0ZW1wdHMgPCBURVNULm1heExvYWRBdHRlbXB0c1xuXHRcdFx0XHRyZXR1cm4gVXRpbHMuZGVsYXkgVEVTVC50aW1lLCAtPiB0ZXN0TmV3RmFjZSBuYW1lLCBvYmplY3Rcblx0XHRcdFx0XG5cdFx0XHRwcmludCBcIuKaoO+4jyBGYWlsZWQgbG9hZGluZyBGb250RmFjZTogI3tuYW1lfVwiIHVubGVzcyBvYmplY3QuaGlkZUVycm9yc1xuXHRcdFx0b2JqZWN0LmlzTG9hZGVkICAgPSBmYWxzZVxuXHRcdFx0b2JqZWN0LmxvYWRGYWlsZWQgPSB0cnVlXG5cdFx0XHRsb2FkVGVzdGluZ0ZpbGVFcnJvciBvYmplY3QgdW5sZXNzIG9iamVjdC5oaWRlRXJyb3JzXG5cdFx0XHRyZXR1cm5cblx0XHRcdFxuXHRcdGVsc2Vcblx0XHRcdHByaW50IFwiTE9BREVEOiAje25hbWV9XCIgdW5sZXNzIG9iamVjdC5oaWRlRXJyb3JzIGlzIGZhbHNlIG9yIFRFU1QuaGlkZUVycm9yTWVzc2FnZXNcblx0XHRcdG9iamVjdC5pc0xvYWRlZCAgID0gdHJ1ZVxuXHRcdFx0b2JqZWN0LmxvYWRGYWlsZWQgPSBmYWxzZVxuXG5cdFx0cmVtb3ZlVGVzdExheWVyIG9iamVjdFxuXHRcdHJldHVybiBuYW1lXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdCMgRXJyb3IgSGFuZGxlciBNZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cdG1pc3NpbmdBcmd1bWVudEVycm9yID0gLT5cblx0XHRlcnJvciBudWxsXG5cdFx0Y29uc29sZS5lcnJvciBcIlwiXCJcblx0XHRcdEVycm9yOiBZb3UgbXVzdCBwYXNzIG5hbWUgJiBmaWxlIHByb3Blcml0ZXMgd2hlbiBjcmVhdGluZyBhIG5ldyBGb250RmFjZS4gXFxuXG5cdFx0XHRFeGFtcGxlOiBteUZhY2UgPSBuZXcgRm9udEZhY2UgbmFtZTpcXFwiR290aGFtXFxcIiwgZmlsZTpcXFwiZ290aGFtLnR0ZlxcXCIgXFxuXCJcIlwiXG5cdFx0XHRcblx0bG9hZFRlc3RpbmdGaWxlRXJyb3IgPSAob2JqZWN0KSAtPlxuXHRcdGVycm9yIG51bGxcblx0XHRjb25zb2xlLmVycm9yIFwiXCJcIlxuXHRcdFx0RXJyb3I6IENvdWxkbid0IGRldGVjdCB0aGUgZm9udDogXFxcIiN7b2JqZWN0Lm5hbWV9XFxcIiBhbmQgZmlsZTogXFxcIiN7b2JqZWN0LmZpbGV9XFxcIiB3YXMgbG9hZGVkLiAgXFxuXG5cdFx0XHRFaXRoZXIgdGhlIGZpbGUgY291bGRuJ3QgYmUgZm91bmQgb3IgeW91ciBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCB0aGUgZmlsZSB0eXBlIHRoYXQgd2FzIHByb3ZpZGVkLiBcXG5cblx0XHRcdFN1cHByZXNzIHRoaXMgbWVzc2FnZSBieSBhZGRpbmcgXFxcImhpZGVFcnJvcnM6IHRydWVcXFwiIHdoZW4gY3JlYXRpbmcgYSBuZXcgRm9udEZhY2UuIFxcblwiXCJcIlxuIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFHQUE7QURvQk0sT0FBTyxDQUFDO0FBRWIsTUFBQTs7RUFBQSxJQUFBLEdBQ0M7SUFBQSxJQUFBLEVBQU0sV0FBTjtJQUNBLElBQUEsRUFBTSxLQUROO0lBRUEsSUFBQSxFQUFNLEdBRk47SUFHQSxlQUFBLEVBQWlCLEVBSGpCO0lBSUEsaUJBQUEsRUFBbUIsSUFKbkI7OztFQU1ELElBQUksQ0FBQyxLQUFMLEdBQ0M7SUFBQSxLQUFBLEVBQU8sTUFBUDtJQUNBLFFBQUEsRUFBVSxPQURWO0lBRUEs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
