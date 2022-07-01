document.addEventListener("alpine:init", () => {
  const gun = Gun(["https://dog-just-brow.glitch.me/gun"]);
  const adminPub = "W7OFueFQ_UgeY7-yS3XYZOT9JIdZYZ1W74Qg2fVVhz4.jMaEN3YkJGGujXVQ25K9GGdKrG4n1j6pWRVvMg1wtRk";

  Alpine.data("app", () => ({
    staff: {},
    directors: {},

    init() {
      gun
        .user(adminPub)
        .get("atlas")
        .get("tables")
        .map()
        .once((table, key) => {
          if (table.name === "staff") {
            gun
              .user(adminPub)
              .get("atlas")
              .get("tables")
              .get(key)
              .get("data")
              .map()
              .on((staffData, staffKey) => {
                if (!staffData) {
                  delete this.staff[staffKey];
                  return;
                }

                this.staff[staffKey] = {
                  person: staffData.person,
                  position: staffData.position,
                };
              });
          }

          if (table.name === "directors") {
            gun
              .user(adminPub)
              .get("atlas")
              .get("tables")
              .get(key)
              .get("data")
              .map()
              .on((directorData, directorKey) => {
                if (!directorData) {
                  delete this.directors[directorKey];
                  return;
                }

                this.directors[directorKey] = {
                  person: directorData.person,
                  position: directorData.position,
                };
              });
          }
        });
    },
  }));
});
