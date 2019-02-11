var data;

function getData() {

    if (document.title.split(" ").includes("Senate")) {
        console.log("in")
        fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
            method: "GET",
            headers: {
                "X-API-Key": "iA8AvbPRwIZr5mcjNOlH78YzCqjpDU8srpi5NjVo"
            }
        }).then(function (result) {
            return result.json()

        }).then(function (myData) {
            data = myData;
            var members = data.results[0].members;

            allMembers(members);


            if (document.title.split(" ").includes("Loyalty")) {

                most("votes_with_party_pct");
                least("votes_with_party_pct");
                createTableNames("total_votes", "votes_with_party_pct");
                createTableNum();
                document.getElementById("spinner1").style.display = "none";
                document.getElementById("spinner2").style.display = "none";
                document.getElementById("spinner3").style.display = "none";
            } else if (document.title.split(" ").includes("Attendance")) {
                most("missed_votes_pct");
                least("missed_votes_pct");
                createTableNames("missed_votes", "missed_votes_pct");
                createTableNum();
                document.getElementById("spinner1").style.display = "none";
                document.getElementById("spinner2").style.display = "none";
                document.getElementById("spinner3").style.display = "none";

            } else {
                createTable(members);
                document.getElementById("spinner").style.display = "none";
                statesSorted(members);
            }
        })

    } else {
        fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
            method: "GET",
            headers: {
                "X-API-Key": "iA8AvbPRwIZr5mcjNOlH78YzCqjpDU8srpi5NjVo"
            }
        }).then(function (result) {
            return result.json()

        }).then(function (myData) {
            data = myData
            members = data.results[0].members;
            console.log(document.title.split(" ").includes("Loyalty"))

            allMembers(members);

            if (document.title.split(" ").includes("Loyalty")) {

                most("votes_with_party_pct");
                least("votes_with_party_pct");
                createTableNames("total_votes", "votes_with_party_pct");
                createTableNum();
                document.getElementById("spinner1").style.display = "none";
                document.getElementById("spinner2").style.display = "none";
                document.getElementById("spinner3").style.display = "none";

            } else if (document.title.split(" ").includes("Attendance")) {
                most("missed_votes_pct");
                least("missed_votes_pct");
                createTableNames("missed_votes", "missed_votes_pct");
                createTableNum();
                document.getElementById("spinner1").style.display = "none";
                document.getElementById("spinner2").style.display = "none";
                document.getElementById("spinner3").style.display = "none";

            } else {
                createTable(members);
                document.getElementById("spinner").style.display = "none";
                statesSorted(members);
            }

        })
    }
}
getData();

var statistics = {
    "number": {

        "numberOfDemocrats": 0,
        "numberOfRepublicans": 0,
        "numberOfIndependents": 0,
        "averageOfDemocrats": 0,
        "averageOfRepublicans": 0,
        "averageOfIndependents": 0,
        "totalVotesPercent": 0,
    },
    "least": [],
    "most": [],

};

function allMembers(members) {

    var demVotes = 0;
    var repVotes = 0;
    var indVotes = 0;

    for (var i = 0; i < members.length; i++) {
        var parties = members[i].party;
        if (parties == "D") {
            statistics.number.numberOfDemocrats++;
            demVotes += members[i].votes_with_party_pct;
        }

        if (parties == "R") {
            statistics.number.numberOfRepublicans++;
            repVotes += members[i].votes_with_party_pct;
        }

        if (parties == "I") {
            statistics.number.numberOfIndependents++;
            indVotes += members[i].votes_with_party_pct;

        }
    }

    /*----- Calcular la media de los votos de cada partido ----- */

    statistics.number.averageOfDemocrats = (demVotes / statistics.number.numberOfDemocrats);
    statistics.number.averageOfRepublicans = (repVotes / statistics.number.numberOfRepublicans);
    statistics.number.averageOfIndependents = (indVotes / statistics.number.numberOfIndependents);
    statistics.number.totalVotesPercent = ((demVotes + repVotes + indVotes) / members.length);

    /*---- Si el tanto por ciento de independientes no aparece (NaN) entonces pon "0"----*/

    if (!statistics.number.averageOfIndependents) {
        statistics.number.averageOfIndependents = 0;
    }

}


function most(property) {
    var membersCopy = Array.from(data.results[0].members);

    membersCopy.sort(function (a, b) {
        return a[property] - b[property];
    });

    var porcent = Math.round(membersCopy.length / 10);
    for (var i = 0; i < porcent; i++) {
        statistics.most.push(membersCopy[i]);
    }

    for (var j = porcent; j < membersCopy.length; j++) {

        if (membersCopy[j - 1][property] == membersCopy[j][property]) {
            statistics.most.push(membersCopy[j]);
        } else {
            break;
        }
    }
}


function least(property) {
    var membersCopy = Array.from(data.results[0].members);
    membersCopy.sort(function (a, b) {
        return a[property] - b[property];
    });
    var reverse = membersCopy.reverse();
    console.log(reverse);
    var porcent = Math.round(reverse.length / 10);


    for (var x = 0; x < porcent; x++) {
        statistics.least.push(reverse[x]);

    }

    for (var y = porcent; y < reverse.length; y++) {
        if (reverse[y - 1][property] == reverse[y][property]) {
            console.log(reverse[y][property]);
            statistics.least.push(reverse[y]);
        } else {
            break;
        }
    }
}

