class TableStyle {
    constructor(searchbox="", csvbtn="", updatesbtn="", table="", tbody="",
                thead="",  spinner="")
    /**
     * Describe Appearance of Table
     * @param searchbox - is input text html element style - css class name
     * @param csvbtn - is csv button html element style - css class name
     * @param updatesbtn - is button html element style - css class name - Used in Updatable Tables
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
        this.spinner = spinner;
    }
}


class BasicTable {
    constructor(div_id, table_headings, rows_data, column_types, clear_div= true,
                table_styles = new TableStyle())
    /**
     * The most basic table class. You can: to get table as .csv file, to search through table, to sort table.
     * You can customize table elements style and table spinner style
     * @param div_id - div container where table will be inserted
     * @param table_headings - heading of table columns - Array
     * @param rows_data - data of tables rows - Array of Arrays, where inner Array is Table Row data
     * Len of table_headings should be = Len of rows_data
     * @param column_types - could be "num" for Number or "str" for all other column data types
     * column_types is used to perform correct sort of table based on elements types
     * @param clear_div - true or false. If you want to clear div before inserting table use true, otherwise - false
     * @param table_styles - TableStyle instance which contains table styles
     */

    {
        BasicTable._checkConstructorInputData(table_headings, rows_data, column_types, table_styles, clear_div);
        this.div_id = div_id;
        this.table_headings = table_headings;
        this.rows_data = rows_data;
        this.clear_div = clear_div;
        this.table_styles = table_styles;
        this.searchBox = BasicTable._createSearchBox(this.table_styles);
        this.btnCSV = BasicTable._createDownloadCSVBtn(this.table_styles);
        this.loadSpinner = BasicTable._createSpinner(this.table_styles);
        this.TheTable = BasicTable._createTable(this.table_headings, this.rows_data, this.table_styles);
        this.column_types = column_types;
    }

    static _checkConstructorInputData(table_headings, rows_data, column_types, table_styles, clear_div)
    /**
     * checks data to create Table
     * @param table_headings - array of string, should be equal to rows_data length
     * @param rows_data - array of arrays, length of array should be equal to table_headings length
     * @param column_types - array of strings (str or num), it's length should be equal to table_headings length
     * @param table_styles - instance of TableStyle class
     * @param clear_div - true of false, indicates whether div container should be cleared before table creation
     * @private
     */
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

    static _createSpinner(table_styles)
    /**
     * Creates loader element which is used for the table inside container
     * @param table_styles - instance of TableStyle class
     * @returns {HTMLDivElement}
     * @private
     */
    {
        let spinnerDiv = document.createElement("div");
        spinnerDiv.setAttribute("class", String(table_styles.spinner));
        spinnerDiv.style.display = "none";
        return spinnerDiv
    }

    static _createSearchBox(table_styles)
    /**
     * Creates searchbox element which is used for the table inside container
     * @param table_styles - instance of TableStyle class
     * @returns {HTMLInputElement}
     * @private
     */
    {
        let _searchBox = document.createElement("input");
        _searchBox.setAttribute("class", String(table_styles.searchbox));
        _searchBox.style.marginBottom = "3px";
        _searchBox.setAttribute("placeholder", "Please enter part of the word, you are searching for ...");
        return _searchBox
    }

    static _createDownloadCSVBtn(table_styles)
    /**
     * creates button element to download table as a csv file
     * @param table_styles - instance of TableStyle class
     * @returns {HTMLButtonElement}
     * @private
     */
    {
        let btn = document.createElement("button");
        btn.innerText = "CSV";
        btn.style.marginBottom = "3px";
        btn.setAttribute("class", String(table_styles.csvbtn));
        return btn
    }

