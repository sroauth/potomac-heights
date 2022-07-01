const events = {
  house: [],
};

function dispatch(eventName, eventArgs) {
  events[eventName].forEach((callback) => {
    callback(eventArgs);
  });
}

function on(eventName, callback) {
  events[eventName].push(callback);
}

document.addEventListener("alpine:init", () => {
  const gun = Gun(["https://dog-just-brow.glitch.me/gun"]);
  const adminPub = "W7OFueFQ_UgeY7-yS3XYZOT9JIdZYZ1W74Qg2fVVhz4.jMaEN3YkJGGujXVQ25K9GGdKrG4n1j6pWRVvMg1wtRk";

  Alpine.data("app", () => ({
    houses: {},
    housesList: [],
    markers: [],
    map: null,
    popup: null,
    features: [],

    init() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiaW5rYm91cm5lIiwiYSI6ImNrN3oxZXltajAwNjIzZmxsdTZ1M3YwbzMifQ.ZvgYP_-SX8t3A1Lupeddgw";
      
      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/inkbourne/cl1z9wukm003314qvriyv96wx",
        center: [-77.137209, 38.604553],
        zoom: 15.5,
        pitch: 45,
        bearing: -17.6,
        antialias: true,
      });
      
      on("house", (house) => {
        this.features.push({
          type: "Feature",
          properties: {
            description: house.address,
          },
          geometry: {
            type: "Point",
            coordinates: house.coordinates,
          },
        });

        if (this.map.getSource("places")) {
          this.map.getSource("places").setData({
            type: "FeatureCollection",
            features: this.features,
          });
        }
      });
      
      gun
        .user(adminPub)
        .get("atlas")
        .get("tables")
        .map()
        .once((table, key) => {
          if (table.name === "houses") {
            gun
              .user(adminPub)
              .get("atlas")
              .get("tables")
              .get(key)
              .get("data")
              .map()
              .on(async (houseData, houseKey) => {
                if (!houseData) {
                  delete this.houses[houseKey];
                  return;
                }

                this.houses[houseKey] = {
                  address: houseData.address,
                  price: houseData.price,
                  description: houseData.description,
                  image: houseData.image,
                };
              
                if (!this.housesList.includes(houseKey)) {
                  this.housesList.push(houseKey);
                  
                  const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${houseData.address.replace(" ", "%20")}.json?proximity=ip&types=address&access_token=pk.eyJ1IjoiaW5rYm91cm5lIiwiYSI6ImNrN3oxZXltajAwNjIzZmxsdTZ1M3YwbzMifQ.ZvgYP_-SX8t3A1Lupeddgw`);
                  
                  const data = await response.json();
                  
                  dispatch("house", {
                    address: houseData.address,
                    coordinates: data.features[0].geometry.coordinates,
                  });
                }
              });
          }
        });

      this.map.on("load", () => {
        this.map.addSource("places", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: this.features,
          },
        });

        this.map.addLayer({
          id: "places",
          type: "circle",
          source: "places",
          paint: {
            "circle-color": "#312e81",
            "circle-radius": 6,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });

        this.popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

        this.map.on("mouseenter", "places", (e) => {
          this.map.getCanvas().style.cursor = "pointer";

          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;

          this.popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(this.map);
        });

        this.map.on("mouseleave", "places", () => {
          this.map.getCanvas().style.cursor = "";
          this.popup.remove();
        });
      });
    },
    toggleMarker(address) {
      this.features.forEach((feature) => {
        if (feature.properties.description === address) {
          const coordinates = feature.geometry.coordinates.slice();
          const description = feature.properties.description;

          this.popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(this.map);
        }
      });
    },
    removeMarker() {
      this.popup.remove();
    },
  }));
});