function createTableNum() {

    var myTable = document.getElementById("myTable");
    var row1 = document.createElement("tr");
    var row2 = document.createElement("tr");
    var row3 = document.createElement("tr");
    var row4 = document.createElement("tr");

    row1.insertCell().innerHTML = "Democrats";
    row1.insertCell().innerHTML = statistics.number.numberOfDemocrats;
    row1.insertCell().innerHTML = statistics.number.averageOfDemocrats.toFixed(2) + " %";

    row2.insertCell().innerHTML = "Republicans";
    row2.insertCell().innerHTML = statistics.number.numberOfRepublicans;
    row2.insertCell().innerHTML = statistics.number.averageOfRepublicans.toFixed(2) + " %";

    row3.insertCell().innerHTML = "Independents";
    row3.insertCell().innerHTML = statistics.number.numberOfIndependents;
    row3.insertCell().innerHTML = statistics.number.averageOfIndependents.toFixed(2) + " %";

    row4.insertCell().innerHTML = "Total Votes";
    row4.insertCell().innerHTML = data.results[0].members.length;
    row4.insertCell().innerHTML = statistics.number.totalVotesPercent.toFixed(2) + " %";

    myTable.append(row1, row2, row3, row4);

}


function createTableNames(property1, property2) {

    var myTableBottom = document.getElementById("table_bottom");
    var membersLeast = statistics.least;
    var myTableTop = document.getElementById("table_top");
    var membersMost = statistics.most;
    var porcent = data.results[0].members.length / 10;

    for (var i = 0; i < porcent; i++) {
        var row = document.createElement("tr");

        row.insertCell().innerHTML = membersLeast[i].first_name + " " + (membersLeast[i].middle_name || "") + " " + membersLeast[i].last_name;
        row.insertCell().innerHTML = membersLeast[i][property1];
        row.insertCell().innerHTML = membersLeast[i][property2] + "&#37;";

        var rowTop = document.createElement("tr");

        rowTop.insertCell().innerHTML = membersMost[i].first_name + " " + (membersMost[i].middle_name || "") + " " + membersMost[i].last_name;
        rowTop.insertCell().innerHTML = membersMost[i][property1];
        rowTop.insertCell().innerHTML = membersMost[i][property2] + "&#37;";


        myTableBottom.append(row);
        myTableTop.append(rowTop);

    }

}

/*----- Si el id "rep" no da nulo entonces funciona el click_________  */

if (document.getElementById("rep") != null) {
    document.getElementById("rep").addEventListener("click", function () {
        createTable(data.results[0].members);
    });
    document.getElementById("dem").addEventListener("click", function () {
        createTable(data.results[0].members);
    });
    document.getElementById("ind").addEventListener("click", function () {
        createTable(data.results[0].members);
    });
    document.getElementById("state-filter").addEventListener("change", function () {
        createTable(data.results[0].members);
    });
}


function createTable(members) {
    var tbody = document.getElementById("senate-house-data");
    tbody.innerHTML = "";


    for (var i = 0; i < members.length; i++) {
        var row = document.createElement("tr");

        var fullNameCell = document.createElement("td");
        var partyCell = document.createElement("td");
        var stateCell = document.createElement("td");
        var seniorityCell = document.createElement("td");
        var VotesCell = document.createElement("td");

        var firstNameText = members[i].first_name;
        var middleNameText = members[i].middle_name;
        var lastNameText = members[i].last_name;
        var partyText = members[i].party;
        var stateText = members[i].state;
        var seniorityText = members[i].seniority;
        var VotesText = members[i].votes_with_party_pct;


        if (middleNameText == null) {
            middleNameText = "";
        }

        var fullnameText = firstNameText + ", " + middleNameText + " " + lastNameText;
        var VotesTextpercent = VotesText + "%";


        var link = members[i].url;
        var a = document.createElement("a");
        a.setAttribute("href", link);
        a.setAttribute("target", "_blank");
        a.innerHTML = fullnameText;


        fullNameCell.append(a);
        partyCell.append(partyText);
        stateCell.append(stateText);
        seniorityCell.append(seniorityText);
        VotesCell.append(VotesTextpercent);

        row.append(fullNameCell, partyCell, stateCell, seniorityCell, VotesCell);


        if (showMember(members[i])) {
            tbody.append(row);

        }
    }

    /* Cuando no hay filas crea una nueva para imprimir un aviso */

    if (tbody.rows.length == 0) {
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell.setAttribute('colspan', 5);
        cell.setAttribute("class", "centeredMessage");
        cell.append("Sorry, there are no members with this search criteria");
        row.append(cell);
        tbody.append(row);
    }
}


function showMember(myMember) {

    var parties = [];
    var repcheckbox = document.getElementById("rep");
    var demcheckbox = document.getElementById("dem");
    var indcheckbox = document.getElementById("ind");

    var selectedState = document.getElementById("state-filter").value;

    var filtroParty = false;
    var filtroState = false;


    if (repcheckbox.checked) {
        parties.push("R");
    }

    if (demcheckbox.checked) {
        parties.push("D");
    }

    if (indcheckbox.checked) {
        parties.push("I");
    }


    if ((parties.includes(myMember.party)) || (parties.length == 0)) {

        filtroParty = true;
    }

    if ((selectedState == myMember.state) || (selectedState == "All")) {
        filtroState = true;
    }


    return filtroParty && filtroState

}

function statesSorted(myArray) {

    var mystates = [];

    for (var i = 0; i < myArray.length; i++) {
        var states = myArray[i].state;

        if (!mystates.includes(states)) {
            mystates.push(states);
        }
    }

    mystates.sort();

    var select = document.getElementById("state-filter");

    for (var i = 0; i < mystates.length; i++) {
        var option = document.createElement("option");
        option.append(mystates[i]);
        select.append(option);
    }

}
