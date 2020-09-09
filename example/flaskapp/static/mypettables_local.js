class TableStyle {
    constructor(searchbox="", csvbtn="", updatesbtn="", table="", tbody="",
                thead="",  spinner="")
    /**
     * Describe Appearance of Table
     * @param searchbox - is input text html element style - css class name
     * @param csvbtn - is csv button html element style - css class name
     * @param updatesbtn - is updatesbtn button html element style - css class name - Used in Updatable Tables
     * @param table - style for table - css class name
     * @param tbody - table body style - css class name
     * @param thead - table head style - css class name
     * @param spinner - loading spinner style - css class name
     */
    {
        this.searchbox = searchbox;
        this.csvbtn = csvbtn;
        this.updatesbtn = updatesbtn;
        this.table = table;
        this.tbody = tbody;
        this.thead = thead;
        this.spinner = spinner
    }
}


class MyFilteredSortedTable {
    constructor(div_id, table_headings, rows_data, column_types, clear_div= true,
                table_styles = new TableStyle())
    /**
     * The most basic table class. You can: to get table as .csv file, to search through table, to sort table.
     * You can customize table elements style and table spinner style
     * @param div_id - div container where table will be inserted
     * @param table_headings - heading of table columns - Array
     * @param rows_data - data of tables rows - Array of Arrays, where inner Array is Tble Row data
     * Len of table_headings should be = Len of rows_data
     * @param column_types - could be "num" for Number or "str" for all other column data types
     * column_types is used to perform correct sort of table based on elements types
     * @param clear_div - true or false. If you want to clear div before inserting table use true, otherwise - false
     * @param table_styles - TableStyle instance which contains table styles
     */

    {
        MyFilteredSortedTable._checkConstructorInputData(table_headings, rows_data, column_types, table_styles, clear_div);
        this.div_id = div_id;
        this.table_headings = table_headings;
        this.rows_data = rows_data;
        this.clear_div = clear_div;
        this.table_styles = table_styles;
        this.searchBox = MyFilteredSortedTable._createSearchBox(this.table_styles);
        this.btnCSV = MyFilteredSortedTable._createDownloadCSVBtn(this.table_styles);
        this.loadSpinner = MyFilteredSortedTable._createSpinner(this.table_styles);
        this.myTable = MyFilteredSortedTable._createTable(this.table_headings, this.rows_data, this.table_styles);
        this.column_types = column_types;
    }

    static _checkConstructorInputData(table_headings, rows_data, column_types, table_styles, clear_div)
    {
        if (!Array.isArray(table_headings)) { throw new Error("table_headings should be Array"); };
        if (!Array.isArray(rows_data)) { throw new Error("rows_data should be Array"); };
        if (!Array.isArray(column_types)) { throw new Error("column_types should be Array"); };
        if (!(table_styles instanceof TableStyle)) { throw new Error("table_styles should be TableStyle instance"); }
        if (!(typeof clear_div === "boolean")) { throw new Error("clear_div should be boolean"); }
        if (rows_data.length) {
            if (!Array.isArray(rows_data[0])) {throw new Error("rows_data should be Array of Arrays")};
            if (((table_headings.length !== rows_data[0].length) || (table_headings.length !== column_types.length))) {
                throw new Error("Length of table_headings, rows_data, column_types should be equal");
            } else {
                if (table_headings.length !== column_types.length) {
                    throw new Error("Length of table_headings, column_types should be equal");
                }
            }
        }
        for (let i=1; i<rows_data.length; i++) {
            if (!Array.isArray(rows_data[i])) {throw  new Error("rows_data should be Array of Arrays")};
            if (rows_data[i].length !== rows_data[0].length) {
                throw new Error("All Arrays inside rows_data should have the same length");
            };
        }
        for (let i=0; i<column_types.length; i++) {
            if (column_types[i] === "num") {}
            else if (column_types[i] === "str") {}
            else {throw new Error("column_types should contain only 'num' or 'str' values");}
        }
    }

