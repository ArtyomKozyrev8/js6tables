class TableColumnSort {
    // the class is used inside MyFilteredSortedTable class
    constructor() {
        this.sort_order = true; // indicates whether ascending or descending order should be implemented
        // sort_order keeps state for method sortMyFilteredSortedTableColumn
    }

    sortMyFilteredSortedTableColumn(myTable, index) {
        // index is the order number of cell in table (myTable) header
        let bodyRows = myTable.children[1].getElementsByTagName("tr");
        let tempBodyRowsArray = Array.prototype.slice.call(bodyRows, 0); // convert collection to Array
        // the implemented below logic is based on bubble sort:
        for (let i = 0; i < tempBodyRowsArray.length; i++) {
            for (let j = 0; j < tempBodyRowsArray.length; j++) {
                let cellI = tempBodyRowsArray[i].getElementsByTagName("td").item(index).innerText;
                let cellJ = tempBodyRowsArray[j].getElementsByTagName("td").item(index).innerText;
                if (this.sort_order) {
                    if (cellI > cellJ) {
                        let c = tempBodyRowsArray[i];
                        tempBodyRowsArray[i] = tempBodyRowsArray[j];
                        tempBodyRowsArray[j] = c;
                    }
                } else {
                    if (cellI < cellJ) {
                        let c = tempBodyRowsArray[i];
                        tempBodyRowsArray[i] = tempBodyRowsArray[j];
                        tempBodyRowsArray[j] = c;
                    }
                }
            }
            for (let i = 0; i < tempBodyRowsArray.length; i++) {
                myTable.children[1].appendChild(tempBodyRowsArray[i]);
            }
        }
        this.sort_order = !this.sort_order;
    }
}

class MyFilteredSortedTable {
    constructor(div_id,
                table_headings,
                rows_data,
                table_styles={
                    "searchbox": "", // is input text html element style - css class name
                    "table": "", // style for table - css class name
                    "tbody": "", // table body style - css class name
                    "thead": "" // table head style - css class name
                }) {
        this.div_id = div_id; // div id in DOM where we would like to see our table
        this.table_headings = table_headings; // Array of table heading
        this.rows_data = rows_data; // Array of Arrays - table lines data
        this.table_styles = table_styles;
        this.searchBox = MyFilteredSortedTable._createSearchBox(this.table_styles);
        this.myTable = MyFilteredSortedTable._createTable(this.table_headings, this.rows_data, this.table_styles);
    }

    static _createSearchBox(table_styles) {
        let _searchBox = document.createElement("input");
        _searchBox.setAttribute("class", table_styles["searchbox"]);
        _searchBox.style.marginBottom = "10px";
        _searchBox.setAttribute("placeholder", "Print part of the word, you are searching for ...");
        return _searchBox
    }

    static _filterTableBody(_tableBody, _searchBox) {
        // hide rows of the table based on value of searchBox
        for (let i=0; i<_tableBody.childElementCount; i++) {
            let found = false;
            for (let j=0; j<_tableBody.children[i].childElementCount; j++) {
                if (_tableBody.children[i].children[j].innerText.toLowerCase().includes(
                    _searchBox.value.toLowerCase())) {
                    found = true;
                    break
                }
            }
            if (!found) {
                _tableBody.children[i].style.display = 'none';
            } else {
                _tableBody.children[i].style.display = '';
            }
        }
    }

    static _createTable(_table_headings, _rows_data, table_styles) {
        let myTable = document.createElement("table");
        myTable.setAttribute("class", table_styles["table"]);

        // create table head block
        let th_row = document.createElement("tr");
        for (let i=0; i<_table_headings.length; i++) {
            let element = document.createElement("th");
            element.innerHTML = _table_headings[i] + " <b><span style='font-size: 22px;'>&#8593;&#8595;</span></b>";
            th_row.appendChild(element);
        }
        let tableHead = document.createElement("thead");
        tableHead.setAttribute("class", table_styles["thead"]);
        tableHead.appendChild(th_row);
        myTable.appendChild(tableHead);

        // create table body block
        let tableBody = document.createElement("tbody");
        tableBody.setAttribute("class", table_styles["tbody"]);

        for (let i=0; i<_rows_data.length; i++) {
            let body_row = document.createElement("tr");
            for (let j=0; j<_rows_data[i].length; j++) {
                let element = document.createElement("td");
                element.innerText = _rows_data[i][j];
                body_row.appendChild(element);
            }
            tableBody.appendChild(body_row);
        }
        myTable.appendChild(tableBody);

        return myTable

    }

    create_filtered_sorted_table() {
        // the methods insert our table in the chosen div container
        let divContainer = document.getElementById(this.div_id);
        divContainer.innerText = ""; // comment the line if you want to create several tables in one div
        let tableHead = this.myTable.children[0];
        let tableBody = this.myTable.children[1];

        this.searchBox.addEventListener("keyup", () => {
            MyFilteredSortedTable._filterTableBody(tableBody, this.searchBox);
        });

        // add event handler to column headers
        for (let index=0; index<tableHead.children[0].childElementCount; index++) {
            let sort = new TableColumnSort();
            tableHead.children[0].children[index].addEventListener("click", ()=>{
                sort.sortMyFilteredSortedTableColumn(this.myTable, index);
            });
        }

        divContainer.appendChild(this.searchBox);
        divContainer.appendChild(this.myTable);
    }
}
