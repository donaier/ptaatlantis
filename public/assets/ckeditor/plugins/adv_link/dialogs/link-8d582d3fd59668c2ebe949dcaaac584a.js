
/*
@license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or http://ckeditor.com/license
 */

(function() {
  var getParameterByName;

  getParameterByName = function(name, href) {
    var regex, regexS, results;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    regexS = "[\\?&]" + name + "=([^&#]*)";
    regex = new RegExp(regexS);
    results = regex.exec(href);
    if (results == null) {
      return "";
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  };

  CKEDITOR.dialog.add("link", function(editor) {
    var anchorRegex, commitAdvParams, commitParams, commitPopupParams, commonLang, compiledProtectionFunction, emailBodyRegex, emailProtection, emailRegex, emailSubjectRegex, encodedEmailLinkRegex, escapeSingleQuote, functionCallProtectedEmailLinkRegex, getLinkClass, javascriptProtocolRegex, linkLang, linkTypeChanged, parseLink, plugin, popupFeaturesRegex, popupRegex, protectEmailAddressAsEncodedString, protectEmailLinkAsFunction, selectableTargets, setupAdvParams, setupParams, setupPopupParams, targetChanged, unescapeSingleQuote, urlRegex;
    unescapeSingleQuote = function(str) {
      return str.replace(/\\'/g, "'");
    };
    escapeSingleQuote = function(str) {
      return str.replace(/'/g, "\\$&");
    };
    protectEmailLinkAsFunction = function(email) {
      var i, name, paramName, paramValue, params, retval;
      retval = void 0;
      name = compiledProtectionFunction.name;
      params = compiledProtectionFunction.params;
      paramName = void 0;
      paramValue = void 0;
      retval = [name, "("];
      i = 0;
      while (i < params.length) {
        paramName = params[i].toLowerCase();
        paramValue = email[paramName];
        i > 0 && retval.push(",");
        retval.push("'", (paramValue ? escapeSingleQuote(encodeURIComponent(email[paramName])) : ""), "'");
        i++;
      }
      retval.push(")");
      return retval.join("");
    };
    protectEmailAddressAsEncodedString = function(address) {
      var charCode, encodedChars, i, length;
      charCode = void 0;
      length = address.length;
      encodedChars = [];
      i = 0;
      while (i < length) {
        charCode = address.charCodeAt(i);
        encodedChars.push(charCode);
        i++;
      }
      return "String.fromCharCode(" + encodedChars.join(",") + ")";
    };
    getLinkClass = function(ele) {
      var className;
      className = ele.getAttribute("class");
      if (className) {
        return className.replace(/\s*(?:cke_anchor_empty|cke_anchor)(?:\s*$)?/g, "");
      } else {
        return "";
      }
    };
    plugin = CKEDITOR.plugins.link;
    targetChanged = function() {
      var dialog, popupFeatures, targetName, value;
      dialog = this.getDialog();
      popupFeatures = dialog.getContentElement("target", "popupFeatures");
      targetName = dialog.getContentElement("target", "linkTargetName");
      value = this.getValue();
      if (!popupFeatures || !targetName) {
        return;
      }
      popupFeatures = popupFeatures.getElement();
      popupFeatures.hide();
      targetName.setValue("");
      switch (value) {
        case "frame":
          targetName.setLabel(editor.lang.link.targetFrameName);
          return targetName.getElement().show();
        case "popup":
          popupFeatures.show();
          targetName.setLabel(editor.lang.link.targetPopupName);
          return targetName.getElement().show();
        default:
          targetName.setValue(value);
          return targetName.getElement().hide();
      }
    };
    linkTypeChanged = function() {
      var dialog, element, i, partIds, typeValue, uploadInitiallyHidden, uploadTab;
      dialog = this.getDialog();
      partIds = ["urlOptions", "localPageOptions", "anchorOptions", "emailOptions"];
      typeValue = this.getValue();
      uploadTab = dialog.definition.getContents("upload");
      uploadInitiallyHidden = uploadTab && uploadTab.hidden;
      if (typeValue === "url") {
        if (editor.config.linkShowTargetTab) {
          dialog.showPage("target");
        }
        if (!uploadInitiallyHidden) {
          dialog.showPage("upload");
        }
      } else {
        dialog.hidePage("target");
        if (!uploadInitiallyHidden) {
          dialog.hidePage("upload");
        }
      }
      i = 0;
      while (i < partIds.length) {
        element = dialog.getContentElement("info", partIds[i]);
        if (!element) {
          continue;
        }
        element = element.getElement().getParent().getParent();
        if (partIds[i] === typeValue + "Options") {
          element.show();
        } else {
          element.hide();
        }
        i++;
      }
      dialog.layout();
    };
    javascriptProtocolRegex = /^javascript:/;
    emailRegex = /^mailto:([^?]+)(?:\?(.+))?$/;
    emailSubjectRegex = /subject=([^;?:@&=$,\/]*)/;
    emailBodyRegex = /body=([^;?:@&=$,\/]*)/;
    anchorRegex = /^#(.*)$/;
    urlRegex = /^((?:http|https|ftp|news):\/\/)?(.*)$/;
    selectableTargets = /^(_(?:self|top|parent|blank))$/;
    encodedEmailLinkRegex = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/;
    functionCallProtectedEmailLinkRegex = /^javascript:([^(]+)\(([^)]+)\)$/;
    popupRegex = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/;
    popupFeaturesRegex = /(?:^|,)([^=]+)=(\d+|yes|no)/g;
    parseLink = function(editor, element) {
      var advAttr, anchorList, anchorMatch, anchors, bodyMatch, count, email, emailMatch, featureMatch, href, i, imgs, item, javascriptMatch, links, me, onclick, onclickMatch, retval, subjectMatch, target, targetMatch, urlMatch;
      href = (element && (element.data("cke-saved-href") || element.getAttribute("href"))) || "";
      javascriptMatch = void 0;
      emailMatch = void 0;
      anchorMatch = void 0;
      urlMatch = void 0;
      retval = {};
      if (javascriptMatch = href.match(javascriptProtocolRegex)) {
        if (emailProtection === "encode") {
          href = href.replace(encodedEmailLinkRegex, function(match, protectedAddress, rest) {
            return "mailto:" + String.fromCharCode.apply(String, protectedAddress.split(",")) + (rest && unescapeSingleQuote(rest));
          });
        } else if (emailProtection) {
          href.replace(functionCallProtectedEmailLinkRegex, function(match, funcName, funcArgs) {
            var email, i, paramName, paramQuoteRegex, paramRegex, paramVal, paramsMatch, paramsMatchLength;
            if (funcName === compiledProtectionFunction.name) {
              retval.type = "email";
              email = retval.email = {};
              paramRegex = /[^,\s]+/g;
              paramQuoteRegex = /(^')|('$)/g;
              paramsMatch = funcArgs.match(paramRegex);
              paramsMatchLength = paramsMatch.length;
              paramName = void 0;
              paramVal = void 0;
              i = 0;
              while (i < paramsMatchLength) {
                paramVal = decodeURIComponent(unescapeSingleQuote(paramsMatch[i].replace(paramQuoteRegex, "")));
                paramName = compiledProtectionFunction.params[i].toLowerCase();
                email[paramName] = paramVal;
                i++;
              }
              email.address = [email.name, email.domain].join("@");
            }
          });
        }
      }
      if (!retval.type) {
        if (anchorMatch = href.match(anchorRegex)) {
          retval.type = "anchor";
          retval.anchor = {};
          retval.anchor.name = retval.anchor.id = anchorMatch[1];
        } else if (emailMatch = href.match(emailRegex)) {
          subjectMatch = href.match(emailSubjectRegex);
          bodyMatch = href.match(emailBodyRegex);
          retval.type = "email";
          email = (retval.email = {});
          email.address = emailMatch[1];
          subjectMatch && (email.subject = decodeURIComponent(subjectMatch[1]));
          bodyMatch && (email.body = decodeURIComponent(bodyMatch[1]));
        } else if (href && (urlMatch = href.match(urlRegex))) {
          retval.type = "url";
          retval.url = {};
          retval.url.protocol = urlMatch[1];
          retval.url.url = urlMatch[2];
        } else {
          retval.type = "url";
        }
      }
      if (element) {
        target = element.getAttribute("target");
        retval.target = {};
        retval.adv = {};
        if (!target) {
          onclick = element.data("cke-pa-onclick") || element.getAttribute("onclick");
          onclickMatch = onclick && onclick.match(popupRegex);
          if (onclickMatch) {
            retval.target.type = "popup";
            retval.target.name = onclickMatch[1];
            featureMatch = void 0;
            while ((featureMatch = popupFeaturesRegex.exec(onclickMatch[2]))) {
              if ((featureMatch[2] === "yes" || featureMatch[2] === "1") && (featureMatch[1] in {
                height: 1,
                width: 1,
                top: 1,
                left: 1
              })) {
                retval.target[featureMatch[1]] = true;
              } else {
                if (isFinite(featureMatch[2])) {
                  retval.target[featureMatch[1]] = featureMatch[2];
                }
              }
            }
          }
        } else {
          targetMatch = target.match(selectableTargets);
          if (targetMatch) {
            retval.target.type = retval.target.name = target;
          } else {
            retval.target.type = "frame";
            retval.target.name = target;
          }
        }
        me = this;
        advAttr = function(inputName, attrName) {
          var value;
          value = element.getAttribute(attrName);
          if (value !== null) {
            retval.adv[inputName] = value || "";
          }
        };
        advAttr("advId", "id");
        advAttr("advLangDir", "dir");
        advAttr("advAccessKey", "accessKey");
        retval.adv.advName = element.data("cke-saved-name") || element.getAttribute("name") || "";
        advAttr("advLangCode", "lang");
        advAttr("advTabIndex", "tabindex");
        advAttr("advTitle", "title");
        advAttr("advContentType", "type");
        if (CKEDITOR.plugins.link.synAnchorSelector) {
          retval.adv.advCSSClasses = getLinkClass(element);
        } else {
          advAttr("advCSSClasses", "class");
        }
        advAttr("advCharset", "charset");
        advAttr("advStyles", "style");
        advAttr("advRel", "rel");
      }
      anchors = retval.anchors = [];
      i = void 0;
      count = void 0;
      item = void 0;
      if (CKEDITOR.plugins.link.emptyAnchorFix) {
        links = editor.document.getElementsByTag("a");
        i = 0;
        count = links.count();
        while (i < count) {
          item = links.getItem(i);
          if (item.data("cke-saved-name") || item.hasAttribute("name")) {
            anchors.push({
              name: item.data("cke-saved-name") || item.getAttribute("name"),
              id: item.getAttribute("id")
            });
          }
          i++;
        }
      } else {
        anchorList = new CKEDITOR.dom.nodeList(editor.document.$.anchors);
        i = 0;
        count = anchorList.count();
        while (i < count) {
          item = anchorList.getItem(i);
          anchors[i] = {
            name: item.getAttribute("name"),
            id: item.getAttribute("id")
          };
          i++;
        }
      }
      if (CKEDITOR.plugins.link.fakeAnchor) {
        imgs = editor.document.getElementsByTag("img");
        i = 0;
        count = imgs.count();
        while (i < count) {
          if (item = CKEDITOR.plugins.link.tryRestoreFakeAnchor(editor, imgs.getItem(i))) {
            anchors.push({
              name: item.getAttribute("name"),
              id: item.getAttribute("id")
            });
          }
          i++;
        }
      }
      this._.selectedElement = element;
      return retval;
    };
    setupParams = function(page, data) {
      if (data[page]) {
        this.setValue(data[page][this.id] || "");
      }
    };
    setupPopupParams = function(data) {
      return setupParams.call(this, "target", data);
    };
    setupAdvParams = function(data) {
      return setupParams.call(this, "adv", data);
    };
    commitParams = function(page, data) {
      if (!data[page]) {
        data[page] = {};
      }
      data[page][this.id] = this.getValue() || "";
    };
    commitPopupParams = function(data) {
      return commitParams.call(this, "target", data);
    };
    commitAdvParams = function(data) {
      return commitParams.call(this, "adv", data);
    };
    emailProtection = editor.config.emailProtection || "";
    if (emailProtection && emailProtection !== "encode") {
      compiledProtectionFunction = {};
      emailProtection.replace(/^([^(]+)\(([^)]+)\)$/, function(match, funcName, params) {
        compiledProtectionFunction.name = funcName;
        compiledProtectionFunction.params = [];
        params.replace(/[^,\s]+/g, function(param) {
          compiledProtectionFunction.params.push(param);
        });
      });
    }
    commonLang = editor.lang.common;
    linkLang = editor.lang.adv_link;
    return {
      title: linkLang.title,
      minWidth: 350,
      minHeight: 230,
      contents: [
        {
          id: "info",
          label: linkLang.info,
          title: linkLang.info,
          elements: [
            {
              id: "linkType",
              type: "select",
              label: linkLang.type,
              "default": "url",
              items: [[linkLang.toUrl, "url"], [linkLang.localPages, "localPage"], [linkLang.toAnchor, "anchor"], [linkLang.toEmail, "email"]],
              onChange: linkTypeChanged,
              setup: function(data) {
                if (data.type) {
                  this.setValue(data.type);
                }
              },
              commit: function(data) {
                data.type = this.getValue();
              }
            }, {
              type: "vbox",
              id: "localPageOptions",
              children: [
                {
                  type: "select",
                  label: linkLang.selectPageLabel,
                  id: "localPage",
                  title: linkLang.selectPageTitle,
                  items: [],
                  onLoad: function(element) {
                    var element_id;
                    element_id = "#" + this.getInputElement().$.id;
                    $.ajax({
                      type: "GET",
                      url: "/" + getParameterByName("content_locale", document.location.href) + "/api/pages.json",
                      dataType: "json",
                      async: false,
                      success: function(data) {
                        $.each(data, function(index, item) {
                          $(element_id).get(0).options[$(element_id).get(0).options.length] = new Option(decodeURIComponent(item.title) + ': ' + item.pretty_url, item.url);
                        });
                      },
                      error: function(xhr, ajaxOptions, thrownError) {
                        alert(xhr.status);
                        alert(thrownError);
                      }
                    });
                  },
                  commit: function(data) {
                    if (!data.localPage) {
                      data.localPage = {};
                    }
                    data.localPage = this.getValue();
                  }
                }
              ]
            }, {
              type: "vbox",
              id: "urlOptions",
              children: [
                {
                  type: "hbox",
                  widths: ["25%", "75%"],
                  children: [
                    {
                      id: "protocol",
                      type: "select",
                      label: commonLang.protocol,
                      "default": "http://",
                      items: [["http://‎", "http://"], ["https://‎", "https://"], ["ftp://‎", "ftp://"], ["news://‎", "news://"], [linkLang.other, ""]],
                      setup: function(data) {
                        if (data.url) {
                          this.setValue(data.url.protocol || "");
                        }
                      },
                      commit: function(data) {
                        if (!data.url) {
                          data.url = {};
                        }
                        data.url.protocol = this.getValue();
                      }
                    }, {
                      type: "text",
                      id: "url",
                      label: commonLang.url,
                      required: true,
                      onLoad: function() {
                        this.allowOnChange = true;
                      },
                      onKeyUp: function() {
                        var protocol, protocolCmb, url, urlOnChangeProtocol, urlOnChangeTestOther;
                        this.allowOnChange = false;
                        protocolCmb = this.getDialog().getContentElement("info", "protocol");
                        url = this.getValue();
                        urlOnChangeProtocol = /^(http|https|ftp|news):\/\/(?=.)/i;
                        urlOnChangeTestOther = /^((javascript:)|[#\/\.\?])/i;
                        protocol = urlOnChangeProtocol.exec(url);
                        if (protocol) {
                          this.setValue(url.substr(protocol[0].length));
                          protocolCmb.setValue(protocol[0].toLowerCase());
                        } else {
                          if (urlOnChangeTestOther.test(url)) {
                            protocolCmb.setValue("");
                          }
                        }
                        this.allowOnChange = true;
                      },
                      onChange: function() {
                        if (this.allowOnChange) {
                          this.onKeyUp();
                        }
                      },
                      validate: function() {
                        var dialog, func;
                        dialog = this.getDialog();
                        if (dialog.getContentElement("info", "linkType") && dialog.getValueOf("info", "linkType") !== "url") {
                          return true;
                        }
                        if (/javascript\:/.test(this.getValue())) {
                          alert(commonLang.invalidValue);
                          return false;
                        }
                        if (this.getDialog().fakeObj) {
                          return true;
                        }
                        func = CKEDITOR.dialog.validate.notEmpty(linkLang.noUrl);
                        return func.apply(this);
                      },
                      setup: function(data) {
                        this.allowOnChange = false;
                        if (data.url) {
                          this.setValue(data.url.url);
                        }
                        this.allowOnChange = true;
                      },
                      commit: function(data) {
                        this.onChange();
                        if (!data.url) {
                          data.url = {};
                        }
                        data.url.url = this.getValue();
                        this.allowOnChange = false;
                      }
                    }
                  ],
                  setup: function(data) {
                    if (!this.getDialog().getContentElement("info", "linkType")) {
                      this.getElement().show();
                    }
                  }
                }, {
                  type: "button",
                  id: "browse",
                  hidden: "true",
                  filebrowser: "info:url",
                  label: commonLang.browseServer
                }
              ]
            }, {
              type: "vbox",
              id: "anchorOptions",
              width: 260,
              align: "center",
              padding: 0,
              children: [
                {
                  type: "fieldset",
                  id: "selectAnchorText",
                  label: linkLang.selectAnchor,
                  setup: function(data) {
                    if (data.anchors.length > 0) {
                      this.getElement().show();
                    } else {
                      this.getElement().hide();
                    }
                  },
                  children: [
                    {
                      type: "hbox",
                      id: "selectAnchor",
                      children: [
                        {
                          type: "select",
                          id: "anchorName",
                          "default": "",
                          label: linkLang.anchorName,
                          style: "width: 100%;",
                          items: [[""]],
                          setup: function(data) {
                            var i, linkType;
                            this.clear();
                            this.add("");
                            i = 0;
                            while (i < data.anchors.length) {
                              if (data.anchors[i].name) {
                                this.add(data.anchors[i].name);
                              }
                              i++;
                            }
                            if (data.anchor) {
                              this.setValue(data.anchor.name);
                            }
                            linkType = this.getDialog().getContentElement("info", "linkType");
                            if (linkType && linkType.getValue() === "email") {
                              this.focus();
                            }
                          },
                          commit: function(data) {
                            if (!data.anchor) {
                              data.anchor = {};
                            }
                            data.anchor.name = this.getValue();
                          }
                        }, {
                          type: "select",
                          id: "anchorId",
                          "default": "",
                          label: linkLang.anchorId,
                          style: "width: 100%;",
                          items: [[""]],
                          setup: function(data) {
                            var i;
                            this.clear();
                            this.add("");
                            i = 0;
                            while (i < data.anchors.length) {
                              if (data.anchors[i].id) {
                                this.add(data.anchors[i].id);
                              }
                              i++;
                            }
                            if (data.anchor) {
                              this.setValue(data.anchor.id);
                            }
                          },
                          commit: function(data) {
                            if (!data.anchor) {
                              data.anchor = {};
                            }
                            data.anchor.id = this.getValue();
                          }
                        }
                      ],
                      setup: function(data) {
                        if (data.anchors.length > 0) {
                          this.getElement().show();
                        } else {
                          this.getElement().hide();
                        }
                      }
                    }
                  ]
                }, {
                  type: "html",
                  id: "noAnchors",
                  style: "text-align: center;",
                  html: "<div role=\"note\" tabIndex=\"-1\">" + CKEDITOR.tools.htmlEncode(linkLang.noAnchors) + "</div>",
                  focus: true,
                  setup: function(data) {
                    if (data.anchors.length < 1) {
                      this.getElement().show();
                    } else {
                      this.getElement().hide();
                    }
                  }
                }
              ],
              setup: function(data) {
                if (!this.getDialog().getContentElement("info", "linkType")) {
                  this.getElement().hide();
                }
              }
            }, {
              type: "vbox",
              id: "emailOptions",
              padding: 1,
              children: [
                {
                  type: "text",
                  id: "emailAddress",
                  label: linkLang.emailAddress,
                  required: true,
                  validate: function() {
                    var dialog, func;
                    dialog = this.getDialog();
                    if (!dialog.getContentElement("info", "linkType") || dialog.getValueOf("info", "linkType") !== "email") {
                      return true;
                    }
                    func = CKEDITOR.dialog.validate.notEmpty(linkLang.noEmail);
                    return func.apply(this);
                  },
                  setup: function(data) {
                    var linkType;
                    if (data.email) {
                      this.setValue(data.email.address);
                    }
                    linkType = this.getDialog().getContentElement("info", "linkType");
                    if (linkType && linkType.getValue() === "email") {
                      this.select();
                    }
                  },
                  commit: function(data) {
                    if (!data.email) {
                      data.email = {};
                    }
                    data.email.address = this.getValue();
                  }
                }, {
                  type: "text",
                  id: "emailSubject",
                  label: linkLang.emailSubject,
                  setup: function(data) {
                    if (data.email) {
                      this.setValue(data.email.subject);
                    }
                  },
                  commit: function(data) {
                    if (!data.email) {
                      data.email = {};
                    }
                    data.email.subject = this.getValue();
                  }
                }, {
                  type: "textarea",
                  id: "emailBody",
                  label: linkLang.emailBody,
                  rows: 3,
                  "default": "",
                  setup: function(data) {
                    if (data.email) {
                      this.setValue(data.email.body);
                    }
                  },
                  commit: function(data) {
                    if (!data.email) {
                      data.email = {};
                    }
                    data.email.body = this.getValue();
                  }
                }
              ],
              setup: function(data) {
                if (!this.getDialog().getContentElement("info", "linkType")) {
                  this.getElement().hide();
                }
              }
            }
          ]
        }, {
          id: "target",
          requiredContent: "a[target]",
          label: linkLang.target,
          title: linkLang.target,
          elements: [
            {
              type: "hbox",
              widths: ["50%", "50%"],
              children: [
                {
                  type: "select",
                  id: "linkTargetType",
                  label: commonLang.target,
                  "default": "notSet",
                  style: "width : 100%;",
                  items: [[commonLang.notSet, "notSet"], [linkLang.targetFrame, "frame"], [linkLang.targetPopup, "popup"], [commonLang.targetNew, "_blank"], [commonLang.targetTop, "_top"], [commonLang.targetSelf, "_self"], [commonLang.targetParent, "_parent"]],
                  onChange: targetChanged,
                  setup: function(data) {
                    if (data.target) {
                      this.setValue(data.target.type || "notSet");
                    }
                    targetChanged.call(this);
                  },
                  commit: function(data) {
                    if (!data.target) {
                      data.target = {};
                    }
                    data.target.type = this.getValue();
                  }
                }, {
                  type: "text",
                  id: "linkTargetName",
                  label: linkLang.targetFrameName,
                  "default": "",
                  setup: function(data) {
                    if (data.target) {
                      this.setValue(data.target.name);
                    }
                  },
                  commit: function(data) {
                    if (!data.target) {
                      data.target = {};
                    }
                    data.target.name = this.getValue().replace(/\W/g, "");
                  }
                }
              ]
            }, {
              type: "vbox",
              width: "100%",
              align: "center",
              padding: 2,
              id: "popupFeatures",
              children: [
                {
                  type: "fieldset",
                  label: linkLang.popupFeatures,
                  children: [
                    {
                      type: "hbox",
                      children: [
                        {
                          type: "checkbox",
                          id: "resizable",
                          label: linkLang.popupResizable,
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }, {
                          type: "checkbox",
                          id: "status",
                          label: linkLang.popupStatusBar,
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }
                      ]
                    }, {
                      type: "hbox",
                      children: [
                        {
                          type: "checkbox",
                          id: "location",
                          label: linkLang.popupLocationBar,
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }, {
                          type: "checkbox",
                          id: "toolbar",
                          label: linkLang.popupToolbar,
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }
                      ]
                    }, {
                      type: "hbox",
                      children: [
                        {
                          type: "checkbox",
                          id: "menubar",
                          label: linkLang.popupMenuBar,
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }, {
                          type: "checkbox",
                          id: "fullscreen",
                          label: linkLang.popupFullScreen,
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }
                      ]
                    }, {
                      type: "hbox",
                      children: [
                        {
                          type: "checkbox",
                          id: "scrollbars",
                          label: linkLang.popupScrollBars,
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }, {
                          type: "checkbox",
                          id: "dependent",
                          label: linkLang.popupDependent,
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }
                      ]
                    }, {
                      type: "hbox",
                      children: [
                        {
                          type: "text",
                          widths: ["50%", "50%"],
                          labelLayout: "horizontal",
                          label: commonLang.width,
                          id: "width",
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }, {
                          type: "text",
                          labelLayout: "horizontal",
                          widths: ["50%", "50%"],
                          label: linkLang.popupLeft,
                          id: "left",
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }
                      ]
                    }, {
                      type: "hbox",
                      children: [
                        {
                          type: "text",
                          labelLayout: "horizontal",
                          widths: ["50%", "50%"],
                          label: commonLang.height,
                          id: "height",
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }, {
                          type: "text",
                          labelLayout: "horizontal",
                          label: linkLang.popupTop,
                          widths: ["50%", "50%"],
                          id: "top",
                          setup: setupPopupParams,
                          commit: commitPopupParams
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }, {
          id: "upload",
          label: linkLang.upload,
          title: linkLang.upload,
          hidden: true,
          filebrowser: "uploadButton",
          elements: [
            {
              type: "file",
              id: "upload",
              label: commonLang.upload,
              style: "height:40px",
              size: 29
            }, {
              type: "fileButton",
              id: "uploadButton",
              label: commonLang.uploadSubmit,
              filebrowser: "info:url",
              "for": ["upload", "upload"]
            }
          ]
        }, {
          id: "advanced",
          label: linkLang.advanced,
          title: linkLang.advanced,
          elements: [
            {
              type: "vbox",
              padding: 1,
              children: [
                {
                  type: "hbox",
                  widths: ["45%", "35%", "20%"],
                  children: [
                    {
                      type: "text",
                      id: "advId",
                      requiredContent: "a[id]",
                      label: linkLang.id,
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }, {
                      type: "select",
                      id: "advLangDir",
                      requiredContent: "a[dir]",
                      label: linkLang.langDir,
                      "default": "",
                      style: "width:110px",
                      items: [[commonLang.notSet, ""], [linkLang.langDirLTR, "ltr"], [linkLang.langDirRTL, "rtl"]],
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }, {
                      type: "text",
                      id: "advAccessKey",
                      requiredContent: "a[accesskey]",
                      width: "80px",
                      label: linkLang.acccessKey,
                      maxLength: 1,
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }
                  ]
                }, {
                  type: "hbox",
                  widths: ["45%", "35%", "20%"],
                  children: [
                    {
                      type: "text",
                      label: linkLang.name,
                      id: "advName",
                      requiredContent: "a[name]",
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }, {
                      type: "text",
                      label: linkLang.langCode,
                      id: "advLangCode",
                      requiredContent: "a[lang]",
                      width: "110px",
                      "default": "",
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }, {
                      type: "text",
                      label: linkLang.tabIndex,
                      id: "advTabIndex",
                      requiredContent: "a[tabindex]",
                      width: "80px",
                      maxLength: 5,
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }
                  ]
                }
              ]
            }, {
              type: "vbox",
              padding: 1,
              children: [
                {
                  type: "hbox",
                  widths: ["45%", "55%"],
                  children: [
                    {
                      type: "text",
                      label: linkLang.advisoryTitle,
                      requiredContent: "a[title]",
                      "default": "",
                      id: "advTitle",
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }, {
                      type: "text",
                      label: linkLang.advisoryContentType,
                      requiredContent: "a[type]",
                      "default": "",
                      id: "advContentType",
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }
                  ]
                }, {
                  type: "hbox",
                  widths: ["45%", "55%"],
                  children: [
                    {
                      type: "text",
                      label: linkLang.cssClasses,
                      requiredContent: "a(cke-xyz)",
                      "default": "",
                      id: "advCSSClasses",
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }, {
                      type: "text",
                      label: linkLang.charset,
                      requiredContent: "a[charset]",
                      "default": "",
                      id: "advCharset",
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }
                  ]
                }, {
                  type: "hbox",
                  widths: ["45%", "55%"],
                  children: [
                    {
                      type: "text",
                      label: linkLang.rel,
                      requiredContent: "a[rel]",
                      "default": "",
                      id: "advRel",
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }, {
                      type: "text",
                      label: linkLang.styles,
                      requiredContent: "a{cke-xyz}",
                      "default": "",
                      id: "advStyles",
                      validate: CKEDITOR.dialog.validate.inlineStyle(editor.lang.common.invalidInlineStyle),
                      setup: setupAdvParams,
                      commit: commitAdvParams
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      onShow: function() {
        var element, selection;
        editor = this.getParentEditor();
        selection = editor.getSelection();
        element = null;
        if ((element = plugin.getSelectedLink(editor)) && element.hasAttribute("href")) {
          selection.selectElement(element);
        } else {
          element = null;
        }
        this.setupContent(parseLink.apply(this, [editor, element]));
      },
      onOk: function() {
        var addFeature, address, advAttr, argList, attributes, body, data, element, email, featureLength, featureList, href, i, id, linkHref, me, name, nameAndDomain, onclickList, protocol, range, removeAttributes, selection, style, subject, text, textView, url;
        attributes = {};
        removeAttributes = [];
        data = {};
        me = this;
        editor = this.getParentEditor();
        this.commitContent(data);
        switch (data.type || "url") {
          case "url":
            protocol = (data.url && data.url.protocol !== undefined ? data.url.protocol : "http://");
            url = (data.url && CKEDITOR.tools.trim(data.url.url)) || "";
            attributes["data-cke-saved-href"] = (url.indexOf("/") === 0 ? url : protocol + url);
            break;
          case "localPage":
            attributes["data-cke-saved-href"] = data.localPage;
            break;
          case "anchor":
            name = data.anchor && data.anchor.name;
            id = data.anchor && data.anchor.id;
            attributes["data-cke-saved-href"] = "#" + (name || id || "");
            break;
          case "email":
            linkHref = void 0;
            email = data.email;
            address = email.address;
            switch (emailProtection) {
              case "":
              case "encode":
                subject = encodeURIComponent(email.subject || "");
                body = encodeURIComponent(email.body || "");
                argList = [];
                subject && argList.push("subject=" + subject);
                body && argList.push("body=" + body);
                argList = (argList.length ? "?" + argList.join("&") : "");
                if (emailProtection === "encode") {
                  linkHref = ["javascript:void(location.href='mailto:'+", protectEmailAddressAsEncodedString(address)];
                  argList && linkHref.push("+'", escapeSingleQuote(argList), "'");
                  linkHref.push(")");
                } else {
                  linkHref = ["mailto:", address, argList];
                }
                break;
              default:
                nameAndDomain = address.split("@", 2);
                email.name = nameAndDomain[0];
                email.domain = nameAndDomain[1];
                linkHref = ["javascript:", protectEmailLinkAsFunction(email)];
            }
            attributes["data-cke-saved-href"] = linkHref.join("");
        }
        if (data.target) {
          if (data.target.type === "popup") {
            onclickList = ["window.open(this.href, '", data.target.name || "", "', '"];
            featureList = ["resizable", "status", "location", "toolbar", "menubar", "fullscreen", "scrollbars", "dependent"];
            featureLength = featureList.length;
            addFeature = function(featureName) {
              if (data.target[featureName]) {
                featureList.push(featureName + "=" + data.target[featureName]);
              }
            };
            i = 0;
            while (i < featureLength) {
              featureList[i] = featureList[i] + (data.target[featureList[i]] ? "=yes" : "=no");
              i++;
            }
            addFeature("width");
            addFeature("left");
            addFeature("height");
            addFeature("top");
            onclickList.push(featureList.join(","), "'); return false;");
            attributes["data-cke-pa-onclick"] = onclickList.join("");
            removeAttributes.push("target");
          } else {
            if (data.target.type !== "notSet" && data.target.name) {
              attributes.target = data.target.name;
            } else {
              removeAttributes.push("target");
            }
            removeAttributes.push("data-cke-pa-onclick", "onclick");
          }
        }
        if (data.adv) {
          advAttr = function(inputName, attrName) {
            var value;
            value = data.adv[inputName];
            if (value) {
              attributes[attrName] = value;
            } else {
              removeAttributes.push(attrName);
            }
          };
          advAttr("advId", "id");
          advAttr("advLangDir", "dir");
          advAttr("advAccessKey", "accessKey");
          if (data.adv["advName"]) {
            attributes["name"] = attributes["data-cke-saved-name"] = data.adv["advName"];
          } else {
            removeAttributes = removeAttributes.concat(["data-cke-saved-name", "name"]);
          }
          advAttr("advLangCode", "lang");
          advAttr("advTabIndex", "tabindex");
          advAttr("advTitle", "title");
          advAttr("advContentType", "type");
          advAttr("advCSSClasses", "class");
          advAttr("advCharset", "charset");
          advAttr("advStyles", "style");
          advAttr("advRel", "rel");
        }
        selection = editor.getSelection();
        attributes.href = attributes["data-cke-saved-href"];
        if (!this._.selectedElement) {
          range = selection.getRanges(1)[0];
          if (range.collapsed) {
            text = new CKEDITOR.dom.text((data.type === "email" ? data.email.address : attributes["data-cke-saved-href"]), editor.document);
            range.insertNode(text);
            range.selectNodeContents(text);
          }
          style = new CKEDITOR.style({
            element: "a",
            attributes: attributes
          });
          style.type = CKEDITOR.STYLE_INLINE;
          style.applyToRange(range);
          range.select();
        } else {
          element = this._.selectedElement;
          href = element.data("cke-saved-href");
          textView = element.getHtml();
          element.setAttributes(attributes);
          element.removeAttributes(removeAttributes);
          if (data.adv && data.adv.advName && CKEDITOR.plugins.link.synAnchorSelector) {
            element.addClass((element.getChildCount() ? "cke_anchor" : "cke_anchor_empty"));
          }
          if (href === textView || data.type === "email" && textView.indexOf("@") !== -1) {
            element.setHtml((data.type === "email" ? data.email.address : attributes["data-cke-saved-href"]));
          }
          selection.selectElement(element);
          delete this._.selectedElement;
        }
      },
      onLoad: function() {
        if (!editor.config.linkShowAdvancedTab) {
          this.hidePage("advanced");
        }
        if (!editor.config.linkShowTargetTab) {
          this.hidePage("target");
        }
      },
      onFocus: function() {
        var linkType, urlField;
        linkType = this.getContentElement("info", "linkType");
        urlField = void 0;
        if (linkType && linkType.getValue() === "url") {
          urlField = this.getContentElement("info", "url");
          urlField.select();
        }
      }
    };
  });

}).call(this);
