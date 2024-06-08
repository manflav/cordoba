var map = L.map('map',{
    center: [37.883651, -4.775556],
    zoom: 14,
  });

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom : 18,
  attribution : '&copy; <a href="https://www.openstreetmap.org/copyright"> '
+'Colaboradores de OpenStreetMap</a>'
}).addTo(map);

var pnoa = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&", {
  layers: "OI.OrthoimageCoverage",//nombre de la capa (ver get capabilities)
  format: 'image/jpeg',
  transparent: true,
  version: '1.3.0',//wms version (ver get capabilities)
  attribution: "PNOA WMS. Cedido por © Instituto Geográfico Nacional de España"
}).addTo(map);

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(map);

var servicios = L.geoJSON(serviciosjson, {
  onEachFeature: function(feature, layer){
    layer.bindPopup("Nombre: " + feature.properties.nombre + "<br />" + "Direccion: " + feature.properties.direccion + "<br />" + "Localidad: "+ feature.properties.localidad + "<br />" + "Provincia: " + feature.properties.provincia)
  }
}).addTo(map);

var estiloCirculosRojos = {
  radius: 5,
  fillColor: "#ff5400",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

var farmacias = L.geoJSON(null, {
  onEachFeature: function(feature, layer){
    layer.bindPopup(feature.properties.nombre + "<br />" + "Direccion: " + feature.properties.direccion)
  },
  pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, estiloCirculosRojos);
  },
})

var osm2 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 0, maxZoom : 18, 
  attribution : '&copy; <a href="https://www.openstreetmap.org/copyright"> '
+'Colaboradores de OpenStreetMap</a>'
});

var miniMap = new L.Control.MiniMap(osm2).addTo(map);

omnivore.kml('datos/farmacias.kml',null, farmacias).addTo(map);

var capaEdicion = new L.FeatureGroup().addTo(map);

map.on('draw:created', function (evento) {
  var layer = evento.layer;
  capaEdicion.addLayer(layer);
});

L.control.scale({
  position: 'bottomright',
  metric : true
}).addTo(map);

var baseMaps = {
  "Topografia" : OpenTopoMap,
  "Ortofoto PNOA": pnoa,
  "Base de OpenStreetMap": osm
};

var overlays = {
  "Servicios": servicios,
  "Farmacias" : farmacias,
  "Dibujo": capaEdicion
};

L.control.layers(baseMaps,overlays).addTo(map);

L.control.bigImage({
  position: "topleft"
}).addTo(map);

L.control.locate().addTo(map);

var drawControl = new L.Control.Draw({
  draw: {
      circle: false,
      rectangle: false,
      polygon:{
        shapeOptions:{
          color:"#ff0000"
        }
      }
}}).addTo(map);

var minimap = L.Control.minimap(map, 
  {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
  }).addTo(map);

