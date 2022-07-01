document.addEventListener("alpine:init", () => {
  const gun = Gun(["https://dog-just-brow.glitch.me/gun"]);
  const user = gun.user().recall({ sessionStorage: true });

  Alpine.data("app", () => ({
    isAuthenticated: false,
    showModal: false,
    showUpload: false,
    uploading: false,
    form: {
      username: "",
      password: "",
    },
    tableForm: {
      name: "",
      labels: [
        {
          name: "",
          type: "text",
        },
      ],
    },
    activeTable: "",
    activeRow: "",
    activeKey: "",
    row: {},
    edit: {},
    tables: new Map(),
    keys: new Map(),
    data: new Map(),

    init() {
      gun.on("auth", () => {
        console.log("Authenticated!");

        // console.log(user.is.pub);

        this.isAuthenticated = true;

        // user.get("atlas").get("tables").put(null);

        const tablesRef = collection(user, "atlas", "tables");
        tablesRef.map().on((tableData, tableKey) => {
          if (!tableData) {
            return;
          }

          // console.log(tableData);

          this.tables.set(tableKey, tableData);

          if (!this.activeTable && tableData.name === "houses") {
            const tableKeysRef = collection(tablesRef, tableKey, "keys");
            tableKeysRef.map().once((keyData, keyKey) => {
              this.keys.set(keyKey, keyData);
              this.row[keyData.name] = "";
            });

            const tableDataRef = collection(tablesRef, tableKey, "data");
            tableDataRef.map().on((itemData, itemKey) => {
              if (!itemData) {
                this.data.delete(itemKey);
                return;
              }
              
              console.log(itemData);

              this.data.set(itemKey, itemData);
            });

            this.activeTable = tableKey;
          }
        });

        this.$refs.test.addEventListener("htmx:afterSwap", (detail) => {
          setTimeout(() => {
            let table = this.activeTable;
            let row = this.activeRow;

            if (this.activeRow) {
              this.data.get(this.activeRow)[this.activeKey.name] =
                this.$refs.response.textContent;

              this.saveUpdates(table, row);
            } else {
              this.row[this.activeKey.name] = this.$refs.response.textContent;
            }

            this.$refs.response.remove();
            this.showUpload = false;
            this.uploading = false;
            this.$refs.file.value = null;
          }, 0);
        });
      });
    },
    // UI Functions
    createTable() {
      this.showModal = true;
    },
    addTableFormRow() {
      this.tableForm.labels.push({ name: "", type: "text" });
    },
    setActiveTable(tableKey) {
      const oldTableRef = collection(user, "atlas", "tables", this.activeTable);
      oldTableRef.off();

      this.activeRow = "";
      this.keys.clear();
      this.data.clear();
      this.row = {};

      const tableRef = collection(user, "atlas", "tables", tableKey);
      tableRef.once((tableData, tableKey) => {
        if (!tableData) {
          return;
        }

        const tableKeysRef = collection(tableRef, "keys");
        tableKeysRef.map().once((keyData, keyKey) => {
          this.keys.set(keyKey, keyData);
          this.row[keyData.name] = "";
        });

        const tableDataRef = collection(tableRef, "data");
        tableDataRef.map().on((itemData, itemKey) => {
          if (!itemData) {
            this.data.delete(itemKey);
            return;
          }

          this.data.set(itemKey, itemData);
        });

        this.activeTable = tableKey;
      });
    },
    startEditing(tableRow) {
      this.activeRow = tableRow;
    },
    stopEditing() {
      this.activeRow = "";
    },
    // Server Functions
    startUpload() {
      // this.$refs.file.value = null;
      this.showUpload = true;
    },
    stopUploading() {
      this.showUpload = false;
      this.$refs.file.value = null;
    },
    finishUpload() {
      // this.row.file = this.$refs.file.files[0].name;
      // this.showUpload = false;
    },
    // DB Functions
    authenticateUser() {
      user.auth(this.form.username, this.form.password);
    },
    saveTable() {
      const tableName = this.tableForm.name;
      const tableKeys = Object.assign({}, this.tableForm.labels);

      let tablesRef = collection(user, "atlas", "tables");
      tablesRef.set({
        name: tableName,
        keys: tableKeys,
      });
    },
    saveRow() {
      let item = {};

      this.keys.forEach((key) => {
        item[key.name] = this.row[key.name];
        this.row[key.name] = "";
      });

      collection(user, "atlas", "tables", this.activeTable, "data").set(item);
    },
    updateRow() {
      let edit = {};

      this.keys.forEach((key) => {
        edit[key.name] = this.data.get(this.activeRow)[key.name];
      });

      collection(
        user,
        "atlas",
        "tables",
        this.activeTable,
        "data",
        this.activeRow
      ).put(edit, () => {
        this.activeRow = "";
      });
    },
    deleteRow() {
      const tableRef = collection(user, "atlas", "tables", this.activeTable);
      const rowRef = collection(tableRef, "data", this.activeRow);
      rowRef.put(null);
      this.editing = false;
      this.activeRow = "";
    },
    saveUpdates(table, row) {
      let edit = {};

      this.keys.forEach((key) => {
        edit[key.name] = this.data.get(row)[key.name];
      });

      user.get("atlas").get("tables").get(table).get("data").get(row).put(edit);

      // collection(user, "atlas", "tables", table, "data", row).put(edit);
    },
  }));
});

function collection() {
  let ref = arguments[0];

  for (let i = 1; i < arguments.length; i++) {
    ref = ref.get(arguments[i]);
  }

  return ref;
}
