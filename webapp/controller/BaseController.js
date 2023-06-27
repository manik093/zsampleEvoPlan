sap.ui.define([
	"sap/ui/core/mvc/Controller"
 ], function (Controller) {
	"use strict";
	return Controller.extend("com.sample.zcheckplan.controller.AssignmentsController", {
		onInit:function(){
			// Init Funcitions dont run in base controller
		},
		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName, oView) {
			if (oView) {
				return oView.getModel(sName);
			}
			if (!this.getView().getModel(sName)) {
				return this.getOwnerComponent().getModel(sName);
			}
			return this.getView().getModel(sName);
		},

	});
 });