    static _createTable(_table_headings, _rows_data, table_styles)
    /**
     * Creates table element with thead and tbody
     * @param table_headings - array of string, should be equal to rows_data length
     * @param rows_data - array of arrays, length of array should be equal to table_headings length
     * @param table_styles - instance of TableStyle class
     * @returns {HTMLTableElement}
     * @private
     */
    {
        let TheTable = document.createElement("table");
        TheTable.setAttribute("class", String(table_styles.table));

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
        TheTable.appendChild(tableHead);

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
        TheTable.appendChild(tableBody);

        return TheTable
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
            let f = BasicTable._sortItemsFunc(index, _type, _order, pure_array);
            _order *= -1;
            return Array.from(array.sort((a, b) => f(a, b)))
        }
        return innerFunc
    }

    static _sortTable(TheTable, spinner, sortFunc)
    /**
     * sorts Table based on sortFunc which includes column number and its column data type,
     * _sortTable is attached to each table column header
     * @param TheTable - table element inside the div where table was created
     * @param spinner - spinner element inside the div where table was created
     * @param sortFunc - created a new Array which is composed of sorted Table rows
     * @private
     */
    {
        let bodyRows = TheTable.children[1].getElementsByTagName("tr");
        let tempBodyRowsArray = Array.from(bodyRows);
        spinner.style.display = "";
        TheTable.children[1].style.display = "none";

        // setTimeout is used in order to hide table body, does not work otherwise
        setTimeout(()=> {
            let data = sortFunc(tempBodyRowsArray);
            for (let i = 0; i < data.length; i++) { TheTable.children[1].appendChild(data[i]); }
            spinner.style.display = "none";
            TheTable.children[1].style.display = "";
            this.sort_order = !this.sort_order;
        }, 100);
    }

    static _exportCSV(table)
    /**
     * Makes Browser to take data from webpage table element (inside the div) and return .csv file
     * including hidden elements!
     * @param table - the table element inside the div
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
        BasicTable._triggerDownload(tableHTMLURL, "table_utf8_encoding.csv");
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

    createTheTable()
    /**
     * creates all elements of the Table and put them inside the chosen div
     */
    {
        let divContainer = document.getElementById(this.div_id);
        if (this.clear_div) {divContainer.innerText = "";};

        let tableHead = this.TheTable.children[0];
        let tableBody = this.TheTable.children[1];

        this.searchBox.addEventListener("keyup", () => {
            BasicTable._filterTableBody(tableBody, this.searchBox);
        });

        // add event handler to column headers
        for (let index=0; index<tableHead.children[0].childElementCount; index++) {
            let sortFunc = BasicTable._sortTableArray(index, this.column_types[index], false);
            tableHead.children[0].children[index].addEventListener("click", ()=>{
                BasicTable._sortTable(this.TheTable, this.loadSpinner, sortFunc);
            });
        }

        this.btnCSV.addEventListener("click", () => { BasicTable._exportCSV(this.TheTable); });

        divContainer.appendChild(this.btnCSV);
        divContainer.appendChild(this.searchBox);
        divContainer.appendChild(this.TheTable);
        divContainer.appendChild(this.loadSpinner);
    }
}

