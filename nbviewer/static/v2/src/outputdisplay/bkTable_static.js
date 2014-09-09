/*
 *  Copyright 2014 TWO SIGMA INVESTMENTS, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
(function () {
    var module = angular.module('M_bkTable_static', []);
    module.directive('bkoTableDisplay', function () {
        return {
            restrict: 'E',
            template: '<div class="slickgrid" style="height:500px;"></div>',
            controller: function ($scope) {
                var elm = document.createElement('div');
                $(elm).addClass('ui-widget').addClass('slick-cell');
                var getWidth = function (text) {
                    $(elm).html(text);
                    $('body').append(elm);
                    var width = $(elm).width();
                    $(elm).remove();
                    return width + 10;
                };
                $scope.getData = function () {
                    var data = _.map($scope.model.values, function (row) {
                        return _.object($scope.model.columnNames, row);
                    });
                    return data;
                };
                $scope.getColumns = function () {
                    var columns = _.map($scope.model.columnNames, function (col) {
                        return {id: col, name: col, field: col, sortable: true};
                    });
                    var timeCol = _.find(columns, function (it) {
                        return it.field === "time";
                    });
                    if (timeCol) {
                        if ($scope.model.timeStrings) {
                            var timeStrings = $scope.model.timeStrings;
                            timeCol.width = getWidth(timeStrings[0]);
                            timeCol.formatter = function (row, cell, value, columnDef, dataContext) {
                                return timeStrings[row];
                            };
                        } else {
                            timeCol.width = getWidth("20110101 23:00:00.000 000 000");
                            timeCol.formatter = function (row, cell, value, columnDef, dataContext) {
                                var nano = value % 1000;
                                var micro = (value / 1000) % 1000;
                                var milli = value / 1000 / 1000;
                                var d = new Date(milli);
                                var doubleDigit = function (integer) {
                                    if (integer < 10) {
                                        return "0" + integer;
                                    }
                                    return integer.toString();
                                };
                                var trippleDigit = function (integer) {
                                    if (integer < 10) {
                                        return "00" + integer;
                                    } else if (integer < 100) {
                                        return "0" + integer;
                                    }
                                    return integer.toString();
                                };
                                var result = "";
                                result += d.getFullYear() + doubleDigit(d.getMonth() + 1) + doubleDigit(d.getDate());
                                result += " ";
                                result += doubleDigit(d.getHours()) + ":" + doubleDigit(d.getMinutes()) + ":" + doubleDigit(d.getSeconds());
                                result += ".";
                                result += trippleDigit(d.getMilliseconds());
                                result += " " + trippleDigit(micro);
                                result += " " + trippleDigit(nano);
                                return result;
                            };
                        }
                    }
                    return columns;
                };
                $scope.getOptions = function () {
                    var options = {
                        enableCellNavigation: true,
                        enableColumnReorder: false,
                        multiColumnSort: true
                        //forceFitColumns: true
                    };
                    return options;
                };
            },
            link: function (scope, element, attrs) {
                var data = scope.getData();
                var div = element.find('div');
                scope.grid = new Slick.Grid(div, data, scope.getColumns(), scope.getOptions());
                scope.grid.onSort.subscribe(function (e, args) {
                    var cols = args.sortCols;
                    data.sort(function (dataRow1, dataRow2) {
                        for (var i = 0, l = cols.length; i < l; i++) {
                            var field = cols[i].sortCol.field;
                            var sign = cols[i].sortAsc ? 1 : -1;
                            var value1 = dataRow1[field], value2 = dataRow2[field];
                            var result = (value1 === value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                            if (result !== 0) {
                                return result;
                            }
                        }
                        return 0;
                    });
                    scope.grid.invalidate();
                    scope.grid.render();
                });
                //table needs to be redrawn to get column sizes correct
                window.setTimeout(function () {
                    var h = element.find('.slick-header').height() + element.find(".slickgrid").find('.slick-row').size() * element.find(".slickgrid").find('.slick-row').height() + 5;
                    if (h < 500) {
                        div.height(h);
                    }
                }, 5);
            }
        };
    });
    module.directive('bkTableDisplayDataTables', function () {
        return {
            restrict: 'E',
            template: "<table style='max-width:none;'></table>",
            controller: function ($scope) {
                $scope.getDataTablePrefs = function () {
                    var model = $scope.model;
                    //create a list of column names in the format that dataTables likes
                    var dataTableColumns = [];
                    for (var i = 0; i < model.columnNames.length; i++) {
                        dataTableColumns.push({
                            "sTitle": model.columnNames[i]
                        });
                    }

                    //preferences object for creating the data table
                    var dataTablePrefs = {
                        "aaSorting": [],
                        "bPaginate": false,
                        "bLengthChange": false,
                        "bFilter": false,
                        "bInfo": false,
                        "bAutoWidth": true,
                        "sScrollY": 300,
                        "sScrollX": "100%",
                        "bScrollCollapse": true,
                        "aaData": model.values,
                        "aoColumns": dataTableColumns
                    };
                    return dataTablePrefs;
                };
            },
            link: function (scope, element, attrs) {
                //create the data table
                var dt = $(element).find("table").dataTable(scope.getDataTablePrefs());

                //table needs to be redrawn to get column sizes correct
                setTimeout(function () {
                    dt.fnAdjustColumnSizing();
                    dt.fnDraw();
                }, 5);
            }
        };
    });
})();
