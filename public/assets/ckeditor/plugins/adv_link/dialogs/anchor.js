(function() {
  CKEDITOR.dialog.add("anchor", function(c) {
    var d;
    d = function(a) {
      this._.selectedElement = a;
      this.setValueOf("info", "txtName", a.data("cke-saved-name") || "");
    };
    return {
      title: c.lang.link.anchor.title,
      minWidth: 300,
      minHeight: 60,
      onOk: function() {
        var a, b;
        a = CKEDITOR.tools.trim(this.getValueOf("info", "txtName"));
        a = {
          id: a,
          name: a,
          "data-cke-saved-name": a
        };
        if (this._.selectedElement) {
          if (this._.selectedElement.data("cke-realelement")) {
            a = c.document.createElement("a", {
              attributes: a
            });
            c.createFakeElement(a, "cke_anchor", "anchor").replace(this._.selectedElement);
          } else {
            this._.selectedElement.setAttributes(a);
          }
        } else {
          b = c.getSelection();
          b = b && b.getRanges()[0];
          if (b.collapsed) {
            CKEDITOR.plugins.link.synAnchorSelector && (a["class"] = "cke_anchor_empty");
            CKEDITOR.plugins.link.emptyAnchorFix && (a.contenteditable = "false", a["data-cke-editable"] = 1);
            a = c.document.createElement("a", {
              attributes: a
            });
            CKEDITOR.plugins.link.fakeAnchor && (a = c.createFakeElement(a, "cke_anchor", "anchor"));
            b.insertNode(a);
          } else {
            CKEDITOR.env.ie && 9 > CKEDITOR.env.version && (a["class"] = "cke_anchor");
            a = new CKEDITOR.style({
              element: "a",
              attributes: a
            });
            a.type = CKEDITOR.STYLE_INLINE;
            c.applyStyle(a);
          }
        }
      },
      onHide: function() {
        delete this._.selectedElement;
      },
      onShow: function() {
        var a, b;
        a = c.getSelection();
        b = a.getSelectedElement();
        if (b) {
          if (CKEDITOR.plugins.link.fakeAnchor) {
            (a = CKEDITOR.plugins.link.tryRestoreFakeAnchor(c, b)) && d.call(this, a);
            this._.selectedElement = b;
          } else {
            b.is("a") && b.hasAttribute("name") && d.call(this, b);
          }
        } else if (b = CKEDITOR.plugins.link.getSelectedLink(c)) {
          d.call(this, b);
          a.selectElement(b);
        }
        this.getContentElement("info", "txtName").focus();
      },
      contents: [
        {
          id: "info",
          label: c.lang.link.anchor.title,
          accessKey: "I",
          elements: [
            {
              type: "text",
              id: "txtName",
              label: c.lang.link.anchor.name,
              required: !0,
              validate: function() {
                if (!this.getValue()) {
                  alert(c.lang.link.anchor.errorName);
                  return !1;
                } else {
                  return !0;
                }
              }
            }
          ]
        }
      ]
    };
  });

}).call(this);
