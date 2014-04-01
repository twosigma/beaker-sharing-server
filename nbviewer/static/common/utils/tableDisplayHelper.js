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
(function() {
    window.tableDisplayHelper = {
        setTimeColumnFormatter: function (timeCol) {
            if (!timeCol) {
                return;
            }
            timeCol.formatter = function(row, cell, value, columnDef, dataContext) {
                var nano = value % 1000;
                var micro = (value / 1000) % 1000;
                var milli = value / 1000 / 1000;
                var d = new Date(milli);
                var doubleDigit = function(integer) {
                    if (integer < 10) {
                        return '0' + integer;
                    }
                    return integer.toString();
                };
                var trippleDigit = function(integer) {
                    if (integer < 10) {
                        return '00' + integer;
                    } else if (integer < 100) {
                        return '0' + integer;
                    }
                    return integer.toString();
                };
                var result = '';
                result += d.getFullYear() + doubleDigit(d.getMonth() + 1) + doubleDigit(d.getDate());
                result += ' ';
                result += doubleDigit(d.getHours()) + ':' + doubleDigit(d.getMinutes()) + ':' + doubleDigit(d.getSeconds());
                result += '.';
                result += trippleDigit(d.getMilliseconds());
                result += ' ' + trippleDigit(micro);
                result += ' ' + trippleDigit(nano);
                return result;
            };
        },
        addGridOnSort: function (grid) {
            grid.onSort.subscribe(function(e, args) {
                var cols = args.sortCols;
                data.sort(function(dataRow1, dataRow2) {
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
                grid.invalidate();
                grid.render();
            });        
        }
    };
})();
