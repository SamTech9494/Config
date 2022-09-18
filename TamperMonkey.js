// ==UserScript==
// @name ArtemisQuickSelector
// @namespace http://XX.net/
// @version 2.2.0
// @description quick select artemis db
// @author You
// @icon https://s3-ap-southeast-1.amazonaws.com/ojmp-data/53404e214fcb064cbd9d200b8bf318eb/titansoft.png
// @include http://dba-sb-prod.coreop.net/*
// @include http://dba-ph-prod.coreop.net/*
// @include http://dba-xt-prod.coreop.net/*
// @include http://dba-stg.coreop.net/*

// @grant none
// ==/UserScript==

(function () {
    "use strict";
    var QueryDbShortCut = localStorage.getItem("QueryDbShortCut");
    var DatabaseSearchFeature = localStorage.getItem("DatabaseSearchFeature");
    var isNeedAutoComplete = localStorage.getItem("isNeedAutoComplete");
    var CountFeature = localStorage.getItem("CountFeature");
    var OrderFeature = localStorage.getItem("OrderFeature");
    var SideBarShortCut = localStorage.getItem("SideBarShortCut");
    var SimpleSettingShortCut = localStorage.getItem("SimpleSettingShortCut");
    $(document).keydown(function (e) {
        // Ctrl-Enter pressed
        if (e.keyCode == 13 && e.ctrlKey) {
            document.getElementById("btnSubmit").click();
        }
    });

    $("#insert").click(() => OrderBy());
    if (!localStorage.getItem("orderByConfig")) {
        localStorage.setItem("orderByConfig", [
            "CreatedOn",
            "TransStartDate",
            "creatdate",
            "TransactionStartedOn",
        ]);
    }

    function changeDB(dbName) {
        var myselect = document.getElementById("Database");
        myselect.options[0] = new Option(dbName, dbName);
        myselect.options[0].selected = true;
        $("#searchDB").val(dbName);
        $("#searchTable").val("");
        $("#searchTable").trigger("change");
        $("#Database").trigger("change");
    }

    function changeDBAndTable(dbName, tableName, queryValue) {
        var myselect = document.getElementById("Database");
        myselect.options[0] = new Option(dbName, dbName);
        myselect.options[0].selected = true;
        $("#searchDB").val(dbName);
        var tableSelect = document.getElementById("Table");
        tableSelect.options[0] = new Option(tableName, tableName);
        tableSelect.options[0].selected = true;
        $("#Table").trigger("change");
        $("#searchTable").val(tableName);
        window.editor.setValue(queryValue);
        setTimeout(function () {
            OrderBy();
        }, 500);
    }

    //-------------------------Delete Table-------------------------
    function DeleteTable(id) {
        var config = JSON.parse(localStorage.getItem("sbDbConfig"));
        for (var i = 0; i < config.length; i++) {
            if (config[i].Id == id) {
                config.splice(i, 1);
            }
        }
        localStorage.setItem("sbDbConfig", JSON.stringify(config));
        alert("delete db config success");
        location.reload();
    }

    //-------------------------Delete Table-------------------------

    function setSqlHint() {
        selectArr = [];
        for (
            var i = 0;
            i < document.querySelector(".DT tr:nth-child(8) select").length;
            i++
        ) {
            var column = document
                .querySelector(".DT tr:nth-child(8) select")
                [i].value.toString();
            myCar[column] = [];
            selectArr.push(myCar);
        }

        var da = JSON.stringify(selectArr).replace(/[{}]/g, "").substr(1);
        var result1 = da.substr(0, da.length - 1);

        setTimeout(function () {
            window.editor.setOption("hintOptions", {
                tables: JSON.parse("{" + result1 + "}"),
            });
        }, 300);
    }

    function debounce(fn, wait) {
        var timeout = null;
        return function () {
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(fn, wait);
        };
    }

    function setSbDbConfig() {
        var config = JSON.parse(localStorage.getItem("sbDbConfig"));
        console.log(config);
        var queryValue = window.editor.getValue();
        console.log();
        var maxCount =
            localStorage.getItem("configCount") == null
                ? 0
                : localStorage.getItem("configCount");
        var nextCount = parseInt(maxCount) + 1;
        if (!config) {
            localStorage.setItem(
                "sbDbConfig",
                JSON.stringify([
                    {
                        DB: document.querySelector("#searchDB").value,
                        Table: document.querySelector("#searchTable").value,
                        Id: `Id${nextCount}`,
                        Query: queryValue,
                    },
                ])
            );
        } else {
            maxCount = config.length;
            config.push({
                DB: document.querySelector("#searchDB").value,
                Table: document.querySelector("#searchTable").value,
                Id: `Id${nextCount}`,
                Query: queryValue,
            });
            console.log(config);
            localStorage.setItem("sbDbConfig", JSON.stringify(config));
        }
        localStorage.setItem("configCount", nextCount);
        alert("add db config success");
    }

    function setOrderByConfig() {
        var orderByKey = prompt("insert order key");
        if (!orderByKey) {
            return;
        }
        var storedOrderKey = localStorage.getItem("orderByConfig").split(",");
        storedOrderKey.push(orderByKey);
        localStorage.setItem("orderByConfig", storedOrderKey);
        alert("add order config success");
    }

    function groupBy(array, f) {
        let groups = {};
        array.forEach(function (o) {
            let group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        });
    }

    function css(path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.href = path;
        link.rel = "stylesheet";
        link.type = "text/css";
        head.appendChild(link);
    }

    function alertt() {
        console.log("QQ");
    }

    function changeDBForAppSetting(dbName, project) {
        var myselect = document.getElementById("database");
        myselect.options[0] = new Option(dbName, dbName);
        myselect.options[0].selected = true;
        $("#database").trigger("change");
        document.getElementById("website").value = project;
        document.getElementById("btnList").click();
    }

    //--------------------------Feature toggle------------------
    element = $("#btnExit")[0].parentNode;
    element.setAttribute("style", "display:flex;align-items: center");

    var featuretoggle =
        '<!-- Button trigger modal -->\
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">\
      Artemis Feature Toggle\
      </button>\
      \
      <!-- Modal -->\
      <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">\
      <div class="modal-dialog modal-dialog-centered" role="document">\
      <div class="modal-content">\
      <div class="modal-header">\
      <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>\
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
      <span aria-hidden="true">&times;</span>\
      </button>\
      </div>\
      <div class="modal-body">\
      <div>Query Db short cut : <input class="form-check-input" type="checkbox" id="QueryDbShortCut"></div>\
      <div>DatabaseSearchFeature : <input class="form-check-input" type="checkbox" id="DatabaseSearchFeature"></div>\
      <div>AutoComplete : <input class="form-check-input" type="checkbox" id="AutoComplete"></div>\
      <div>CountFeature : <input class="form-check-input" type="checkbox" id="CountFeature"></div>\
      <div>OrderFeature : <input class="form-check-input" type="checkbox" id="OrderFeature"></div>\
      <div>SideBarShortCut : <input class="form-check-input" type="checkbox" id="SideBarShortCut"></div>\
      <div>SimpleSettingShortCut : <input class="form-check-input" type="checkbox" id="SimpleSettingShortCut"></div>\
      </div>\
      <div class="modal-footer">\
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>\
      <button type="button" id="saveChange" class="btn btn-primary">Save changes</button>\
      </div>\
      </div>\
      </div>\
      </div>';
    try {
        new_elem = document.createElement("div");
        new_elem.innerHTML = featuretoggle;
        element = $("#content")[0];
        element.parentNode.insertBefore(new_elem, element);
    } catch (e) {
    }

    if (QueryDbShortCut == null) {
        localStorage.setItem("QueryDbShortCut", "true");
    }
    if (DatabaseSearchFeature == null) {
        localStorage.setItem("DatabaseSearchFeature", "true");
    }
    if (isNeedAutoComplete == null) {
        localStorage.setItem("isNeedAutoComplete", "true");
    }
    if (CountFeature == null) {
        localStorage.setItem("CountFeature", "true");
    }
    if (OrderFeature == null) {
        localStorage.setItem("OrderFeature", "true");
    }
    if (SideBarShortCut == null) {
        localStorage.setItem("SideBarShortCut", "true");
    }
    if (SimpleSettingShortCut == null) {
        localStorage.setItem("SimpleSettingShortCut", "true");
    }

    $("#QueryDbShortCut").prop("checked", QueryDbShortCut == "true");
    $("#AutoComplete").prop("checked", isNeedAutoComplete == "true");
    $("#CountFeature").prop("checked", CountFeature == "true");
    $("#OrderFeature").prop("checked", OrderFeature == "true");
    $("#SideBarShortCut").prop("checked", SideBarShortCut == "true");
    $("#SimpleSettingShortCut").prop("checked", SimpleSettingShortCut == "true");
    $("#DatabaseSearchFeature").prop("checked", DatabaseSearchFeature == "true");

    var saveChange = document.querySelector("#saveChange");
    if (saveChange) {
        saveChange.addEventListener(
            "click",
            function () {
                localStorage.setItem(
                    "QueryDbShortCut",
                    $("#QueryDbShortCut:checked").val() == "on"
                );
                localStorage.setItem(
                    "DatabaseSearchFeature",
                    $("#DatabaseSearchFeature:checked").val() == "on"
                );

                localStorage.setItem(
                    "isNeedAutoComplete",
                    $("#AutoComplete:checked").val() == "on"
                );

                localStorage.setItem(
                    "CountFeature",
                    $("#CountFeature:checked").val() == "on"
                );

                localStorage.setItem(
                    "OrderFeature",
                    $("#OrderFeature:checked").val() == "on"
                );

                localStorage.setItem(
                    "SideBarShortCut",
                    $("#SideBarShortCut:checked").val() == "on"
                );

                localStorage.setItem(
                    "SimpleSettingShortCut",
                    $("#SimpleSettingShortCut:checked").val() == "on"
                );
                location.reload();
            },
            false
        );
    }

    //--------------------------Feature toggle------------------

    var new_elem = document.createElement("div");

    if (
        (window.location.hostname == "dba-sb-prod.coreop.net" ||
            window.location.hostname == "dba-stg.coreop.net") &&
        QueryDbShortCut == "true"
    ) {
        //--------------------setSbDbConfig-----------------------
        try {
            document
                .querySelector("#btnSaveQuery")
                .insertAdjacentHTML(
                    "afterend",
                    "<button id='saveTable' style='margin-left:4px' class='btn btn-primary btn-sm'>Save Table With Current Order Query</button>" +
                    "<button id='EnumTranslator' style='margin-left:4px;display:none' class='btn btn-primary btn-sm'>Enum Translator</button>" +
                    "<button id='ObjectConvertor' style='margin-left:4px;display:' class='btn btn-primary btn-sm'>Object Convertor</button>"
                );
            document
                .querySelector(`#saveTable`)
                .addEventListener("click", function () {
                    setSbDbConfig();
                });


            document
                .querySelector(`#EnumTranslator`)
                .addEventListener("click", function () {
                    appendValueAfterEnum();
                });

            document
                .querySelector(`#ObjectConvertor`)
                .addEventListener("click", function () {
                    ConvertObject();
                });
        } catch (e) {
        }

        //--------------------setSbDbConfig-----------------------

        //-------------------------add element for db and table start----------------------------------

        try {
            var classArray = ["PageHeader.B", "page-header"];
            classArray.forEach(function (item, index, array) {
                if (
                    document.getElementsByClassName("page-header")[0].children[0]
                        .innerText == "Simple Settings" &&
                    item !== "PageHeader.B"
                ) {
                    document
                        .querySelector(`.${item}`)
                        .insertAdjacentHTML(
                            "afterend",
                            '<div style="margin-bottom:10px"><span class="siren btn btn-primary">Siren</span> <span class="pavo btn btn-primary">Pavo</span> <span class="pan btn btn-primary" > Pan</span > </div>'
                        );
                    return;
                }
                new_elem.innerHTML = dbGroup;
                var dbGroup = "";

                var sbDbConfig = JSON.parse(localStorage.getItem("sbDbConfig"));

                let groupDbConfig = groupBy(sbDbConfig, function (item) {
                    return [item.DB];
                });
                try {
                    dbGroup += "<div>";
                    groupDbConfig.forEach((item) => {
                        dbGroup +=
                            '<div class="btn-group" style="margin:0 10px 5px 0"> <button type="button" class="btn btn-primary ' +
                            item[0].Id +
                            '">' +
                            item[0].DB +
                            '</button>\
                                <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">\
                                    <span class="caret"></span>  <span class="sr-only">Toggle Dropdown</span>\
                                </button>\
                                <ul class="dropdown-menu" role="menu">';
                        item.forEach((child) => {
                            dbGroup +=
                                '<li><a href="#" class = "' +
                                item[0].Id +
                                child.Table +
                                '">' +
                                child.Table +
                                "<button type='button' id='deleteTable" +
                                child.Id +
                                "' class='btn btn-danger' style='font-size: 10px;height: 20px;width: 50px;padding: 0px;margin-left: 10px;'>Delete</button>" +
                                "</a>" +
                                "</li>";
                        });
                        dbGroup += "</ul>\
				  </div>";
                    });
                    dbGroup += "</div>";
                    if (document.querySelector(`.${item}`).classList.contains("Font16")) {
                        return;
                    }
                    document
                        .querySelector(`.${item}`)
                        .insertAdjacentHTML("afterend", dbGroup);

                    groupDbConfig.forEach((item) => {
                        item.forEach((child) => {
                            document
                                .querySelector(`#deleteTable${child.Id}`)
                                .addEventListener("click", function () {
                                    DeleteTable(`${child.Id}`);
                                });
                        });
                    });
                } catch (error) {
                    console.log("delete table error: " + error);
                }
            });
        } catch (e) {
            //-------------------------add element for db and table end----------------------------------

            console.log(`select db error e:${e}`);
        }

        try {
            var dbConfig = JSON.parse(localStorage.getItem("sbDbConfig"));
            let groupDbConfig = groupBy(dbConfig, function (item) {
                return [item.DB];
            });
            console.log("groupDbConfig:  ");
            console.log(groupDbConfig);
            groupDbConfig.forEach((item) => {
                item.forEach((child) => {
                    document
                        .querySelector(`.${item[0].Id}`)
                        .addEventListener("click", function () {
                            changeDB(`${item[0].DB}`);
                        });
                    document
                        .querySelector(`.${item[0].Id}${child.Table}`)
                        .addEventListener("click", function () {
                            changeDBAndTable(`${item[0].DB}`, child.Table, child.Query);
                        });
                });
            });
        } catch (error) {
            console.log("add event listener error: " + error);
        }
    } else if (
        window.location.hostname == "dba-xt-prod.coreop.net" &&
        QueryDbShortCut == "true"
    ) {
        var gma = '<span class="tsG btn btn-primary" >TsGameInfo</span>';
        new_elem = document.createElement("div");
        new_elem.innerHTML = gma;

        try {
            classArray = ["page-header", "PageHeader"];
            classArray.forEach(function (item, index, array) {
                if (
                    document.getElementsByClassName("page-header")[0].children[0]
                        .innerText == "Simple Settings"
                ) {
                    gma =
                        '<span class="dg btn btn-primary">DemeterGame</span> <span class="talos btn btn-primary">Talos</span> <span class="dc btn btn-primary" > DemeterCore</span > ';
                }
                new_elem.innerHTML = gma;
                document.getElementsByClassName(item)[0].appendChild(new_elem);
            });
        } catch (e) {
        }

        var tsG = document.querySelector(".tsG");
        if (tsG) {
            tsG.addEventListener(
                "click",
                function () {
                    changeDB("TsGameInfo (maia-a84)");
                },
                false
            );
        }
    }
    //-----------------------------------共用--------------------------------------
    var siren = document.querySelector(".siren");
    if (siren) {
        siren.addEventListener(
            "click",
            function () {
                changeDBForAppSetting("ApplicationSetting (maia-a05)", "Siren");
            },
            false
        );
    }
    var pavo = document.querySelector(".pavo");
    if (pavo) {
        pavo.addEventListener(
            "click",
            function () {
                changeDBForAppSetting("ApplicationSetting (maia-a05)", "Pavo");
            },
            false
        );
    }
    var pan = document.querySelector(".pan");
    if (pan) {
        pan.addEventListener(
            "click",
            function () {
                changeDBForAppSetting("ApplicationSetting (maia-a05)", "Pan");
            },
            false
        );
    }
    //-------------------------StoreProcedure & App Setting----------------------------------
    if (SideBarShortCut == "true") {
        try {
            var sp =
                '<a href="/Developer/Content?type=StoredProcedure"><i class="glyphicon glyphicon-heart"></i>Stored Procedure</a>';
            new_elem = document.createElement("li");
            new_elem.innerHTML = sp;
            var element = document.getElementsByClassName("nav-header")[0];
            element.parentNode.insertBefore(new_elem, element.nextSibling);

            var app =
                '<a href="/Developer/SimpleSetting"><i class="glyphicon glyphicon-heart"></i>Simple Setting</a>';
            new_elem = document.createElement("li");
            new_elem.innerHTML = app;
            element = document.getElementsByClassName("nav-header")[0];
            element.parentNode.insertBefore(new_elem, element.nextSibling);
        } catch (e) {
            console.log("SP and APP error");
        }
    }

    //-------------------------StoreProcedure & App Setting----------------------------------

    //-------------------------Order by-------------------------
    function OrderBy() {
        var orderbyArray = localStorage.getItem("orderByConfig").split(",");
        try {
            var orderStart = '<td class="B" align="left" colspan="2">Order by desc: ';
            var orderCustomize = "";
            var orderEnd = " </td>";
            orderbyArray.forEach((element) => {
                if ($(`#column option[value=${element}]`).length) {
                    orderCustomize += `<span class="btn btn-primary ${element}" style="margin-right:10px"> ${element} </span>`;
                }
            });

            if ($("#orderbyrow").length === 0) {
                new_elem = document.createElement("tr");
                new_elem.id = "orderbyrow";
            } else {
                new_elem = document.getElementById("orderbyrow");
            }
            new_elem.innerHTML = orderStart + orderCustomize + orderEnd;
            element = $(".TAL").parent("tr")[0];
            element.parentNode.insertBefore(new_elem, element.nextSibling);

            orderbyArray.forEach((element) => {
                var order = document.querySelector(`.${element}`);
                if (order) {
                    order.addEventListener(
                        "click",
                        function () {
                            var cmd = window.editor.getValue();
                            cmd = cmd.replace(/[\r\n](^ORDER|^order)[\t\n\r\s\w\W]*/gm, "");
                            window.editor.setValue(cmd + `\r\nORDER BY ${element} desc`);
                        },
                        false
                    );
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    if (OrderFeature == "true") {
        document
            .querySelector("#btnSaveQuery")
            .insertAdjacentHTML(
                "afterend",
                "<button id='saveOrderKey' style='margin-left:4px' class='btn btn-primary btn-sm'>Save Order Key</button>"
            );
        document
            .querySelector(`#saveOrderKey`)
            .addEventListener("click", function () {
                setOrderByConfig();
            });
        OrderBy();
    }
    //-------------------------Order by-------------------------

    //-------------------------Count(1)-------------------------
    if (CountFeature == "true") {
        var count =
            '<td class="B"align="left" colspan="2">COUNT(1) : <p class="btn btn-primary count1">Count(1)</p></td>';
        new_elem = document.createElement("tr");
        new_elem.innerHTML = count;
        element = $(".DT:first tr")[4];
        element.parentNode.insertBefore(new_elem, element.nextSibling);
        var count1 = document.querySelector(".count1");
        if (count1) {
            count1.addEventListener(
                "click",
                function () {
                    var cmd = window.editor.getValue();
                    cmd = cmd.replace(
                        /(^SELECT | select | Select)[\s\w\W\S]*(from | FROM)/gim,
                        "SELECT COUNT(1) FROM "
                    );
                    window.editor.setValue(cmd);
                },
                false
            );
        }
    }
    //-------------------------Count(1)-------------------------

    //-------------------------Search table-------------------------

    if (DatabaseSearchFeature == "true") {
        var newItem =
            '<td><strong>Tables and Views List :<strong></td><td><input class="form-control" type="text" placeholder="Search.." id="searchTable" list="NewTable" ></td>';
        new_elem = document.createElement("tr");
        new_elem.innerHTML = newItem;

        element = $(".DT:first tr")[0];
        element.parentNode.insertBefore(new_elem, element.nextSibling);
        var AppendTarget = document.querySelector("#searchTable");
        if (AppendTarget) {
            AppendTarget.addEventListener(
                "keyup",
                function () {
                    var input, filter, ul, li, i;
                    input = document.getElementById("searchTable");
                    filter = input.value.toUpperCase();
                    var div = document.getElementById("Table");
                    var option = div.getElementsByTagName("option");
                    for (i = 0; i < option.length; i++) {
                        var txtValue = option[i].textContent || option[i].innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            option[i].style.display = "";
                        } else {
                            option[i].style.display = "none";
                        }
                    }
                },
                false
            );
            AppendTarget.addEventListener(
                "change",
                function (e) {
                    $("#Table").val(e.target.value);

                    $("#NewTable").val(e.target.value);
                    $("#NewTable").change(onDatabaseChange);
                    $("#Table").trigger("change");
                    setTimeout(function () {
                        $('#insert').trigger('click');
                    }, 500);
                },
                false
            );
        }

        new_elem = document.createElement("datalist");
        new_elem.setAttribute("id", "NewTable");
        element = $(".DT:first tr")[0];
        element.parentNode.insertBefore(new_elem, element.nextSibling);

        var selector = document.getElementById("Table");
        if (selector) {
            selector.addEventListener(
                "DOMSubtreeModified",
                debounce(createSearchTableDataList, 100)
            );
        }
    }

    //-------------------------Search table-------------------------
    function createSearchTableDataList() {
        var new_elem = document.getElementById("NewTable");
        var oldParent = document.getElementById("Table");
        new_elem.textContent = "";
        var cloneOld = oldParent.cloneNode(true);
        while (cloneOld.childNodes.length > 0) {
            new_elem.appendChild(cloneOld.childNodes[0]);
        }
    }

    //-------------------------Search DB-------------------------

    if (DatabaseSearchFeature == "true") {
        newItem =
            '<td><strong>DataBase List :<strong></td><td><input class="form-control" type="text" placeholder="Search.." id="searchDB" list="NewDatabase" ></td>';
        new_elem = document.createElement("tr");
        new_elem.innerHTML = newItem;

        element = $(".DT:first tr")[0];
        element.parentNode.insertBefore(new_elem, element.nextSibling);
        AppendTarget = document.querySelector("#searchDB");
        if (AppendTarget) {
            AppendTarget.addEventListener(
                "keyup",
                function () {
                    var input, filter, ul, li, i;
                    input = document.getElementById("searchDB");
                    filter = input.value.toUpperCase();
                    var div = document.getElementById("Database");
                    var option = div.getElementsByTagName("option");
                    for (i = 0; i < option.length; i++) {
                        var txtValue = option[i].textContent || option[i].innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            option[i].style.display = "";
                        } else {
                            option[i].style.display = "none";
                        }
                    }
                },
                false
            );
            AppendTarget.addEventListener(
                "change",
                function (e) {
                    $("#Database").val(e.target.value);

                    $("#NewDatabase").val(e.target.value);
                    $("#NewDatabase").change(onDatabaseChange);
                    $("#NewDatabase").trigger("change");
                },
                false
            );
        }

        new_elem = document.createElement("datalist");
        new_elem.setAttribute("id", "NewDatabase");
        var oldParent = document.getElementById("Database");

        element = $(".DT:first tr")[0];
        element.parentNode.insertBefore(new_elem, element.nextSibling);
        var cloneOld = oldParent.cloneNode(true);
        while (cloneOld.childNodes.length > 0) {
            new_elem.appendChild(cloneOld.childNodes[0]);
        }
        $(".DT:first tr")[3].setAttribute("style", "display:none");
        $(".DT:first tr")[4].setAttribute("style", "display:none");
    }
    //-------------------------Search DB-------------------------


    //-------------------------Auto Complete-------------------------

    if (isNeedAutoComplete == "true") {
        window.editor.on("keyup", function (cm, event) {
            if (
                !cm.state
                    .completionActive /*Enables keyboard navigation in autocomplete list*/ &&
                event.keyCode >= 65 &&
                event.keyCode <= 90
            ) {
                /*Enter - do not open autocomplete list just after item has been selected in it*/
                CodeMirror.commands.autocomplete(cm, null, {completeSingle: true});
            }
        });
    }
    //-------------------------Auto Complete-------------------------

    //-----------------------------------共用--------------------------------------

    //--------------------------code mirror start -------------------------
    var selectArr = {};
    var myCar = {};
    selector = document.querySelector(".DT tr:nth-child(8) select");
    if (selector) {
        selector.addEventListener(
            "DOMSubtreeModified",
            debounce(setSqlHint, 100),
            false
        );
    }
    //--------------------------code mirror end----------------------------

    //-------------------------PMS-----------------------------

    $("#btnSubmit").click(() => ShowAdditionalButton());


    function ShowAdditionalButton(){
        ShowEnumTranslatorButton();
        ShowObjectConvertorButton();
    }
    //Declare Variable
    //Flag Translator
    let FlagTranslators = []

    //Promotions
    const promotionCustomerType = {
        1:'B2C',
        2:'B2B',
        4:'B2B2C'
    }

    const promotionBrand = {
        1:'SBOTOP',
        2:'SBOBET',
    }


    const promotionDisplayConfiguration = {
        0:'none',
        1:'Payment',
    }

    let promotionFlagTranslator = {};
    promotionFlagTranslator.dictionary = {'customertype': promotionCustomerType,'brand': promotionBrand, 'displayconfiguration': promotionDisplayConfiguration};
    promotionFlagTranslator.name = 'Promotions';
    FlagTranslators.push(promotionFlagTranslator);



    //Promotions


    //Bet Status

    const betStatus =
        {
        1:'Running',
        2:'Waiting',
        3:'Won',
        4:'Lose',
        5:'Draw',
        6:'Rejected',
        7:'Void',
        8:'Refunded',
        9:'Special_Void',
        13:'Dangerous_Mp_Void',
        16:'Cashed_Out',
        256:'I_O_M',
        512:'Special',
        521:'DelaySpecialVoid',
        1024:'Dangerous_1',
        2048:'Dangerous_2',
        4096:'Dangerous_3',
        8192:'Cash',
        16384:'Indirect',
        32768:'System_Void',
        65536:'Early_Settled',
        131072:'Delay_Void',
        262144:'TestMode',
        524288:'Resettled',
        67108864:'FreeBet',
        134217728:'GhostTicket',
        268435456:'MuayStep',
        536870912:'PremiumCricket',
        1073741824:'ZeroCommission'}

    let betTransFlagTranslator = {};
    betTransFlagTranslator.dictionary = {'betstatus': betStatus};
    betTransFlagTranslator.name = 'bettrans';
    FlagTranslators.push(betTransFlagTranslator);


    //Bet Status


    //Flag Translator

    //Enum Translator
    let PmsEnumTranslators = []


    //Promotions
    const promotionStatus = {
        0: 'None',
        1: 'Pending',
        2: 'Activated',
        3: 'Expired',
        4: 'Deleted'
    }

    const promotionJurisdiction = {
        1 : 'All',
        2 : 'IOM',
        3 : 'MNL'
    }

    const promotionTargetCustomerGroup = {
        1:'All',
        2:'ReturnCustomerOnly',
        3:'NewCustomerOnly'
    }


    let promotionsEnumTranslator = {};
    promotionsEnumTranslator.dictionary = {'status': promotionStatus, 'jurisdiction': promotionJurisdiction, 'targetcustomergroup': promotionTargetCustomerGroup};
    promotionsEnumTranslator.name = 'Promotions';
    PmsEnumTranslators.push(promotionsEnumTranslator);

    //CustomerPromotions
    const customerPromotionStatus = {
        0: 'Unknown',
        1: 'Pending',
        2: 'Activated',
        3: 'Forfeited',
        4: 'CancelledByCustomer',
        5: 'CancelledByOperator',
        6: 'CancelledBySystem',
        7: 'Disqualified',
        8: 'Completed',
        9: 'Expired'
    }

    let customerPromotionsEnumTranslator = {};
    customerPromotionsEnumTranslator.dictionary = {'status': customerPromotionStatus};
    customerPromotionsEnumTranslator.name = 'CustomerPromotions';
    PmsEnumTranslators.push(customerPromotionsEnumTranslator);


    //CustomerPromotionRewards

    const customerPromotionRewardStatus = {1:'Pending',
        2:'Processing',
        3:'Done',
        4:'Failed'}

    let customerPromotionRewardEnumTranslator = {};
    customerPromotionRewardEnumTranslator.dictionary = {'status': customerPromotionRewardStatus};
    customerPromotionRewardEnumTranslator.name = 'CustomerPromotionRewards';
    PmsEnumTranslators.push(customerPromotionRewardEnumTranslator);


    //CustomerPromotionTargets
    const CustomerPromotionTargetRule = {0:'None',
        1:'MeetTargetTurnOver',
        2:'HasLoginOrDeposit',
        4:'NoTarget',
        5:'ExpiredAtEndDate'}

    const customerPromotionConfigurationType = {
        1: 'SportsBet',
        2: 'LiveCasinoBet',
        3: 'RacingBet',
        4: 'GamesBet',
        5: 'Login',
        6: 'Deposit',
        7: 'Withdraw',
    }

    let CustomerPromotionTargetTranslator = {};
    CustomerPromotionTargetTranslator.dictionary = {'rule': CustomerPromotionTargetRule, 'configurationtype': customerPromotionConfigurationType};
    CustomerPromotionTargetTranslator.name = 'CustomerPromotionTargets';
    PmsEnumTranslators.push(CustomerPromotionTargetTranslator);


    //PromotionRewards
   const promotionRewardType = {
        1: 'DepositBonus',
        2: 'GameVoucher',
        3: 'SportsVoucher',
        4: 'NoReward'}



    const promotionRewardTiming = {
        0: 'None',
        1: 'Instant',
        2: 'DepositDone',
        3: 'DepositAmount',
        4: 'NoReward',
        5: 'Rollover',
        6: 'Turnover',
        7: 'Login'
   }

    let PromotionRewardsTranslator = {};
    PromotionRewardsTranslator.dictionary = {'promotionrewardtype': promotionRewardType, 'rewardtiming': promotionRewardTiming};
    PromotionRewardsTranslator.name = 'PromotionRewards';
    PmsEnumTranslators.push(PromotionRewardsTranslator);


    //PromotionTargets
    const promotionTargetRule = {
        0: 'None',
        1: 'NeedRolloverNumberOfTimes',
        2: 'TurnoverMoreThanOrEquals',
        3: 'HasLoginOrDeposit',
        4: 'NoTarget',
        5: 'ExpiredAtEndDate'
    }

    let promotionTargetTranslator = {};
    promotionTargetTranslator.dictionary = {'rule': promotionTargetRule, 'configurationtype': customerPromotionConfigurationType};
    promotionTargetTranslator.name = 'PromotionTargets';
    PmsEnumTranslators.push(promotionTargetTranslator);


    //PromotionTncs
    let PromotionTncsTranslator = {};
    PromotionTncsTranslator.dictionary = {'brand': promotionBrand};
    PromotionTncsTranslator.name = 'PromotionTncs';
    PmsEnumTranslators.push(PromotionTncsTranslator);

    //Enum Translator
    //Declare Variable

    function ShowEnumTranslatorButton() {
        let searchedTable = document.querySelector("#searchTable");
        let tableSel = document.querySelector("#tableSel");
        let EnumTranslator = document.querySelector("#EnumTranslator");
        if ((PmsEnumTranslators.find(x => x.name === searchedTable.value || x.name === tableSel.value) !== undefined )|| FlagTranslators.find(x => x.name === searchedTable.value || x.name === tableSel.value) !== undefined) {
            EnumTranslator.style.display = ''
        } else {
            EnumTranslator.style.display = 'none';
        }
    }

    function appendValueAfterEnum() {
        let searchedTable = document.querySelector("#searchTable");
        let tableSel = document.querySelector("#tableSel");
        let resultTable = document.querySelector("#resultTable");
        let dataRows = resultTable.rows
        let enumTranslator = PmsEnumTranslators.find(x=>x.name === searchedTable.value || x.name === tableSel.value)
        let flagTranslator = FlagTranslators.find(x=>x.name === searchedTable.value || x.name === tableSel.value)
        let targetElements = getTargetHeaderIndex(searchedTable.value, dataRows, enumTranslator, flagTranslator);
        appendValue(targetElements, dataRows, enumTranslator, flagTranslator);
    }

    function appendValue(headerElement, dataRows, enumTranslator,flagTranslator) {
        for (let i = 1; i < dataRows.length; i++) {
            for (let e of headerElement) {
                if(e.type === 'enum'){
                    dataRows[i].cells[e.index].innerText  += ' => ' + enumTranslator.dictionary[e.name][dataRows[i].cells[e.index].innerText];
                }
                else if(e.type === 'flag'){
                    let flagData = flagTranslator.dictionary[e.name];
                    let data = dataRows[i].cells[e.index].innerText;
                    let isFirstAdd = 0;
                    for (const [key, value] of Object.entries(flagData)) {
                        if((data & key) === parseInt(key)){
                            if (isFirstAdd === 0){
                                dataRows[i].cells[e.index].innerText  += ' => ' + value ;
                                isFirstAdd = 1;
                            }else{
                                dataRows[i].cells[e.index].innerText  += ' & ' + value;
                            }
                        }
                    }
                }
            }
        }
    }

    function getTargetHeaderIndex(tableName, dataRows, enumTranslator,flagTranslator) {
        let targetElements = [];
        let headerCells = dataRows[0].cells
        for (let c of headerCells) {
            if (enumTranslator!== undefined && enumTranslator.dictionary[c.innerText.toLowerCase()] !== undefined) {
                let targetElement = {};
                targetElement.name = c.innerText.toLowerCase();
                targetElement.index = c.cellIndex;
                targetElement.type = 'enum';
                targetElements.push(targetElement);
            }
            else if(flagTranslator !== undefined && flagTranslator.dictionary[c.innerText.toLowerCase()] !== undefined) {
                let targetElement = {};
                targetElement.name = c.innerText.toLowerCase();
                targetElement.index = c.cellIndex;
                targetElement.type = 'flag';
                targetElements.push(targetElement);
            }
        }
        return targetElements;
    }

    //-------------------------PMS-----------------------------

    //-------------------------C# Object Convertor--------------------------


    const stringType = "string";
    const integerType = "int";
    const booleanType = "bool"
    const dateTimeType = "dateTime"

    function ShowObjectConvertorButton(){
        objectConvertor.style.display = ''
    }

    function ConvertObject(){
        let elementTypes = DistinguishElementType();
        let resultTable = document.querySelector("#resultTable");
        let dataRows = resultTable.rows;
        let appendText = "<div id='ObjectConvertBlock'> "
                        +"<h3>Object Convert</h3>";
        for (let i = 1; i < dataRows.length; i++) {
            appendText += "<span> { </span><br/>";
            for(let j = 0; j < elementTypes.length; j++){
                let targetPosition = j + 1;
                let targetProperties = dataRows[0].cells[targetPosition].innerText;
                let targetValue = dataRows[i].cells[targetPosition].innerText;
                if(targetValue === ""){
                    continue;
                }

                switch (elementTypes[j].Type) {
                    case stringType:
                        appendText += `<span>${targetProperties} = "${targetValue}",</span><br/>`
                        break;
                    case booleanType:
                        let result = targetValue == 1 ? "true": "false"
                        appendText += `<span>${targetProperties} = ${result},</span><br/>`
                    break;
                    case integerType:
                        appendText += `<span>${targetProperties} = ${targetValue},</span><br/>`
                    break;
                    case dateTimeType:
                        let targetDateTime = ConvertDatetime(targetValue);
                        appendText += `<span>${targetProperties} = new DateTime(${targetDateTime.year}, ${targetDateTime.month}, ${targetDateTime.day}, ${targetDateTime.hour}, ${targetDateTime.minute}, ${targetDateTime.second}),</span><br/>`
                    default:
                        break;
                }
            }
            appendText += "<span> }, </span><br/>"
        }
        appendText += "</div>"
        $("#Result").prepend(appendText);

    }

    function ConvertDatetime(target){
        let targetDateTime= {};
        let splitedDateAndTime= target.split(' ');

        let date = splitedDateAndTime[0];
        let splitedYyyyMmDd = date.split('-');
        targetDateTime.year = splitedYyyyMmDd[0];
        targetDateTime.month = splitedYyyyMmDd[1];
        targetDateTime.day = splitedYyyyMmDd[2];

        let time = splitedDateAndTime[1];
        let splitedHhMmSs = time.split(':');
        targetDateTime.hour = splitedHhMmSs[0];
        targetDateTime.minute = splitedHhMmSs[1];
        let secondAndMs = splitedHhMmSs[2];
        let splitedSAndMs = secondAndMs.split('.');
        targetDateTime.second = splitedSAndMs[0];

        return targetDateTime;
    }

    function DistinguishElementType(){
        let elementTypes = []
        let options = document.getElementById("column").options;
        for (let option of options) {
            let targetHeaderElement = {}
            if(option.text.includes("(int)")){
                targetHeaderElement.Type = integerType;
            }
            else if(option.text.includes("(bit)")){
                targetHeaderElement.Type = booleanType;
            }
            else if(option.text.includes("(datetime)")){
                targetHeaderElement.Type = dateTimeType;
            }
            else{
                targetHeaderElement.Type = stringType;
            }
            elementTypes.push(targetHeaderElement);
        }
        console.log("element type");
        console.log(elementTypes);
        return elementTypes;
    }




    //-------------------------C# Object Convertor-------------------------


})();



