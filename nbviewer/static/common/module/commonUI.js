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
    var commonUI = angular.module('M_commonUI', []);
    commonUI.directive('onCtrlEnter', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind("keyup", function (event) {
                    if (event.ctrlKey && event.keyCode === 13) { // ctrl + enter
                        scope.$apply(attrs.onCtrlEnter);
                    }
                });
            }
        };
    });

    commonUI.directive('eatClick', function () {
        return function (scope, element, attrs) {
            $(element).click(function (event) {
                event.preventDefault();
            });
        };
    });

    commonUI.directive('bkcell', function () {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                element.mouseover(function (event) {
                    element.addClass("cell-bracket-selected");
                    event.stopPropagation();
                });
                element.mouseout(function (event) {
                    element.removeClass("cell-bracket-selected");
                    event.stopPropagation();
                });
            }
        };
    });
    commonUI.directive('bkShow', function () { // like ngShow, but animated
        return {
            link: function (scope, element, attrs) {
                var expression = attrs.bkShow;
                scope.$watch(expression, function (newValue, oldValue) {
                    
                        if (newValue) {
                            element.stop(true, true).slideDown(200);
                        } else {
                            element.stop(true, true).slideUp(200);
                        }
                    
                });
            }
        };
    });
    commonUI.directive('bkHide', function () { // like ngShow, but animated
        return {
            link: function (scope, element, attrs) {
                var expression = attrs.bkHide;
                scope.$watch(expression, function (newValue, oldValue) {
                    
                        if (newValue) {
                            element.stop(true, true).slideUp(200);
                        } else {
                            element.stop(true, true).slideDown(200);
                        }
                    
                });
            }
        };
    });
    commonUI.directive('bkDropdownMenu', function () {
        return {
            restrict: 'E',
            template: '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">' +
                '<li ng-repeat="item in menuItems" ng-class="getItemClass(item)">' +
                '<a href="#" tabindex="-1" ng-click="item.action()" ng-class="getAClass(item)" eat-click>' +
                '<i class="icon-ok" ng-show="isMenuItemChecked(item)"></i>' +
                '{{item.name}}' +
                '</a>' +
                '<ul class="dropdown-menu">' +
                '<li ng-repeat="subitem in item.items">' +
                '<a href="#"  tabindex="-1" ng-click="subitem.action()" ng-class="getAClass(subitem)" title="{{subitem.tooltip}}" eat-click>' +
                '<i class="icon-ok" ng-show="isMenuItemChecked(subitem)"></i>' +
                '{{subitem.name}}' +
                '</a>' +
                '</li>' +
                '</ul>' +
                '</li>' +
                '</ul>',
            scope: {
                "menuItems": "="
            },
            replace: true,
            controller: function ($scope) {

                $scope.getAClass = function (item) {
                    var result = [];
                    if (item.disabled) {
                        result.push("disabled-link");
                    }
                    return result.join(" ");
                };

                $scope.getItemClass = function (item) {
                    var result = [];
                    if (item.type === "divider") {
                        result.push("divider");
                    }
                    if (item.type === "submenu" || item.items) {
                        result.push("dropdown-submenu");
                    }
                    return result.join(" ");
                };

                $scope.isMenuItemChecked = function (item) {
                    if (item.isChecked) {
                        if (_.isFunction(item.isChecked)) {
                            return item.isChecked();
                        } else {
                            return item.isChecked;
                        }
                    }
                    return false;
                };
            },
            link: function (scope, element, attrs) {

            }
        };
    });
})();