    static _createSpinner(table_styles) {
        let spinnerDiv = document.createElement("div");
        spinnerDiv.setAttribute("class", String(table_styles.spinner));
        spinnerDiv.style.display = "none";
        return spinnerDiv
    }

    static _createSearchBox(table_styles) {
        let _searchBox = document.createElement("input");
        _searchBox.setAttribute("class", String(table_styles.searchbox));
        _searchBox.style.marginBottom = "3px";
        _searchBox.setAttribute("placeholder", "Пожалуйста введите часть слова, которое ищете ...");
        return _searchBox
    }

    static _createDownloadCSVBtn(table_styles) {
        let btn = document.createElement("button");
        btn.innerText = "CSV";
        btn.style.marginBottom = "3px";
        btn.setAttribute("class", String(table_styles.csvbtn));
        return btn
    }

    static _createTable(_table_headings, _rows_data, table_styles) {
        let myTable = document.createElement("table");
        myTable.setAttribute("class", String(table_styles.table));

        // create table head block
        let th_row = document.createElement("tr");
        for (let i=0; i<_table_headings.length; i++) {
            let element = document.createElement("th");
            element.innerHTML = _table_headings[i] + " <b><span style='font-size: 22px;'>&#8593;&#8595;</span></b>";
            th_row.appendChild(element);
        }
        let tableHead = document.createElement("thead");
        tableHead.setAttribute("class", String(table_styles.thead));
        tableHead.appendChild(th_row);
        myTable.appendChild(tableHead);

        // create table body block
        let tableBody = document.createElement("tbody");
        tableBody.setAttribute("class", String(table_styles.tbody));

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

    static _sortItemsFunc(index, _type, order, pure_array) {
        /**
         * wrapper for inner function to provide additional args
         * index - number of item in Array (column number in Table)
         * _type can be "num" or "str"
         * order - descending or ascending sort order
         * pure_array - boolean flag - indicates if we sort pure Array or rows from Table
         */
        function inner(a, b) {
            /**
             * is used in sort JS function, logic is made according to rules of the sort JS
             * a, b - are some rows in the Table
             */
            let valueA = "";
            let valueB = "";
            if (pure_array) {
                valueA = a[index];
                valueB = b[index];
            } else {
                valueA = a.getElementsByTagName("td").item(index).innerText;
                valueB = b.getElementsByTagName("td").item(index).innerText;
            }
            if (_type === "num") {
                valueA = Number(valueA);
                valueB = Number(valueB);
            }

            if (valueA > valueB) {
                return 1 * order
            } else if (valueA < valueB) {
                return -1 * order
            } else {
                return 0
            }
        }
        return inner
    }

    static _sortTableArray(index, _type, pure_array) {
        /**
         * wrapper Closure for innerFunc to provide additional arguments and keep state with _order variable
         * index - column number in the table
         * _type - can be "num" or "str" - type of the column
         * pure_array - boolean flag - indicates if we sort pure Array or rows from Table
         */
        let _order = 1; // asc or desc sort order
        function innerFunc(array) {
            /**
             * sorts elements of Array and returns a new Array
             * array - some Array created from Table element
             */
            let f = MyFilteredSortedTable._sortItemsFunc(index, _type, _order, pure_array);
            _order *= -1;
            return Array.from(array.sort((a, b) => f(a, b)))
        }
        return innerFunc
    }

    static _sortTable(myTable, spinner, sortFunc)
    /**
     * sorts Table based on sortFunc which includes column number and its column data type,
     * _sortTable is attached to each table column header
     * @param myTable - table element inside the div where table was created
     * @param spinner - spinner element inside the div where table was created
     * @param sortFunc - created a new Array which is composed of sorted Table rows
     * @private
     */
    {
        let bodyRows = myTable.children[1].getElementsByTagName("tr");
        let tempBodyRowsArray = Array.from(bodyRows);
        spinner.style.display = "";
        myTable.children[1].style.display = "none";

        // setTimeout is used in order to hide table body, does not work otherwise
        setTimeout(()=> {
            let data = sortFunc(tempBodyRowsArray);
            for (let i = 0; i < data.length; i++) { myTable.children[1].appendChild(data[i]); }
            spinner.style.display = "none";
            myTable.children[1].style.display = "";
            this.sort_order = !this.sort_order;
        }, 100);
    }

    static _exportCSV(table)
    /**
     * Makes Browser to take data from webpage table element (inside the div) and return .csv file
     * including hidden elements!
     * @param table - the tabble element inside the div
     * @private
     */
    {
        let bodyCSV = "";

        let tableTheadRow = table.children[0].getElementsByTagName("th");
        let tableTbodyRows = table.children[1].getElementsByTagName("tr");

        let bodyTableArray = [];
        let headTableArray = [];
        for (let element of tableTheadRow) {
            let data = element.innerText.replace(
                /(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ');
            data = data.replace(/"/g, '""');
            data = data.replace(/↑↓/g, "")
            headTableArray.push('"' + data + '"');
        }
        bodyTableArray.push(headTableArray.join(";"));
        for (let row of tableTbodyRows) {
            let temp = [];
            for (let element of row.getElementsByTagName("td")) {
                let data = element.innerText.replace(
                    /(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ');
                data = data.replace(/"/g, '""');
                temp.push('"' + data + '"');}
            bodyTableArray.push(temp.join(";"));
        }
        bodyCSV += bodyTableArray.join("\n");

        const tableHTMLURL = "data:text/csv/charset=UTF-8, " + encodeURIComponent(bodyCSV);
        MyFilteredSortedTable._triggerDownload(tableHTMLURL, "table_utf8_encoding.csv");
    }

    static _triggerDownload(url, filename)
    /**
     * is support function to download table from the div
     * @param url - hidden link element to download the page
     * @param filename - filename we gonna download
     * @private
     */
    {
        // is used to create invisible link to download table
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    static _filterTableBody(_tableBody, _searchBox)
    /**
     * Filter (hide) table rows based on value in searchbox
     * @param _tableBody - tbody element inside the div
     * @param _searchBox - searchbox (input) element inside the div
     * @private
     */
    {
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

    create_filtered_sorted_table()
    /**
     * creates all elements of the Table and put them inside the chosen div
     */
    {
        let divContainer = document.getElementById(this.div_id);
        if (this.clear_div) {divContainer.innerText = "";};

        let tableHead = this.myTable.children[0];
        let tableBody = this.myTable.children[1];

        this.searchBox.addEventListener("keyup", () => {
            MyFilteredSortedTable._filterTableBody(tableBody, this.searchBox);
        });

        // add event handler to column headers
        for (let index=0; index<tableHead.children[0].childElementCount; index++) {
            let sortFunc = MyFilteredSortedTable._sortTableArray(index, this.column_types[index], false);
            tableHead.children[0].children[index].addEventListener("click", ()=>{
                MyFilteredSortedTable._sortTable(this.myTable, this.loadSpinner, sortFunc);
            });
        }

        this.btnCSV.addEventListener("click", () => { MyFilteredSortedTable._exportCSV(this.myTable); });

        divContainer.appendChild(this.btnCSV);
        divContainer.appendChild(this.searchBox);
        divContainer.appendChild(this.myTable);
        divContainer.appendChild(this.loadSpinner);
    }
}

class MyFilterSortUpdTable extends MyFilteredSortedTable
{
    constructor(div_id, table_headings, rows_data, column_types, url, update_interval=10,
                clear_div = true, table_styles=new TableStyle())
    /**
     * The basic table type with scheduled updates of table info.
     * Updates can be stopped with the help of the certain button or if you put some data in the searchbox.
     * The table have element search, columns can be sorted, you can get .csv file from the table
     * @param div_id - div container where table will be inserted
     * @param table_headings - heading of table columns - Array
     * @param rows_data - data of tables rows - Array of Arrays, where inner Array is Tble Row data
     * @param column_types - could be "num" for Number or "str" for all other column data types
     * @param url - backend endpoint, which provide scheduled updates for the table
     * @param update_interval - interval in seconds. Updates frequency.
     * @param clear_div - true or false. If you want to clear div before inserting table use true, otherwise - false
     * @param table_styles - TableStyle instance which contains table styles
     */
    {
        MyFilterSortUpdTable._checkConstructorInputDataFilterSortUpd(url, update_interval);
        super(div_id, table_headings, rows_data, column_types, clear_div, table_styles);
        this.url = url;
        this.update_interval = update_interval;
        this.do_updates = true ; // flag whether table should be updated, the flag is attached to button
        this.btnUpd = MyFilterSortUpdTable._createStopResUpdBtn(this.table_styles);
        // table body is recreated after each update. Searchbox is used as condition flag.
        setInterval(
            () => { MyFilterSortUpdTable._updateTableBody(this.myTable, this.searchBox, this.loadSpinner, this.url) },
            this.update_interval * 1000
        );
    }

    static _createStopResUpdBtn(table_styles) {
        let btn = document.createElement("button");
        btn.innerText = "Не Обновлять";
        btn.style.marginBottom = "3px";
        btn.style.marginLeft = "5px";
        btn.setAttribute("class", String(table_styles.updatesbtn));
        return btn
    }

    static _stopPeriodicUpdates(e)
    /**
     * Change value of DO_UPDATES flag to the opposite, it is attachen to Stop/Renew Updates Btn
     */
    {
        if (typeof this.do_updates === "undefined") { this.do_updates = true }; // otherwise can cause problem
        if (this.do_updates) {
            this.do_updates = false;
            e.target.innerText = "Обновлять";
        } else {
            this.do_updates = true;
            e.target.innerText = "Не Обновлять";
        }
        e.preventDefault();
    }

    static _checkConstructorInputDataFilterSortUpd(url, update_interval) {
        if (typeof update_interval !== "number") {throw new Error("update_interval should be number")};
        if (update_interval <= 0) {throw new Error("update_interval should be number")};
        if (typeof url !== "string") {throw new Error("update_interval should be number")};
    }

    static _updateTableBody(table, searchBox, spinner, url)
    /**
     * Created new table body with the data received from backend endpoint.
     * searchBox is used as condition. Spinner changes its style
     * @param table - the Table element
     * @param searchBox - the input element
     * @param spinner - the spinner element
     * @param url - url to get updates
     * @private
     */
    {
        if (typeof this.do_updates === "undefined") { this.do_updates = true}; // otherwise can  cause problem
        if (searchBox.value === "" && this.do_updates) {
            spinner.style.display = "";
            table.children[1].style.display = "none"
            fetch(url, {method: 'GET',})
                .then(response => response.json())
                .then(data => {
                    let tableBody = table.children[1];
                    tableBody.innerHTML = "";
                    for (let i = 0; i < data.length; i++) {
                        let body_row = document.createElement("tr");
                        for (let j = 0; j < data[i].length; j++) {
                            let element = document.createElement("td");
                            element.innerText = data[i][j];
                            body_row.appendChild(element);
                        }
                        tableBody.appendChild(body_row);
                    }
                    spinner.style.display = "none";
                    table.children[1].style.display = "";
                })
                .catch((error) => { console.log(error); })
        } else {};  // do nothing = pass
    }

    create_filtered_sorted_table() {
        let divContainer = document.getElementById(this.div_id);
        if (this.clear_div) {divContainer.innerText = "";};

        let tableHead = this.myTable.children[0];
        let tableBody = this.myTable.children[1];

        this.searchBox.addEventListener("keyup", () => {
            MyFilterSortUpdTable._filterTableBody(tableBody, this.searchBox);
        });

        // add event handler to column headers
        for (let index=0; index<tableHead.children[0].childElementCount; index++) {
            let sortFunc = MyFilteredSortedTable._sortTableArray(index, this.column_types[index], false);
            tableHead.children[0].children[index].addEventListener("click", ()=>{
                MyFilteredSortedTable._sortTable(this.myTable, this.loadSpinner, sortFunc);
            });
        }

        this.btnCSV.addEventListener("click", () => { MyFilterSortUpdTable._exportCSV(this.myTable); });
        this.btnUpd.addEventListener("click", (e) => { MyFilterSortUpdTable._stopPeriodicUpdates(e); });
        divContainer.appendChild(this.btnCSV);
        divContainer.appendChild(this.btnUpd); // new element here in comparison with Basic Table
        divContainer.appendChild(this.searchBox);
        divContainer.appendChild(this.myTable);
        divContainer.appendChild(this.loadSpinner);
    }
}

class PagedTable extends MyFilteredSortedTable
{
    constructor(div_id, table_headings, rows_data, column_types,
                clear_div = true, table_styles = new TableStyle())
    /**
     * Table which provide paginated presentation of data. Has the same features as Basic table:
     * to get table as .csv file, to search through table, to sort table.
     * To use standard styles of the Table, you have to use Bootstrap, since styles of some elements are predefined
     * @param div_id - div container where table will be inserted
     * @param table_headings - heading of table columns - Array
     * @param rows_data - data of tables rows - Array of Arrays, where inner Array is Tble Row data
     * Len of table_headings should be = Len of rows_data
     * @param column_types - could be "num" for Number or "str" for all other column data types
     * column_types is used to perform correct sort of table based on elements types
     * @param clear_div - true or false. If you want to clear div before inserting table use true, otherwise - false
     * @param table_styles - TableStyle instance which contains table styles
     */
    {
        super(div_id, table_headings, rows_data, column_types, clear_div, table_styles);
        this.tableRows = rows_data; // is used since we do not display all table, but need to make sort and search on all elements
        // the block is used to define initial look (Next, Prev buttons) of paginator element
        if (this.tableRows.length > 0) {
            this.curPage = 1;
        } else {
            this.curPage = 0;
        }
        this.visibleTable = PagedTable._createPagedTableVisible(
            this.table_headings, this.tableRows, this.table_styles);

        this.pagination = PagedTable._createPaginator(this.table_headings, this.btnCSV, this.myTable, this.div_id,
            this.tableRows, this.curPage, 10, this.table_styles);

        this.searchBox = PagedTable._createSearchBox(this.table_headings, this.btnCSV, this.myTable, this.div_id,
            this.tableRows, this.curPage, 10, this.table_styles);

        [this.itemNumberBtn, this.itemMenu] = PagedTable._createItemNumberBtn(this.table_headings, this.btnCSV,
            this.myTable, this.div_id, this.tableRows, this.curPage, 10, this.table_styles);
    }

    static _createItemNumberBtn(table_headings, btnCSV, table, div_id, rows_data, cur_page, items_page, table_styles) {
        let btn = document.createElement("button");
        btn.setAttribute("class", "btn btn-outline-success dropdown-toggle");
        btn.setAttribute("data-toggle", "dropdown");
        btn.setAttribute("items_per_page", "10");
        btn.innerText = "Элементов на странице";
        btn.style.marginBottom = "3px";
        btn.style.marginLeft = "3px";
        let dropDownMenuContainer = document.createElement("div");
        dropDownMenuContainer.setAttribute("class", "dropdown-menu");
        let values = [5, 10, 15, 20, 25, 30, 50, 75, 100];
        for (let i of values) {
            let _link = document.createElement("a");
            _link.innerText = String(i);
            _link.setAttribute("class", "dropdown-item");
            _link.setAttribute("href", "#" + div_id);
            let tableBody = table.getElementsByTagName("tbody").item(0);
            let tableHead = table.getElementsByTagName("thead").item(0);
            let container = document.getElementById(div_id)
            _link.addEventListener("click", (e) => {
                let searchBox = container.getElementsByTagName("input").item(0);
                let activeTableRows = []
                for (let i=0; i<rows_data.length; i++) {
                    let found = false;
                    for (let j=0; j<rows_data[i].length; j++) {
                        if (String(rows_data[i][j]).toLowerCase().includes(
                            searchBox.value.toLowerCase())) {
                            found = true;
                            break
                        }
                    }
                    if (found) {
                        activeTableRows.push(rows_data[i])
                    }
                }
                let cur_page = 1;
                if (activeTableRows.length === 0) { cur_page = 0 }

                items_page = Number(e.target.innerText);
                btn.setAttribute("items_per_page", e.target.innerText)
                tableBody = PagedTable._fillTableBody(tableBody, activeTableRows, cur_page, items_page);
                tableHead = PagedTable._fillTableHead(tableHead, table_headings);
                let navItem = PagedTable._createPaginator(
                    table_headings, btnCSV, table, div_id, activeTableRows, cur_page, items_page, table_styles);
                // search should be done over all elements so rows_data is used
                let newSearchBox = PagedTable._createSearchBox(
                    table_headings, btnCSV, table, div_id, rows_data, cur_page, items_page, table_styles);
                newSearchBox.value = searchBox.value;
                table.appendChild(tableHead);
                table.appendChild(tableBody);

                container.removeChild(container.lastChild);
                container.removeChild(container.lastChild);
                container.removeChild(container.lastChild);
                container.appendChild(newSearchBox);
                container.appendChild(table);
                container.appendChild(navItem);

                let chooseElementNumberBtn = container.getElementsByTagName("button").item(1);
                chooseElementNumberBtn.innerText = `Элементов: ${e.target.innerText}`
            })
            dropDownMenuContainer.appendChild(_link);
        }
        return [btn, dropDownMenuContainer]
    }

    static _createSearchBox(table_headings, btnCSV, table, div_id, rows_data, cur_page, items_page, table_styles) {
        // hide rows of the table based on value of searchBox
        let _searchBox = document.createElement("input");
        _searchBox.setAttribute("class", String(table_styles.searchbox));
        _searchBox.style.marginBottom = "3px";
        _searchBox.setAttribute("placeholder", "Пожалуйста введите часть слова, которое ищете ...");
        let tableBody = table.getElementsByTagName("tbody").item(0);
        let tableHead = table.getElementsByTagName("thead").item(0);

        _searchBox.addEventListener("keyup", (e) => {
            let activeTableRows = []
            for (let i=0; i<rows_data.length; i++) {
                let found = false;
                for (let j=0; j<rows_data[i].length; j++) {
                    if (String(rows_data[i][j]).toLowerCase().includes(
                        _searchBox.value.toLowerCase())) {
                        found = true;
                        break
                    }
                }
                if (found) {
                    activeTableRows.push(rows_data[i])
                }
            }

            let cur_page = 1;
            if (activeTableRows.length === 0) { cur_page = 0}
            let container = document.getElementById(div_id);
            let items_page = Number(container.getElementsByTagName("button").item(
                1).getAttribute("items_per_page"));
            tableBody = PagedTable._fillTableBody(tableBody, activeTableRows, cur_page, items_page);
            tableHead = PagedTable._fillTableHead(tableHead, table_headings);

            let navItem = PagedTable._createPaginator(table_headings, btnCSV, table, div_id, activeTableRows,
                cur_page, items_page, table_styles);
            table.appendChild(tableHead);
            table.appendChild(tableBody);
            container.removeChild(container.lastChild);
            container.removeChild(container.lastChild);
            container.appendChild(table);
            container.appendChild(navItem);
            e.preventDefault();
        })
        return _searchBox
    }

    static _fillTableBody(tableBody, rows_data, cur_page, items_page) {
        tableBody.innerHTML = ""
        const totalPageNumber = Math.ceil(rows_data.length/items_page);
        if (totalPageNumber > 0) {
            let startI = (cur_page - 1) * items_page;
            let stopI = cur_page * items_page;
            let subArray = rows_data.slice(startI, stopI);
            for (let i=0; i<subArray.length; i++) {
                let body_row = document.createElement("tr");
                for (let j=0; j<subArray[i].length; j++) {
                    let element = document.createElement("td");
                    element.innerText = subArray[i][j];
                    body_row.appendChild(element);
                }
                tableBody.appendChild(body_row);
            }
        }
        return tableBody
    }

    static _exportCSV(tableHead, tableRows) {
        let bodyCSV = "";
        let bodyTableArray = [];
        let headTableArray = [];
        for (let element of tableHead) {
            headTableArray.push('"' + element + '"');
        }
        bodyTableArray.push(headTableArray.join(";"));
        for (let row of tableRows) {
            let temp = [];
            for (let element of row) {
                temp.push('"' + element + '"');}
            bodyTableArray.push(temp.join(";"));
        }
        bodyCSV += bodyTableArray.join("\n");

        const tableHTMLURL = "data:text/csv/charset=UTF-8, " + encodeURIComponent(bodyCSV);
        MyFilteredSortedTable._triggerDownload(tableHTMLURL, "table_utf8_encoding.csv");
    }

    static _findVisiblePageNumbers(cur, page_to_show_num, total) {
        if (cur === 0) {
            return []
        }
        let pages_to_show_array = [];
        let left_pages_number = Math.floor((page_to_show_num - 1)/2);
        let right_pages_number = page_to_show_num - left_pages_number - 1;
        if (right_pages_number + cur - total > 0) {
            left_pages_number = left_pages_number + (right_pages_number + cur - total);
        }
        let temp_cur = cur;
        while (temp_cur > 1) {
            if (left_pages_number === 0) {
                break
            }
            left_pages_number -= 1;
            temp_cur -= 1;
            pages_to_show_array.push(temp_cur);
        }
        pages_to_show_array.sort();
        pages_to_show_array.push(cur);
        temp_cur = cur + 1;
        right_pages_number += left_pages_number;
        while (right_pages_number > 0) {
            if (temp_cur > total) {
                break
            }
            pages_to_show_array.push(temp_cur);
            temp_cur += 1;
            right_pages_number -= 1;
        }
        return pages_to_show_array
    }

    static _createPaginator(table_headings, btnCSV, table, div_id, rows_data, cur_page, items_page, table_styles) {
        const totalPageNumber = Math.ceil(rows_data.length/items_page);
        let tableBody = table.getElementsByTagName("tbody").item(0);
        let tableHead = table.getElementsByTagName("thead").item(0);

        let navItem = document.createElement("nav");
        navItem.setAttribute("aria-label", "pagination");
        let uList = document.createElement("ul");
        uList.setAttribute("class", "pagination justify-content-center");

        // crete Previous button in paginator
        let listItemPrev = document.createElement("li");
        let last_link = document.createElement("a");
        last_link.innerText = "Назад";
        last_link.setAttribute("href", "#" + div_id);
        last_link.setAttribute("class", "page-link");

        if (cur_page <= 1) {
            listItemPrev.setAttribute("class", "page-item disabled");
        } else {
            listItemPrev.setAttribute("class", "page-item");
            last_link.addEventListener("click", (e) => {
                tableBody = PagedTable._fillTableBody(tableBody, rows_data, cur_page - 1, items_page);
                tableHead = PagedTable._fillTableHead(tableHead, table_headings);
                let navItem = PagedTable._createPaginator(table_headings, btnCSV, table, div_id, rows_data,
                    cur_page - 1, items_page, table_styles);
                table.appendChild(tableHead);
                table.appendChild(tableBody);
                let container = document.getElementById(div_id)
                container.removeChild(container.lastChild);
                container.removeChild(container.lastChild);
                container.appendChild(table);
                container.appendChild(navItem);
            })
        }
        listItemPrev.appendChild(last_link);
        uList.appendChild(listItemPrev);

        let visPagesNum = PagedTable._findVisiblePageNumbers(cur_page, 11, totalPageNumber);
        for (let p of visPagesNum) {
            let listItem = document.createElement("li");
            if (p === cur_page) {
                listItem.setAttribute("class", "page-item active");
            } else {
                listItem.setAttribute("class", "page-item");
            }
            let _link = document.createElement("a");
            _link.innerText = `${p}`;
            _link.setAttribute("href", "#" + div_id);
            _link.setAttribute("class", "page-link");

            _link.addEventListener("click", (e) => {
                tableBody = PagedTable._fillTableBody(tableBody, rows_data, Number(_link.innerText), items_page);
                tableHead = PagedTable._fillTableHead(tableHead, table_headings);
                let navItem = PagedTable._createPaginator(table_headings, btnCSV, table, div_id,
                    rows_data, Number(_link.innerText), items_page, table_styles);
                table.appendChild(tableHead);
                table.appendChild(tableBody);
                let container = document.getElementById(div_id);
                container.removeChild(container.lastChild);
                container.removeChild(container.lastChild);
                container.appendChild(table);
                container.appendChild(navItem);
            })

            listItem.appendChild(_link);
            uList.appendChild(listItem);
        }

        // create Next Button
        let listItemNext = document.createElement("li");
        let next_link = document.createElement("a");
        next_link.innerText = "Далее";
        next_link.setAttribute("href", "#" + div_id);
        next_link.setAttribute("class", "page-link");

        if (cur_page === totalPageNumber) {
            listItemNext.setAttribute("class", "page-item disabled");
        } else {
            listItemNext.setAttribute("class", "page-item");
            next_link.addEventListener("click", () => {
                tableBody = PagedTable._fillTableBody(tableBody, rows_data, cur_page + 1, items_page);
                tableHead = PagedTable._fillTableHead(tableHead, table_headings);
                let navItem = PagedTable._createPaginator(table_headings, btnCSV, table, div_id, rows_data,
                    cur_page + 1, items_page, table_styles);
                table.appendChild(tableHead);
                table.appendChild(tableBody);
                let container = document.getElementById(div_id);
                container.removeChild(container.lastChild);
                container.removeChild(container.lastChild);
                container.appendChild(table);
                container.appendChild(navItem);
            })
        }

        listItemNext.appendChild(next_link);
        uList.appendChild(listItemNext);

        navItem.appendChild(uList);
        return navItem
    }

    static _fillTableHead(tableHead, table_headings) {
        tableHead.innerHTML = ""
        let th_row = document.createElement("tr");
        for (let i=0; i<table_headings.length; i++) {
            let element = document.createElement("th");
            element.innerHTML = table_headings[i] + " <b><span style='font-size: 22px;'>&#8593;&#8595;</span></b>";
            element.addEventListener("click", () => {
                console.log("CCC");
            })
            th_row.appendChild(element);
        }
        tableHead.appendChild(th_row);
        return tableHead
    }

    static _createPagedTableVisible(_table_headings, _rows_data, table_styles) {
        let myTable = document.createElement("table");
        myTable.setAttribute("class", String(table_styles.table));
        let tableHead = document.createElement("thead");
        tableHead = PagedTable._fillTableHead(tableHead, _table_headings);
        tableHead.setAttribute("class", String(table_styles.thead));
        myTable.appendChild(tableHead);

        // create table body block
        let tableBody = document.createElement("tbody");
        tableBody.setAttribute("class", String(table_styles.tbody));
        let cur_page = 0
        if (_rows_data.length>0) {cur_page = 1};
        tableBody = PagedTable._fillTableBody(tableBody, _rows_data, cur_page, 10)
        myTable.appendChild(tableBody);

        return myTable
    }

    create_filtered_sorted_table() {
        // the methods insert our table in the chosen div container
        let divContainer = document.getElementById(this.div_id);
        if (this.clear_div) {divContainer.innerText = "";};
        this.btnCSV.addEventListener("click", () => { PagedTable._exportCSV(this.table_headings, this.tableRows); });
        divContainer.appendChild(this.btnCSV);
        divContainer.appendChild(this.itemNumberBtn);
        divContainer.appendChild(this.itemMenu);
        divContainer.appendChild(this.searchBox);
        divContainer.appendChild(this.visibleTable);
        divContainer.appendChild(this.pagination);
    }
}