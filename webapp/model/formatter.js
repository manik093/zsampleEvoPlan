sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";

	return {
		getLogoImageLink: function () {
			var path = sap.ui.require.toUrl("com/sample/zcheckplan/assets/img/evoplan_h50px.png");
			return path;
		}
	};
});