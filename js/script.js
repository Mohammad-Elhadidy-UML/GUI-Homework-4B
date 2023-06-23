/*
File: script.js
GUI Assignment: Creating an Interactive Dynamic Table
Mohammad Elhadidy, UMass Lowell Computer Science, Mohammad_Elhadidy@student.uml.edu
Description: Created an interactive dynamic table using HTML, Javascript, and CSS. Used inputs
values for rows and columns and a table is generated according to their input.
Sources: https://css-tricks.com/a-table-with-both-a-sticky-header-and-a-sticky-first-column/
https://mdbootstrap.com/docs/b4/jquery/tables/scroll/
Copyright (c) 2023 by Mohammad. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by ME on June 21, 2023 at 2:00 PM
*/

var form = document.getElementById('form');
const msg = document.querySelector('.msg');

let tabsArray = [1];
let tabCounter = 2;

$(document).ready(function() { /* jQuery Validation Plugin Code for checking user input */
    $("#tabs").tabs();
    $("#add-tab").click(function() { /* Add tab Functionality */
        let tabTemplate = `<li><a href="#tabs-${tabCounter}">Tab</a><button class="delete-tab btn btn-danger btn-sm">Delete</button><input type="checkbox" class="tab-checkbox"></li>`;
        let panelTemplate = `<div id="tabs-${tabCounter}"><table id="mtable-${tabCounter}"></table</div>`;

        tabsArray.push(tabCounter);

        $("#tabs").find(".ui-tabs-nav").append(tabTemplate);
        $("#tabs").append(panelTemplate);
        $("#tabs").tabs("refresh");
        tabCounter++;
    });

    $("#tabs").on("click", ".delete-tab", function() { /* Used to delete single tabs */
        let panelId = $(this).closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        tabsArray = tabsArray.filter(tabId => tabId != panelId.replace ('tabs-', ''));
        $("#tabs").tabs("refresh");
    });

    $("#delete-selected").click(function () { /* Functionality added to delete multiple tabs */
        $(".tab-checkbox:checked").each(function() {
            let panelId = $(this).closest("li").remove().attr("aria-controls"); /* Used to delete multiple tabs */
            $("#" + panelId).remove();
            tabsArray = tabsArray.filter(tabId => tabId != panelId.replace('tabs-', ''));
        });
        $("#tabs").tabs("refresh");
    });

    $("input[type='number']").each(function() {
        var input = $(this);
        
        var slider = $("<div>").insertAfter(input).slider({ /* Slider Div */
            min: -50,
            max: 50,
            range: "min",
            value: input.val(),
            slide: function(event, ui) {
                input.val(ui.value);
                if ($('#form').valid()) {
                    generateTable();
                }
            }
        });

        input.on("input change", function() { /* Used to provide updates to slider when the input field changes */
            slider.slider("value", this.value);
            if ($('#form').valid()) {
                generateTable();
            }
        });
    });

    $('#form').validate({
        rules: {
            num1: { /* Refers to Minimum Row */
                required: true,
                number: true,
                min: -50,
                max: 50,
                lessThanOrEqual: '#num2'
            },
            num2: { /* Refers to Maximum Row */
                required: true,
                number: true,
                min: -50,
                max: 50,
                greaterThanOrEqual: '#num1'
            },
            num3: { /* Refers to Minimum Column */
                required: true,
                number: true,
                min: -50,
                max: 50,
                lessThanOrEqual: '#num4'
            },
            num4: { /* Refers to Maximum Column */
                required: true,
                number: true,
                min: -50,
                max: 50,
                greaterThanOrEqual: '#num3'
            }
        },
        messages: {
            num1: { /* Refers to Minimum Row */
                required: 'Please enter a valid number for Minimum Row',
                min: 'Number must be no less than -50 and no more than 50',
                max: 'Number must be no less than -50 and no more than 50',
                lessThanOrEqual: 'Number must be less than or equal to Maximum Row'
            },
            num2: { /* Refers to Maximum Row */
                required: 'Please enter a valid number for Maximum Row',
                min: 'Number must be no less than -50 and no more than 50',
                max: 'Number must be no less than -50 and no more than 50',
                greaterThanOrEqual: 'Number must be greater than or equal to Minimum Row'
            },
            num3: { /* Refers to Minimum Column */
                required: 'Please enter a valid number for Minimum Column',
                min: 'Number must be no less than -50 and no more than 50',
                max: 'Number must be no less than -50 and no more than 50',
                lessThanOrEqual: 'Number must be less than or equal to Maximum Column'
            },
            num4: { /* Refers to Maximum Column */
                required: 'Please enter a valid number for Maximum Column',
                min: 'Number must be no less than -50 and no more than 50',
                max: 'Number must be no less than -50 and no more than 50',
                greaterThanOrEqual: 'Number must be greater than or equal to Minimum Column'
            }
        }
    });

    $.validator.addMethod('greaterThanOrEqual', function(value, element, param) { /* Function which checks to values to find greater or equal for validating min / max (row and column) combinations */
        var otherValue = $(param).val();
        var result = this.optional(element) || Number(value) >= Number(otherValue);
        return this.optional(element) || Number(value) >= Number(otherValue);
    }, 'Invalid value.');

    $.validator.addMethod('lessThanOrEqual', function(value, element, param) { /* Function which checks to values to find less or equal for validating min / max (row and column) combinations */
        var otherValue = $(param).val();
        var result = this.optional(element) || Number(value) <= Number(otherValue);
        return this.optional(element) || Number(value) <= Number(otherValue);
    }, 'Invalid value.');
});

function clearBox(elementID) { /* Function which clears table */
    var div = document.getElementById(elementID);

    if (div) {
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }
}

function generateTable() {
    var activeTab = tabsArray[$("#tabs").tabs("option", "active")]; // Used to get active tab
    var minCol = Math.round(Number(document.getElementById('num1').value)); /* Get all inputed values */
    var maxCol = Math.round(Number(document.getElementById('num2').value));
    var minRow = Math.round(Number(document.getElementById('num3').value));
    var maxRow = Math.round(Number(document.getElementById('num4').value));

    clearBox(`mtable-${activeTab}`); /* Clear table for new table generation */

    var findTable = document.getElementById(`mtable-${activeTab}`);

    for (var i = minRow; i <= maxRow; i++) { /* Deal with first row of values. Insert necessary # of cells based on input */
        if (i == minRow) {
            var row  = findTable.insertRow(-1);
            temp = row.insertCell(-1);
            if (minCol % 2 == 1) {
                temp.style.background = "lightblue";
            }
        }
        temp = row.insertCell(-1);
        temp.textContent = i;
        temp.style.color="blue";
        temp.style.position = "sticky";
        temp.style.top = "0";
        if (minCol % 2 == 1) {
            temp.style.background = "lightblue";
        }
    }

    var curCol = minCol;

    for (var i = minCol; i <= maxCol; i++) { /* Iterate through variable dealing with column and insert dynamic number of rows according to user input */
        var row  = findTable.insertRow(-1);
        for (var j = minRow; j <= maxRow; j++) {
            if (j == minRow) { /* Deal with first column */
                temp = row.insertCell(-1);
                temp.textContent = curCol;
                temp.style.color="blue";
                temp.style.position = "sticky";
                temp.style.left = "0";
                if (i % 2 == 0) {
                    temp.style.background = "lightblue";
                }
            }
            temp = row.insertCell(-1);
            temp.textContent = j * i;
            if (i % 2 == 0) {
                temp.style.background = "lightblue";
            }
        }
        curCol++;
    }
}
