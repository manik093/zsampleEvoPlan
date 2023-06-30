/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "com/sample/zcheckplan/model/models",
    "com/sample/zcheckplan/model/Constants",
    "sap/m/MessagePopover",
    "sap/m/MessagePopoverItem",
    "sap/m/Link",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/sample/zcheckplan/controller/ErrorHandler",
],
    function (UIComponent, Device, JSONModel, models, Constants, MessagePopover,
        MessagePopoverItem,
        Link,
        Filter,
        FilterOperator, ErrorHandler) {
        "use strict";

        return UIComponent.extend("com.sample.zcheckplan.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // initialize the error handler with the component
                this._oErrorHandler = new ErrorHandler(this);
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                if (sap.ushell && sap.ushell.Container) {
                    this.getModel("viewModel").setProperty("/launchMode", Constants.LAUNCH_MODE.FIORI);
                }

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                //Initializing all the global models
                this._createDataModels();

                //Message Popover Initialzation
                this._createMessagePopover();

                //Initial Batch Calls
                this._prepareInitialData();

                this.getRouter().initialize();

            },
            _createDataModels: function () {
                this.setModel(models.createDeviceModel(), "device");
                var oViewModel = new JSONModel({
                    subFilterEntity: "Demand",
                    tableBusyDelay: 0,
                    counterResourceFilter: "",
                    showStatusChangeButton: false,
                    busy: true,
                    delay: 0,
                    assetStartDate: new Date(),
                    dragSession: null, // Drag session added as we are keeping dragged data in the model.
                    gantDragSession: null, // Drag session from Gantt View added as we are keeping dragged data in the model.
                    detailPageBreadCrum: "",
                    capacityPlanning: false,
                    remainingWork: false,
                    dragDropSetting: {
                        isReassign: false
                    },
                    splitterDivider: "30%",
                    ganttSelectionPane: "28%",
                    showUtilization: false,
                    selectedHierarchyView: "TIMENONE",
                    enableReprocess: false,
                    launchMode: Constants.LAUNCH_MODE.BSP,
                    DefaultDemandStatus: "",
                    ganttSettings: {
                        active: false,
                        shapeOperation: {
                            unassign: false,
                            reassign: false,
                            change: false
                        },
                        aGanttSplitDemandData: false,
                        GanttPopOverData: {}
                    },
                    showDemands: true,
                    mapSettings: {
                        busy: false,
                        filters: [],
                        selectedDemands: [],
                        routeData: [],
                        checkedDemands: [],
                        assignedDemands: [],
                        bRouteDateSelected: false,
                        aAssignedAsignmentsForPlanning: [],
                        droppedResources: [],
                        bIsSignlePlnAsgnSaved: false,
                        DemandSet: []
                    },
                    resourceTreeShowRouteColumn: false,
                    resourceFilterforRightTechnician: false,
                    CheckRightTechnician: false,
                    WarningMsgResourceTree: false,
                    resourceQualification: {
                        AssignBtnVisible: false,
                        AssignBtnEnable: false,
                        FindResourceBtnVisible: false,
                        FindResourceBtnEnable: false
                    },
                    manageResourcesSettings: {
                        selectedRow: false,
                        operationType: "",
                        Assignments: {},
                        removedIndices: [],
                        draggedItemContext: []
                    },
                    densityClass: this.getContentDensityClass(),
                    isOpetationLongTextPressed: false,
                    oResponseMessages: [],
                    aFixedAppointmentsList: {},
                    bDemandEditMode: false,
                    ganttResourceFiltersFromPin: [],
                    ganttDateRangeFromMap: [],
                    iFirstVisibleRowIndex: -1,
                    availabilities: {
                        data: [],
                        isToAssign: false
                    },
                    timeAllocations: {
                        countAll: 0,
                        countBlockers: 0,
                        countAbsences: 0,
                        enableTabs: true,
                        createData: [],
                        createDataCopy: [],
                        StartDate: "",
                        EndDate: ""
                    },
                    validateIW31Auth: true,
                    validateIW32Auth: true,
                    aFilterBtntextGanttDemandTbl: this.getModel("i18n").getResourceBundle().getText("xbut.filters"),
                    bFilterGantBtnDemandtsGantt: false,
                    PRT: {
                        btnSelectedKey: "demands",
                        bIsGantt: false,
                        defaultStartDate: "",
                        defaultEndDate: ""
                    },
                    Scheduling: {
                        sType: "",
                        sScheduleDialogTitle: "",
                        bEnableReschedule: false,
                        SchedulingDialogFlags: {

                        }
                    }
                });
                oViewModel.setSizeLimit(999999999);
                this.setModel(oViewModel, "viewModel");
                // user model
                this.setModel(models.createUserModel({
                    ENABLE_ASSET_PLANNING: false,
                    ENABLE_EVOORDERRELATE_BUTTON: false,
                    ENABLE_EVORESOURCE_BUTTON: false,
                    ENABLE_IW32_AUTH_CHECK: false,
                    ENABLE_IW31_AUTH_CHECK: false,
                    ENABLE_PM_AUTH_CHECK: false
                }), "user");

                //Creating the Global message model from MessageManager
                var oMessageModel = new JSONModel();
                oMessageModel.setData([]);
                this.setModel(oMessageModel, "MessageModel");


            },
            _prepareInitialData: function () {
                var aPromises = [];
                aPromises.push(this._getSystemInformation());
                Promise.all(aPromises).then(function (data) {
                    console.log(data);
                    this.getModel("user").setData(data[0]);
    
                    //Intialize variables for SAP authorization
                    //this._handleAuthorization();
    
                    // create the views based on the url/hash
                   
                }.bind(this));
            },
            /**
         * Calls the GetSystemInformation 
         */
            _getSystemInformation: function () {
                return new Promise(function (resolve, reject) {
                    this.getModel().callFunction("/GetSystemInformation", {
                        method: "GET",
                        success: function (oData, oResponse) {
                            resolve(oData);
                        },
                        error: function (oError) {
                            //Handle Error
                            reject(oError);
                        }
                    });
                }.bind(this));
            },

            /**
         * Function to initialize Message Popover
         */
            _createMessagePopover: function () {
                // Message popover link
                var oLink = new Link({
                    text: "{i18n>xtit.showMoreInfo}",
                    href: "",
                    target: "_blank"
                });

                // Message popover template
                var oMessageTemplate = new MessagePopoverItem({
                    type: "{MessageModel>type}",
                    title: "{MessageModel>title}",
                    description: "{MessageModel>description}",
                    subtitle: "{MessageModel>subtitle}",
                    counter: "{MessageModel>counter}",
                    link: oLink
                });

                //Message Popover
                var oMessagePopover = new MessagePopover({
                    items: {
                        path: "MessageModel>/",
                        template: oMessageTemplate
                    }
                });
                this._oMessagePopover = oMessagePopover;
            },
            getContentDensityClass: function () {
                if (this._sContentDensityClass === undefined) {
                    // check whether FLP has already set the content density class; do nothing in this case
                    var element = document.getElementsByTagName("body")[0];
                    if (element.classList.contains("sapUiSizeCozy") || element.classList.contains("sapUiSizeCompact")) {
                        this._sContentDensityClass = "";
                    } else if (Device.system.desktop && Device.support.touch) { // apply "compact" mode if touch is not supported
                        // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                        this._sContentDensityClass = "sapUiSizeCompact";
                    } else if (Device.support.touch) { // apply "compact" mode if touch is not supported
                        // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                        this._sContentDensityClass = "sapUiSizeCozy";
                    } else {
                        //sapUiSizeCompact
                        this._sContentDensityClass = "sapUiSizeCompact";
                    }
                }
                return this._sContentDensityClass;
            },
        });
    }
);