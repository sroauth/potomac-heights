document.addEventListener("alpine:init", () => {
  const gun = Gun(["https://dog-just-brow.glitch.me/gun"]);
  const adminPub = "W7OFueFQ_UgeY7-yS3XYZOT9JIdZYZ1W74Qg2fVVhz4.jMaEN3YkJGGujXVQ25K9GGdKrG4n1j6pWRVvMg1wtRk";

  Alpine.data("app", () => ({
    documents: {},
    package: {},
    
    init() {
      gun
        .user(adminPub)
        .get("atlas")
        .get("tables")
        .map()
        .once((table, key) => {
          if (table.name === "documents") {
            gun
              .user(adminPub)
              .get("atlas")
              .get("tables")
              .get(key)
              .get("data")
              .map()
              .on((documentData, documentKey) => {
                if (!documentData) {
                  delete this.documents[documentKey];
                  return;
                }

                this.documents[documentKey] = {
                  name: documentData.name,
                  file: documentData.file,
                };
              });
          }
        
        if (table.name === "package") {
            gun
              .user(adminPub)
              .get("atlas")
              .get("tables")
              .get(key)
              .get("data")
              .map()
              .on((documentData, documentKey) => {
                if (!documentData) {
                  delete this.package[documentKey];
                  return;
                }

                this.package[documentKey] = {
                  name: documentData.name,
                  file: documentData.file,
                };
              });
          }
        });
    },
  }));
});
