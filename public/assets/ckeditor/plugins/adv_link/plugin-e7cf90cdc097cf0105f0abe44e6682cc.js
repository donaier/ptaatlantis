
/*
@license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or http://ckeditor.com/license
 */

(function() {
  CKEDITOR.plugins.add("adv_link", {
    requires: "dialog,fakeobjects",
    lang: "en,es,fr,it",
    icons: "anchor,anchor-rtl,link,unlink",
    hidpi: true,
    onLoad: function() {
      var baseStyle, cssWithDir, iconPath, template;
      cssWithDir = function(dir) {
        return template.replace(/%1/g, (dir === "rtl" ? "right" : "left")).replace(/%2/g, "cke_contents_" + dir);
      };
      iconPath = CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png");
      baseStyle = "background:url(" + iconPath + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;";
      template = ".%2 a.cke_anchor," + ".%2 a.cke_anchor_empty" + ",.cke_editable.%2 a[name]" + ",.cke_editable.%2 a[data-cke-saved-name]" + "{" + baseStyle + "padding-%1:18px;" + "cursor:auto;" + "}" + (CKEDITOR.env.ie ? "a.cke_anchor_empty" + "{" + "display:inline-block;" + "}" : "") + ".%2 img.cke_anchor" + "{" + baseStyle + "width:16px;" + "min-height:15px;" + "height:1.15em;" + "vertical-align:" + (CKEDITOR.env.opera ? "middle" : "text-bottom") + ";" + "}";
      CKEDITOR.addCss(cssWithDir("ltr") + cssWithDir("rtl"));
    },
    init: function(editor) {
      var allowed, required;
      allowed = "a[!href]";
      required = "a[href]";
      if (CKEDITOR.dialog.isTabEnabled(editor, "link", "advanced")) {
        allowed = allowed.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)");
      }
      if (CKEDITOR.dialog.isTabEnabled(editor, "link", "target")) {
        allowed = allowed.replace("]", ",target,onclick]");
      }
      editor.addCommand("link", new CKEDITOR.dialogCommand("link", {
        allowedContent: allowed,
        requiredContent: required
      }));
      editor.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", {
        allowedContent: "a[!name,id]",
        requiredContent: "a[name]"
      }));
      editor.addCommand("unlink", new CKEDITOR.unlinkCommand());
      editor.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand());
      editor.setKeystroke(CKEDITOR.CTRL + 76, "link");
      if (editor.ui.addButton) {
        editor.ui.addButton("Link", {
          label: editor.lang.link.toolbar,
          command: "link",
          toolbar: "links,10"
        });
        editor.ui.addButton("Unlink", {
          label: editor.lang.link.unlink,
          command: "unlink",
          toolbar: "links,20"
        });
        editor.ui.addButton("Anchor", {
          label: editor.lang.link.anchor.toolbar,
          command: "anchor",
          toolbar: "links,30"
        });
      }
      CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
      CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
      editor.on("doubleclick", function(evt) {
        var element;
        element = CKEDITOR.plugins.link.getSelectedLink(editor) || evt.data.element;
        if (!element.isReadOnly()) {
          if (element.is("a")) {
            evt.data.dialog = (element.getAttribute("name") && (!element.getAttribute("href") || !element.getChildCount()) ? "anchor" : "link");
            editor.getSelection().selectElement(element);
          } else {
            if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(editor, element)) {
              evt.data.dialog = "anchor";
            }
          }
        }
      });
      if (editor.addMenuItems) {
        editor.addMenuItems({
          anchor: {
            label: editor.lang.link.anchor.menu,
            command: "anchor",
            group: "anchor",
            order: 1
          },
          removeAnchor: {
            label: editor.lang.link.anchor.remove,
            command: "removeAnchor",
            group: "anchor",
            order: 5
          },
          link: {
            label: editor.lang.link.menu,
            command: "link",
            group: "link",
            order: 1
          },
          unlink: {
            label: editor.lang.link.unlink,
            command: "unlink",
            group: "link",
            order: 5
          }
        });
      }
      if (editor.contextMenu) {
        editor.contextMenu.addListener(function(element, selection) {
          var anchor, menu;
          if (!element || element.isReadOnly()) {
            return null;
          }
          anchor = CKEDITOR.plugins.link.tryRestoreFakeAnchor(editor, element);
          if (!anchor && !(anchor = CKEDITOR.plugins.link.getSelectedLink(editor))) {
            return null;
          }
          menu = {};
          if (anchor.getAttribute("href") && anchor.getChildCount()) {
            menu = {
              link: CKEDITOR.TRISTATE_OFF,
              unlink: CKEDITOR.TRISTATE_OFF
            };
          }
          if (anchor && anchor.hasAttribute("name")) {
            menu.anchor = menu.removeAnchor = CKEDITOR.TRISTATE_OFF;
          }
          return menu;
        });
      }
    },
    afterInit: function(editor) {
      var dataFilter, dataProcessor, htmlFilter, pathFilters;
      dataProcessor = editor.dataProcessor;
      dataFilter = dataProcessor && dataProcessor.dataFilter;
      htmlFilter = dataProcessor && dataProcessor.htmlFilter;
      pathFilters = editor._.elementsPath && editor._.elementsPath.filters;
      if (dataFilter) {
        dataFilter.addRules({
          elements: {
            a: function(element) {
              var attributes, cls, ieClass, isEmpty;
              attributes = element.attributes;
              if (!attributes.name) {
                return null;
              }
              isEmpty = !element.children.length;
              if (CKEDITOR.plugins.link.synAnchorSelector) {
                ieClass = (isEmpty ? "cke_anchor_empty" : "cke_anchor");
                cls = attributes["class"];
                if (attributes.name && (!cls || cls.indexOf(ieClass) < 0)) {
                  attributes["class"] = (cls || "") + " " + ieClass;
                }
                if (isEmpty && CKEDITOR.plugins.link.emptyAnchorFix) {
                  attributes.contenteditable = "false";
                  attributes["data-cke-editable"] = 1;
                }
              } else {
                if (CKEDITOR.plugins.link.fakeAnchor && isEmpty) {
                  return editor.createFakeParserElement(element, "cke_anchor", "anchor");
                }
              }
              return null;
            }
          }
        });
      }
      if (CKEDITOR.plugins.link.emptyAnchorFix && htmlFilter) {
        htmlFilter.addRules({
          elements: {
            a: function(element) {
              delete element.attributes.contenteditable;
            }
          }
        });
      }
      if (pathFilters) {
        pathFilters.push(function(element, name) {
          if (name === "a") {
            if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(editor, element) || (element.getAttribute("name") && (!element.getAttribute("href") || !element.getChildCount()))) {
              return "anchor";
            }
          }
        });
      }
    }
  });


  /*
  Set of link plugin's helpers.
  
  @class
  @singleton
   */

  CKEDITOR.plugins.link = {

    /*
    Get the surrounding link element of current selection.
    
    CKEDITOR.plugins.link.getSelectedLink( editor );
    
    // The following selection will all return the link element.
    
    <a href="#">li^nk</a>
    <a href="#">[link]</a>
    text[<a href="#">link]</a>
    <a href="#">li[nk</a>]
    [<b><a href="#">li]nk</a></b>]
    [<a href="#"><b>li]nk</b></a>
    
    @since 3.2.1
    @param {CKEDITOR.editor} editor
     */
    getSelectedLink: function(editor) {
      var range, selectedElement, selection;
      selection = editor.getSelection();
      selectedElement = selection.getSelectedElement();
      if (selectedElement && selectedElement.is("a")) {
        return selectedElement;
      }
      range = selection.getRanges(true)[0];
      if (range) {
        range.shrink(CKEDITOR.SHRINK_TEXT);
        return editor.elementPath(range.getCommonAncestor()).contains("a", 1);
      }
      return null;
    },

    /*
    Opera and WebKit don't make it possible to select empty anchors. Fake
    elements must be used for them.
    
    @readonly
    @property {Boolean}
     */
    fakeAnchor: CKEDITOR.env.opera || CKEDITOR.env.webkit,

    /*
    For browsers that don't support CSS3 `a[name]:empty()`, note IE9 is included because of #7783.
    
    @readonly
    @property {Boolean}
     */
    synAnchorSelector: CKEDITOR.env.ie,

    /*
    For browsers that have editing issue with empty anchor.
    
    @readonly
    @property {Boolean}
     */
    emptyAnchorFix: CKEDITOR.env.ie && CKEDITOR.env.version < 8,

    /*
    @param {CKEDITOR.editor} editor
    @param {CKEDITOR.dom.element} element
    @todo
     */
    tryRestoreFakeAnchor: function(editor, element) {
      var link;
      if (element && element.data("cke-real-element-type") && element.data("cke-real-element-type") === "anchor") {
        link = editor.restoreRealElement(element);
        if (link.data("cke-saved-name")) {
          return link;
        }
      }
    }
  };

  CKEDITOR.unlinkCommand = function() {};

  CKEDITOR.unlinkCommand.prototype = {
    exec: function(editor) {
      var style;
      style = new CKEDITOR.style({
        element: "a",
        type: CKEDITOR.STYLE_INLINE,
        alwaysRemoveElement: 1
      });
      editor.removeStyle(style);
    },
    refresh: function(editor, path) {
      var element;
      element = path.lastElement && path.lastElement.getAscendant("a", true);
      if (element && element.getName() === "a" && element.getAttribute("href") && element.getChildCount()) {
        this.setState(CKEDITOR.TRISTATE_OFF);
      } else {
        this.setState(CKEDITOR.TRISTATE_DISABLED);
      }
    },
    contextSensitive: 1,
    startDisabled: 1,
    requiredContent: "a[href]"
  };

  CKEDITOR.removeAnchorCommand = function() {};

  CKEDITOR.removeAnchorCommand.prototype = {
    exec: function(editor) {
      var anchor, bms, sel;
      sel = editor.getSelection();
      bms = sel.createBookmarks();
      anchor = void 0;
      if (sel && (anchor = sel.getSelectedElement()) && (CKEDITOR.plugins.link.fakeAnchor && !anchor.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor(editor, anchor) : anchor.is("a"))) {
        anchor.remove(1);
      } else {
        if (anchor = CKEDITOR.plugins.link.getSelectedLink(editor)) {
          if (anchor.hasAttribute("href")) {
            anchor.removeAttributes({
              name: 1,
              "data-cke-saved-name": 1
            });
            anchor.removeClass("cke_anchor");
          } else {
            anchor.remove(1);
          }
        }
      }
      sel.selectBookmarks(bms);
    },
    requiredContent: "a[name]"
  };

  CKEDITOR.tools.extend(CKEDITOR.config, {

    /*
    @cfg {Boolean} [linkShowAdvancedTab=true]
    @member CKEDITOR.config
    @todo
     */
    linkShowAdvancedTab: true,

    /*
    @cfg {Boolean} [linkShowTargetTab=true]
    @member CKEDITOR.config
    @todo
     */
    linkShowTargetTab: true
  });

}).call(this);
