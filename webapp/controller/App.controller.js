sap.ui.define(
  [
    "com/sample/zcheckplan/controller/common/AssignmentsController",
    "sap/ui/model/json/JSONModel",
    "com/sample/zcheckplan/model/formatter",
	"com/sample/zcheckplan/model/Constants"
  ],
  function (Controller, JSONModel, formatter,Constants) {
    "use strict";

    return Controller.extend("com.sample.zcheckplan.controller.App", {
      formatter: formatter,
      onInit: function () {
        this._eventBus = sap.ui.getCore().getEventBus();

        var oViewModel,
          fnSetAppNotBusy,
          iOriginalBusyDelay = this.getView().getBusyIndicatorDelay(),
          oRouter = this.getOwnerComponent().getRouter();

        oViewModel = new JSONModel({
          busy: true,
          delay: 0

        });
        this.getOwnerComponent().setModel(oViewModel, "appView");

        fnSetAppNotBusy = function () {
          oViewModel.setProperty("/busy", false);
          oViewModel.setProperty("/delay", iOriginalBusyDelay);
        };

        this.getOwnerComponent().getModel().metadataLoaded()
          .then(fnSetAppNotBusy);

        // apply content density mode to root view
        this._oAppControl = this.byId("approvalApp");
        this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        //set init page title
        oRouter.attachRouteMatched(this._onAllRouteMatched, this);
      },
      _onAllRouteMatched: function (oEvent) {
        var oAppViewModel = this.getOwnerComponent().getModel("appView"),
          oParams = oEvent.getParameters(),
          oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(),
          pageTitle = oResourceBundle.getText("xbut.pageDemands");

        this.getModel("viewModel").setProperty("/ganttSettings/active", false);
        //buffer refresh visible for other views
        oAppViewModel.setProperty("/bBufferRefreshVisible", true);

        if (oParams.config.pattern.startsWith("AssetPlanning")) {
          pageTitle = oResourceBundle.getText("xbut.pageAssetManager");
        } else if (oParams.config.pattern.startsWith("MessageCockpit")) {
          //buffer refresh hidden for message cockpit
          oAppViewModel.setProperty("/bBufferRefreshVisible", false);
          pageTitle = oResourceBundle.getText("xbut.pageMessageCockpit");
        } else if (oParams.config.pattern.startsWith("SplitPage")) {
          pageTitle = oResourceBundle.getText("xbut.pageNewGanttChartSplit");
          this.getModel("viewModel").setProperty("/ganttSettings/active", true);
          if (oParams.name === "newGanttSplit") {
            pageTitle = oResourceBundle.getText("xbut.pageNewGanttChartSplit");
          }
        } else if (oParams.config.pattern.startsWith("Map")) {
          pageTitle = oResourceBundle.getText("xbut.pageMap");
        } else if (oParams.config.pattern.startsWith("ManageResources")) {
          pageTitle = oResourceBundle.getText("xbut.manageResources");
        } else if (oParams.config.pattern.startsWith("NewGantt") || oParams.config.pattern.startsWith("Gantt/Demand") || oParams.config.pattern
          .startsWith("GanttTools")) {
          pageTitle = oResourceBundle.getText("xbut.pageNewGantt");
        }
        oAppViewModel.setProperty("/pageTitle", pageTitle);
        oAppViewModel.setProperty("/currentRoute", oParams.name);
        oAppViewModel.setProperty("/busy", false);

        this._onObjectMatched(oParams.name);
      },

      /** 
     * Refresh's the resource tree and demand table
     * When any changes done in gantt or demand view should reflect in other
     * view when user navigates it.
     * @constructor 
     */
      _onObjectMatched: function (sRoute) {
        if (this.getOwnerComponent().bIsFromPRTSwitch) {
          this.getOwnerComponent().bIsFromPRTSwitch = false;
          return;
        }
        if (sRoute === "gantt") {
          this._eventBus.publish("BaseController", "refreshGanttChart", {});
          this._eventBus.publish("BaseController", "refreshDemandGanttTable", {});
        } else if (sRoute === "newgantt") {
          this._eventBus.publish("BaseController", "refreshDemandGanttTable", {});
        } else if (sRoute === "ganttSplit") {
          this._eventBus.publish("BaseController", "refreshGanttChart", {});
        } else if (sRoute === "splitDemands") {
          this._eventBus.publish("BaseController", "refreshDemandGanttTable", {});
        } else if (sRoute === "DemandDetail") {
          /* No action require */
        } else if (sRoute === "map") {
          this._eventBus.publish("BaseController", "refreshMapTreeTable", {});
          this._eventBus.publish("BaseController", "refreshMapView", {});
        } else if (this.getOwnerComponent().bIsFromPRTSwitch && (sRoute === "demands" || sRoute === "demandTools")) {
          this.getOwnerComponent().bIsFromPRTSwitch = false;
        } else {
          this._eventBus.publish("BaseController", "refreshTreeTable", {});
          this._eventBus.publish("BaseController", "refreshDemandTable", {});
        }

      },
    });
  }
);
