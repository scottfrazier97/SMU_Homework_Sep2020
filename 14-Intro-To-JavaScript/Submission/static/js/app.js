var table_data = data; // from data.js

$(document).ready(function() {
    // console.log("page loaded");
    // console.log(table_data);
    buildFilters();
    buildTable();

    //Event Listeners
    $("#filter-btn").on("click", function(e) {
        e.preventDefault();
        buildTable();
    });
    $("#form").on("submit", function(e) {
        e.preventDefault();
        buildTable();
    });
});

function buildFilters() {
    var unq_countries = [...new Set(table_data.map(x => x.country))];
    unq_countries.forEach(function(val) {
        var newOption = `<option>${val.toUpperCase()}</option>`;
        $('#country').append(newOption);
    });

    var unq_states = [...new Set(table_data.map(x => x.state))];
    unq_states.forEach(function(val) {
        var newOption = `<option>${val.toUpperCase()}</option>`;
        $('#state').append(newOption);
    });
}

function buildTable() {
    var dateFilter = $("#datetime").val(); //gets input value to filter
    var cityFilter = $("#city").val();
    var stateFilter = $("#state").val();
    var countryFilter = $("#country").val();
    var shapeFilter = $("#shape").val();

    //apply filters
    var filteredData = table_data;
    if (dateFilter) {
        filteredData = filteredData.filter(row => row.datetime === dateFilter.toLowerCase());
    }
    if (cityFilter) {
        filteredData = filteredData.filter(row => row.city === cityFilter.toLowerCase());
    }
    if (stateFilter) {
        filteredData = filteredData.filter(row => row.state === stateFilter.toLowerCase());
    }
    if (countryFilter) {
        filteredData = filteredData.filter(row => row.country === countryFilter.toLowerCase());
    }
    if (shapeFilter) {
        filteredData = filteredData.filter(row => row.shape === shapeFilter.toLowerCase());
    }

    // see if we have any data left
    if (filteredData.length === 0) {
        alert("No Data Found!");
    }

    buildTableString(filteredData);
}

function buildTableString(data) {
    // JQUERY creates an HTML string
    var tbody = $("#ufo-table>tbody");
    //clear table
    tbody.empty();

    //append data
    data.forEach(function(row) {
        var newRow = "<tr>"
            // loop through each Object (dictionary)
        Object.entries(row).forEach(function([key, value]) {
            // set the cell data
            newRow += `<td>${value}</td>`
        });

        //append to table
        newRow += "</tr>";
        tbody.append(newRow);
    });
}