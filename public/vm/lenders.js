document.addEventListener("alpine:init", () => {
  const gun = Gun(["https://dog-just-brow.glitch.me/gun"]);
  const adminPub = "W7OFueFQ_UgeY7-yS3XYZOT9JIdZYZ1W74Qg2fVVhz4.jMaEN3YkJGGujXVQ25K9GGdKrG4n1j6pWRVvMg1wtRk";
  
  Alpine.data("app", () => ({
    lenders: {},

    init() {
      gun
        .user(adminPub)
        .get("atlas")
        .get("tables")
        .map()
        .once((table, key) => {
          if (table.name === "lenders") {
            gun
              .user(adminPub)
              .get("atlas")
              .get("tables")
              .get(key)
              .get("data")
              .map()
              .on((lenderData, lenderKey) => {
                if (!lenderData) {
                  delete this.lenders[lenderKey];
                  return;
                }

                this.lenders[lenderKey] = {
                  person: lenderData.person,
                  position: lenderData.position,
                  company: lenderData.company,
                  phone: lenderData.phone,
                  email: lenderData.email,
                  website: lenderData.website,
                };
              });
          }
        });
    },
  }));
});