class BasicUpdTable extends BasicTable
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
        BasicUpdTable._checkConstructorInputDataFilterSortUpd(url, update_interval);
        super(div_id, table_headings, rows_data, column_types, clear_div, table_styles);
        this.url = url;
        this.update_interval = update_interval;
        this.do_updates = true ; // flag whether table should be updated, the flag is attached to button
        this.btnUpd = BasicUpdTable._createStopResUpdBtn(this.table_styles);
        // table body is recreated after each update. Searchbox is used as condition flag.
        setInterval(
            () => { BasicUpdTable._updateTableBody(this.btnUpd, this.TheTable,
                this.searchBox, this.loadSpinner, this.url) },
            this.update_interval * 1000
        );
    }

    static _createStopResUpdBtn(table_styles)
    /**
     * creates button which can switch on/off updates
     * @param table_styles - instance of TableStyle class
     * @returns {HTMLButtonElement}
     * @private
     */
    {
        let btn = document.createElement("button");
        btn.setAttribute("do_updates", "1");
        btn.innerText = "Updates Off";
        btn.style.marginBottom = "3px";
        btn.style.marginLeft = "5px";
        btn.setAttribute("class", String(table_styles.updatesbtn));
        return btn
    }

    static _stopPeriodicUpdates(e)
    /**
     * Change value of DO_UPDATES flag to the opposite, it is attached to Stop/Renew Updates Btn
     */
    {
        if (e.target.getAttribute("do_updates") === "0") {
            e.target.setAttribute("do_updates", "1");
            e.target.innerText = "Updates Off";
        } else {
            e.target.setAttribute("do_updates", "0");
            e.target.innerText = "Updates On";
        }
        e.preventDefault();
    }

    static _checkConstructorInputDataFilterSortUpd(url, update_interval)
    /**
     * Check user input variable before creating the table class instance
     * @param url - to get updates from the certain API endpoint
     * @param update_interval - number of seconds between updates - positive integer
     * @private
     */
    {
        if (typeof update_interval !== "number") {throw new Error("update_interval should be number")};
        if (update_interval <= 0) {throw new Error("update_interval should be number")};
        if (typeof url !== "string") {throw new Error("update_interval should be number")};
    }

    static _updateTableBody(updBtn, table, searchBox, spinner, url)
    /**
     * Created new table body with the data received from backend endpoint.
     * searchBox is used as condition. Spinner changes its style
     * @param updBtn - the switch on/of updates button element
     * @param table - the Table element
     * @param searchBox - the input element
     * @param spinner - the spinner element
     * @param url - url to get updates
     * @private
     */
    {
        if (searchBox.value === "" && updBtn.getAttribute("do_updates") === "1") {
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

    createTheTable()
    /**
     * Adds our table to the desired div container
     */
    {
        let divContainer = document.getElementById(this.div_id);
        if (this.clear_div) {divContainer.innerText = "";};

        let tableHead = this.TheTable.children[0];
        let tableBody = this.TheTable.children[1];

        this.searchBox.addEventListener("keyup", () => {
            BasicUpdTable._filterTableBody(tableBody, this.searchBox);
        });

        // add event handler to column headers
        for (let index=0; index<tableHead.children[0].childElementCount; index++) {
            let sortFunc = BasicTable._sortTableArray(index, this.column_types[index], false);
            tableHead.children[0].children[index].addEventListener("click", ()=>{
                BasicTable._sortTable(this.TheTable, this.loadSpinner, sortFunc);
            });
        }

        this.btnCSV.addEventListener("click", () => { BasicUpdTable._exportCSV(this.TheTable); });
        this.btnUpd.addEventListener("click", (e) => {
            BasicUpdTable._stopPeriodicUpdates(e);
        });
        divContainer.appendChild(this.btnCSV);
        divContainer.appendChild(this.btnUpd); // new element here in comparison with Basic Table
        divContainer.appendChild(this.searchBox);
        divContainer.appendChild(this.TheTable);
        divContainer.appendChild(this.loadSpinner);
    }
}

class PagedTable extends BasicTable
{
    constructor(div_id, table_headings, rows_data, column_types, table_styles = new TableStyle())
    /**
     * Table which provide paginated presentation of data. Has the same features as Basic table:
     * to get table as .csv file, to search through table, to sort table.
     * To use standard styles of the Table, you have to use Bootstrap, since styles of some elements are predefined
     * @param div_id - div container where table will be inserted
     * @param table_headings - heading of table columns - Array
     * @param rows_data - data of tables rows - Array of Arrays, where inner Array is Table Row data
     * Len of table_headings should be = Len of rows_data
     * @param column_types - could be "num" for Number or "str" for all other column data types
     * column_types is used to perform correct sort of table based on elements types
     * @param table_styles - TableStyle instance which contains table styles
     */
    {
        super(div_id, table_headings, rows_data, column_types, true, table_styles);
        this.tableRows = rows_data; // we do not display all table, but need to search through all elements
        // the block is used to define initial look (Next, Prev buttons) of paginator element
        if (this.tableRows.length > 0) {
            this.curPage = 1;
        } else {
            this.curPage = 0;
        }

        document.getElementById(this.div_id).innerText = "";
        // adds table to the div in order to let other functions to use it during initial construction
        PagedTable._createInitialTable(this.table_headings, this.div_id, this.tableRows,
            this.table_styles, this.column_types, 10);

        this.pagination = PagedTable._createPaginator(this.table_headings, this.div_id,
            this.tableRows, this.curPage, 10, this.table_styles, this.column_types);

        this.searchBox = PagedTable._createSearchBox(this.table_headings, this.div_id,
            this.tableRows, this.curPage, 10, this.table_styles, this.column_types);

        [this.itemNumberBtn, this.itemMenu] = PagedTable._createItemNumberBtn(this.table_headings,
            this.div_id, this.tableRows, this.curPage, 10, this.table_styles, this.column_types);
    }

    static _createItemNumberBtn(table_headings, div_id, rows_data, cur_page, items_page, table_styles, column_types)
    /**
     * Creates button (actually button + ulist with choices) which allows to choose number of elements per page.
     * Pay attention that several _createElementName functions in the Class have the same args list, it is done
     * because these elements recreate themselves and sometimes other elements of the table.
     * @param table_headings - array of column names
     * @param div_id - container for the table
     * @param rows_data - array of arrays, inner arrays length should be equal to table headings length
     * @param cur_page - current active page of the table number
     * @param items_page - how many rows per page to display
     * @param table_styles - instace of TableStyle
     * @param column_types - array which contains types of columns data, array length equal to table_headings length
     * @returns {(HTMLButtonElement|HTMLDivElement)[]}
     * @private
     */
    {
        let container = document.getElementById(div_id);
        let table = container.getElementsByTagName("table").item(0);
        let btn = document.createElement("button");
        btn.setAttribute("class", "dropdown-toggle" + " " + table_styles.csvbtn);
        btn.setAttribute("data-toggle", "dropdown");
        btn.setAttribute("data-items-per-page", String(items_page));
        btn.innerText = `Elements: ${items_page}`;
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

            _link.addEventListener("click", (e) => {
                let searchBox = container.getElementsByTagName("input").item(0);
                let activeTableRows = PagedTable._findActiveTableRows(rows_data, searchBox.value)
                let cur_page = 1;
                if (activeTableRows.length === 0) { cur_page = 0 }

                items_page = Number(e.target.innerText);
                btn.setAttribute("data-items-per-page", e.target.innerText)
                tableBody = PagedTable._createTableBody(activeTableRows, cur_page, items_page, table_styles);
                tableHead = PagedTable._createTableHead(table_headings, div_id, rows_data, cur_page,
                    items_page, table_styles, column_types);

                table.innerHTML = "";
                table.appendChild(tableHead);
                table.appendChild(tableBody);
                let navItem = PagedTable._createPaginator(table_headings, div_id, activeTableRows, cur_page,
                    items_page, table_styles, column_types);
                // search should be done over all elements so rows_data is used
                let newSearchBox = PagedTable._createSearchBox(
                    table_headings, div_id, rows_data, cur_page, items_page, table_styles, column_types);
                newSearchBox.value = searchBox.value;

                container.removeChild(container.lastChild);
                container.removeChild(container.lastChild);
                container.removeChild(container.lastChild);
                container.appendChild(newSearchBox);
                container.appendChild(table);
                container.appendChild(navItem);

                let chooseElementNumberBtn = container.getElementsByTagName("button").item(1);
                chooseElementNumberBtn.innerText = `Elements: ${e.target.innerText}`
            })
            dropDownMenuContainer.appendChild(_link);
        }
        return [btn, dropDownMenuContainer]
    }

    static _createSearchBox(table_headings, div_id, rows_data, cur_page, items_page, table_styles, column_types)
    /**
     * Creates searchbox (input element) which allows to filter table rows to display.
     * Pay attention that several _createElementName functions in the Class have the same args list, it is done
     * because these elements recreate themselves and sometimes other elements of the table.
     * @param table_headings - array of column names
     * @param div_id - container for the table
     * @param rows_data - array of arrays, inner arrays length should be equal to table headings length
     * @param cur_page - current active page of the table number
     * @param items_page - how many rows per page to display
     * @param table_styles - instace of TableStyle
     * @param column_types - array which contains types of columns data, array length equal to table_headings length
     * @returns {(HTMLButtonElement|HTMLDivElement)[]}
     * @private
     */
    {
        let container = document.getElementById(div_id);
        let table = container.getElementsByTagName("table").item(0);
        let _searchBox = document.createElement("input");
        _searchBox.setAttribute("class", String(table_styles.searchbox));
        _searchBox.style.marginBottom = "3px";
        _searchBox.setAttribute("placeholder", "Please enter part of the word, you are searching for ...");
        let tableBody = table.getElementsByTagName("tbody").item(0);

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
            let items_page = Number(container.getElementsByTagName("button").item(
                1).getAttribute("data-items-per-page"));
            tableBody = PagedTable._createTableBody(activeTableRows, cur_page, items_page, table_styles);
            table.removeChild(table.lastChild);
            table.appendChild(tableBody);

            let navItem = PagedTable._createPaginator(table_headings, div_id, activeTableRows,
                cur_page, items_page, table_styles, column_types);

            container.removeChild(container.lastChild);
            container.removeChild(container.lastChild);
            container.appendChild(table);
            container.appendChild(navItem);
            e.preventDefault();
        })
        return _searchBox
    }

    static _exportCSV(tableHead, tableRows)
    /**
     * Creates data to export to csv file
     * @param tableHead - thead element of the table
     * @param tableRows - tbody element of the table
     * @private
     */
    {
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
        BasicTable._triggerDownload(tableHTMLURL, "table_utf8_encoding.csv");
    }

    static _findVisiblePageNumbers(cur, page_to_show_num, total)
    /**
     * In paginator block we would like to see only a number of pages dues to limited browser webpage size.
     * The function helps to define visible page numbers.
     * @param cur - active page number
     * @param page_to_show_num - how many page numbers we would like to see
     * @param total - total number of the pages
     * @returns {[]|*[]}
     * @private
     */
    {
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
        pages_to_show_array.sort((a, b) => Number(a) - Number(b));
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

    static _createPaginator(table_headings, div_id, rows_data, cur_page, items_page, table_styles, column_types)
    /**
     * Creates paginator element (actually collection of several elements) which allows to choose page to see
     * Pay attention that several _createElementName functions in the Class have the same args list, it is done
     * because these elements recreate themselves and sometimes other elements of the table.
     * @param table_headings - array of column names
     * @param div_id - container for the table
     * @param rows_data - array of arrays, inner arrays length should be equal to table headings length
     * @param cur_page - current active page of the table number
     * @param items_page - how many rows per page to display
     * @param table_styles - instace of TableStyle
     * @param column_types - array which contains types of columns data, array length equal to table_headings length
     * @returns {(HTMLButtonElement|HTMLDivElement)[]}
     * @private
     */
    {
        let container = document.getElementById(div_id);
        let table = container.getElementsByTagName("table").item(0);
        const totalPageNumber = Math.ceil(rows_data.length/items_page);
        let tableBody = table.getElementsByTagName("tbody").item(0);

        let navItem = document.createElement("nav");
        navItem.setAttribute("aria-label", "pagination");
        let uList = document.createElement("ul");
        uList.setAttribute("class", "pagination justify-content-center");

        // crete Previous button in paginator
        let listItemPrev = document.createElement("li");
        let last_link = document.createElement("a");
        last_link.innerText = "Prev";
        last_link.setAttribute("href", "#" + div_id);
        last_link.setAttribute("class", "page-link");

        if (cur_page <= 1) {
            listItemPrev.setAttribute("class", "page-item disabled");
        } else {
            listItemPrev.setAttribute("class", "page-item");
            last_link.addEventListener("click", (e) => {
                tableBody = PagedTable._createTableBody(rows_data, cur_page - 1, items_page, table_styles);
                table.removeChild(table.lastChild);
                table.appendChild(tableBody);
                let navItem = PagedTable._createPaginator(table_headings, div_id, rows_data,
                    cur_page - 1, items_page, table_styles, column_types);

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
                tableBody = PagedTable._createTableBody(rows_data, Number(_link.innerText), items_page, table_styles);
                table.removeChild(table.lastChild);
                table.appendChild(tableBody);
                let navItem = PagedTable._createPaginator(table_headings, div_id,
                    rows_data, Number(_link.innerText), items_page, table_styles, column_types);

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
        next_link.innerText = "Next";
        next_link.setAttribute("href", "#" + div_id);
        next_link.setAttribute("class", "page-link");

        if (cur_page === totalPageNumber) {
            listItemNext.setAttribute("class", "page-item disabled");
        } else {
            listItemNext.setAttribute("class", "page-item");
            next_link.addEventListener("click", () => {
                tableBody = PagedTable._createTableBody(rows_data, cur_page + 1, items_page, table_styles);
                table.removeChild(table.lastChild);
                table.appendChild(tableBody);
                let navItem = PagedTable._createPaginator(table_headings, div_id, rows_data,
                    cur_page + 1, items_page, table_styles, column_types);

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

    static _findActiveTableRows(rows_data, searchBoxValue)
    /**
     * When elements of the page were filtered by searchBox, we provide other elements, like Paginator
     * only with the subset of initial table items. It is done to provide correct display of filtered
     * table data
     * @param rows_data - Array of arrays - table body data
     * @param searchBoxValue - current value of searchBox (Text to make filtering)
     * @returns {[]}
     * @private
     */
    {
        let activeTableRows = []
        for (let i=0; i<rows_data.length; i++) {
            let found = false;
            for (let j=0; j<rows_data[i].length; j++) {
                if (String(rows_data[i][j]).toLowerCase().includes(
                    searchBoxValue.toLowerCase())) {
                    found = true;
                    break
                }
            }
            if (found) {
                activeTableRows.push(rows_data[i])
            }
        }
        return activeTableRows
    }

    static _createTableHead(table_headings, div_id, rows_data, cur_page, items_page, table_styles, column_types)
    /**
     * Creates headings part of the table.
     * Pay attention that several _createElementName functions in the Class have the same args list, it is done
     * because these elements recreate themselves and sometimes other elements of the table.
     * @param table_headings - array of column names
     * @param div_id - container for the table
     * @param rows_data - array of arrays, inner arrays length should be equal to table headings length
     * @param cur_page - current active page of the table number
     * @param items_page - how many rows per page to display
     * @param table_styles - instace of TableStyle
     * @param column_types - array which contains types of columns data, array length equal to table_headings length
     * @returns {(HTMLButtonElement|HTMLDivElement)[]}
     * @private
     */
    {
        let container = document.getElementById(div_id);
        let tableHead = document.createElement("thead");
        tableHead.setAttribute("class", String(table_styles.thead));
        let th_row = document.createElement("tr");
        for (let i=0; i<table_headings.length; i++) {
            let sortFunc = BasicTable._sortTableArray(i, column_types[i], true);
            let element = document.createElement("th");
            element.innerHTML = table_headings[i] + " <b><span style='font-size: 22px;'>&#8593;&#8595;</span></b>";
            element.addEventListener("click", () => {
                let table = container.getElementsByTagName("table").item(0);
                table.removeChild(table.lastChild); // remove table body
                rows_data = sortFunc(rows_data);
                let searchBox = container.getElementsByTagName("input").item(0);
                let activeTableRows = PagedTable._findActiveTableRows(rows_data, searchBox.value)
                let cur_page = 1;
                if (activeTableRows.length === 0) { cur_page = 0 }
                let tableBody = PagedTable._createTableBody(activeTableRows, cur_page, items_page, table_styles);
                table.append(tableBody);
                let navItem = PagedTable._createPaginator(table_headings, div_id, activeTableRows,
                cur_page, items_page, table_styles, column_types);

                container.removeChild(container.lastChild);
                container.removeChild(container.lastChild);
                container.appendChild(table);
                container.appendChild(navItem);
            })
            th_row.appendChild(element);
        }
        tableHead.appendChild(th_row);
        return tableHead
    }

    static _createTableBody(rows_data, cur_page, items_page, table_styles)
    /**
     * Creates body part for the table
     * @param rows_data - array of arrays, inner arrays length should be equal to table headings length
     * @param cur_page - current active page of the table number
     * @param items_page - how many rows per page to display
     * @param table_styles - instace of TableStyle
     * @returns {HTMLTableSectionElement}
     * @private
     */
    {
        let tableBody = document.createElement("tbody");
        tableBody.setAttribute("class", String(table_styles.tbody));

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

    static _createInitialTable(_table_headings, div_id, _rows_data, table_styles, column_types, items_page)
    /**
     * Creates initial table state before any user actions
     * @param _table_headings - array of column names
     * @param div_id - container for the table
     * @param _rows_data - array of arrays, inner arrays length should be equal to table headings length
     * @param table_styles - instace of TableStyle
     * @param column_types - array which contains types of columns data, array length equal to table_headings length
     * @param items_page - how many rows per page to display
     * @returns {HTMLTableElement}
     * @private
     */
    {
        let TheTable = document.createElement("table");
        TheTable.setAttribute("class", String(table_styles.table));
        let cur_page = 0;
        if (_rows_data.length>0) {cur_page = 1};

        let tableHead = PagedTable._createTableHead(_table_headings, div_id, _rows_data,
            cur_page, items_page, table_styles, column_types);
        TheTable.appendChild(tableHead);

        let tableBody = PagedTable._createTableBody(_rows_data, cur_page, items_page, table_styles);
        TheTable.appendChild(tableBody);
        let container = document.getElementById(div_id);

        container.appendChild(TheTable);
        return TheTable
    }

    createTheTable()
    /**
     * Adds our table to the desired div container
     */
    {
        let divContainer = document.getElementById(this.div_id);
        let table = divContainer.getElementsByTagName("table").item(0);
        divContainer.innerText = "";
        this.btnCSV.addEventListener("click", () => {
            PagedTable._exportCSV(this.table_headings, this.tableRows);
        });
        divContainer.appendChild(this.btnCSV);
        divContainer.appendChild(this.itemNumberBtn);
        divContainer.appendChild(this.itemMenu);
        divContainer.appendChild(this.searchBox);
        divContainer.appendChild(table);
        divContainer.appendChild(this.pagination);
    }
}


class PagedUpdTable extends PagedTable
{
    constructor(div_id, table_headings, rows_data, column_types, url, update_interval=10,
                table_styles = new TableStyle())
    /**
     * The Paged Table with periodic data Updates.
     * @param div_id - div container where table will be inserted
     * @param table_headings - heading of table columns - Array
     * @param rows_data - data of tables rows - Array of Arrays, where inner Array is Table Row data
     * @param column_types - could be "num" for Number or "str" for all other column data types
     * @param url - backend endpoint, which provide scheduled updates for the table
     * @param update_interval - interval in seconds. Updates frequency.
     * @param table_styles - TableStyle instance which contains table styles
     */
    {
        super(div_id, table_headings, rows_data, column_types, table_styles);
        PagedUpdTable._checkConstructorInputDataPagedUpd(url, update_interval);
        this.url = url;
        this.update_interval = update_interval;
        this.btnUpd = PagedUpdTable._createStopUpdBtn(this.table_styles);
        // table body is recreated after each update. Searchbox is used as condition flag.
        setInterval(
            () => { PagedUpdTable._updateWholeTable(this.table_headings, this.div_id,
                this.table_styles, this.column_types, this.url)},
            this.update_interval * 1000
        );
    }

    static _updateWholeTable(table_headings, div_id, table_styles, column_types, url)
    /**
     * When new update for table data is received, we actually recreate all table elements except
     * button which can switch on/off new updates. If Searchbox is not empty, new updates are also
     * ignored.
     * @param table_headings - heading of the table are always the same
     * @param div_id - container for our table - div element with the certain id
     * @param table_styles - styles of table elements - same
     * @param column_types - data types of column elements
     * @param url - we receive update from this url endpoint
     * @private
     */
    {
        let container = document.getElementById(div_id);
        let updBtn = container.getElementsByTagName("button").item(2);
        let itemNumberBtn = container.getElementsByTagName("button").item(1);
        let searchBox = container.getElementsByTagName("input").item(0);
        if (searchBox.value === "" && updBtn.getAttribute("do_updates") === "1") {
            let items_page = itemNumberBtn.getAttribute("data-items-per-page");
            if (items_page) {
                items_page = Number(items_page);
            } else {
                items_page = 10;
            };
            fetch(url, {method: 'GET',})
                .then(response => response.json())
                .then(data => {
                    let cur_page = 1;
                    if (data.length === 0) { cur_page = 0 }
                    container.innerHTML = "";
                    let newTable = PagedUpdTable._createInitialTable(table_headings, div_id, data,
                        table_styles, column_types, items_page);
                    let newSearchBox = PagedUpdTable._createSearchBox(table_headings, div_id, data,
                        cur_page, items_page, table_styles, column_types);
                    let newPaginator = PagedUpdTable._createPaginator(table_headings, div_id, data,
                        cur_page, items_page, table_styles, column_types);
                    let [newItemNumBtn, itemMenu]  = PagedUpdTable._createItemNumberBtn(table_headings, div_id, data,
                        cur_page, items_page, table_styles, column_types);
                    let  newCSVBtn= PagedUpdTable._createDownloadCSVBtn(table_styles);
                    newCSVBtn.addEventListener("click", () => {
                        PagedTable._exportCSV(table_headings, data);
                    });
                    let contparts = [newCSVBtn, newItemNumBtn, itemMenu, updBtn, newSearchBox, newTable, newPaginator];
                    for (let i of contparts) { container.appendChild(i); }
                })
                .catch((error) => { console.log(error); })
        } else {};  // do nothing = pass
    }

    static _createStopUpdBtn(table_styles)
    /**
     * creates button which can switch on/off updates
     * @param table_styles - instance of TableStyle class
     * @returns {HTMLButtonElement}
     * @private
     */
    {
        let btn = document.createElement("button");
        btn.setAttribute("do_updates", "1");
        btn.innerText = "Updates Off";
        btn.style.marginBottom = "3px";
        btn.style.marginLeft = "5px";
        btn.style.marginRight = "5px";
        btn.setAttribute("class", String(table_styles.updatesbtn));
        return btn
    }

    static _stopPeriodicUpdates(e)
    /**
     * Change value of DO_UPDATES flag to the opposite, it is attached to Stop/Renew Updates Btn
     */
    {
        if (e.target.getAttribute("do_updates") === "0") {
            e.target.setAttribute("do_updates", "1");
            e.target.innerText = "Updates Off";
        } else {
            e.target.setAttribute("do_updates", "0");
            e.target.innerText = "Updates On";
        }
        e.preventDefault();
    }

    static _checkConstructorInputDataPagedUpd(url, update_interval)
    /**
     * Check user input variable before creating the table class instance
     * @param url - to get updates from the certain API endpoint
     * @param update_interval - number of seconds between updates - positive integer
     * @private
     */
    {
        if (typeof update_interval !== "number") {throw new Error("update_interval should be number")};
        if (update_interval <= 0) {throw new Error("update_interval should be number")};
        if (typeof url !== "string") {throw new Error("update_interval should be number")};
    }

    createTheTable()
    /**
     * Adds our table to the desired div container
     */
    {
        let divContainer = document.getElementById(this.div_id);
        let table = divContainer.getElementsByTagName("table").item(0);
        divContainer.innerText = "";
        this.btnCSV.addEventListener("click", () => {
            PagedTable._exportCSV(this.table_headings, this.tableRows);
        });
        this.btnUpd.addEventListener("click", (e) => {
            PagedUpdTable._stopPeriodicUpdates(e);
        });
        divContainer.appendChild(this.btnCSV);
        divContainer.appendChild(this.itemNumberBtn);
        divContainer.appendChild(this.itemMenu);
        divContainer.appendChild(this.btnUpd); // new element added
        divContainer.appendChild(this.searchBox);
        divContainer.appendChild(table);
        divContainer.appendChild(this.pagination);
    }
}

export { TableStyle, BasicTable, BasicUpdTable, PagedTable, PagedUpdTable }