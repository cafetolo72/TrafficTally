import * as L from "leaflet";

const mapLink = '<a href="http://www.esri.com/">Esri</a>';
const wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
export interface MapsInterface{
    name: string,
    tile : L.TileLayer,
}

export const OpenStreet : MapsInterface = {
    name: 'Open Street',
    tile: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        maxZoom: 22,
        attribution : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
}

export const CartoCdn : MapsInterface = {
    name : 'Carto CDN',
    tile: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{
    maxZoom : 22,
    attribution: '&copy; <a href="http://www.basemaps.com/light_all">Light All</a>'
    }),
}

export const OpenStreetMap: MapsInterface = {
    name: 'OpenStreetMap',
    tile :L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom : 22,
    attribution: '&copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> contributors'
    }),
};

export const googleStreets : MapsInterface = {
    name :'Google Street',
    tile : L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    subdomains:['mt0','mt1','mt2','mt3'],
    maxZoom : 21,
    }),
};

export const googleHybrid : MapsInterface = {
    name :'Google Hybrid',
    tile: L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 21,
    subdomains:['mt0','mt1','mt2','mt3']
    }),
};

export const googleSat : MapsInterface = {
    name :'Google Sattelite',
    tile: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom :21,
    subdomains:['mt0','mt1','mt2','mt3']
    }),
};

export const esri : MapsInterface = {
    name :'Esri',
    tile: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{
    attribution: '&copy; '+mapLink+', '+wholink,
    subdomains:['mt0','mt1','mt2','mt3']
    }),
};

export const Stamen: MapsInterface = {
name: 'Stamen',
tile: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/{style}/{z}/{x}/{y}.{ext}',{
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
        '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; ' +
        '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}),
};

export const ArrayMaps : Array<MapsInterface> = [CartoCdn, OpenStreet, googleStreets, googleHybrid, googleSat, esri]