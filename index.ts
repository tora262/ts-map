const triangleCoords = [
    { lat: 25.774, lng: -80.19 },
    { lat: 18.466, lng: -66.118 },
    { lat: 32.321, lng: -64.757 },
    { lat: 25.774, lng: -80.19 },
];

let drawingPolygonDataArr = [];

let tmpPolygon = [];

let polygons = [];

let drawingPolygon = [];

let polygonDataArr = [];

let map: google.maps.Map;

let isNewMode = false;

function initMap(): void {
    const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
            zoom: 10,
            center: { lat: 42.76, lng: -91.874 },
            mapTypeId: "satellite"
        }
    );

    // Construct the polygon.
    // const bermudaTriangle = new google.maps.Polygon({
    //     paths: triangleCoords,
    //     strokeColor: "#FF0000",
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: "#FF0000",
    //     fillOpacity: 0.35,
    //     editable: true,
    //     draggable: true
    // });

    // bermudaTriangle.setMap(map);
    // bermudaTriangle.addListener("click", function(event: any) {
    //     console.log(this);

    //     const polygon = this as google.maps.Polygon;
    //     const vertices = polygon.getPath();
    //     vertices.forEach(vertice => {
    //         console.log(vertice.lat() + " " +  vertice.lng());
    //     });
    // })
    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: false,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                //google.maps.drawing.OverlayType.MARKER,
                //google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                //google.maps.drawing.OverlayType.POLYLINE,
                //google.maps.drawing.OverlayType.RECTANGLE,
            ],
        },
        // markerOptions: {
        //     icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        // },
        // circleOptions: {
        //     fillColor: "#ffff00",
        //     fillOpacity: 1,
        //     strokeWeight: 5,
        //     clickable: false,
        //     editable: true,
        //     zIndex: 1,
        // },
        polygonOptions: {
            draggable: true,
            editable: true,
            clickable: true,
            fillColor: "#FECD70",
            fillOpacity: 0.4
        }

    });

    drawingManager.setMap(null);

    document.getElementById('clickDraw').onclick = () => {
        isNewMode = false;
        polygons.forEach(polygon => polygon.setMap(null));
        polygons = [];
        console.log('polygonDataArr = ' + polygonDataArr.length);
        polygonDataArr.forEach(polygonCoors => {
            polygons.push(new google.maps.Polygon({
                paths: polygonCoors,
                strokeColor: "#5CB8E4",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FECD70",
                fillOpacity: 0.7,
                draggable: true,
                editable: true,
                map: map
            }))
        });

        console.log(polygons.length);
    }

    document.getElementById('clickNew').onclick = () => {
        isNewMode = true;
        drawingManager.setOptions({drawingControl: true});
        drawingManager.setMap(map);
    };

    document.getElementById('clickShowDraw').onclick = () => {
        drawingManager.setOptions({drawingControl: false});
        drawingManager.setMap(null);

        drawingPolygon.forEach(polygon => polygon.setMap(null));
        drawingPolygon = [];

        polygons.forEach(polygon => polygon.setMap(null));
        polygons = [];
        if (drawingPolygonDataArr.length !== 0) {
            drawingPolygonDataArr.forEach(drawingPolygonData => polygonDataArr.push(drawingPolygonData));
        }
        drawingPolygonDataArr = [];

        polygonDataArr.forEach(polygonCoors => {
            polygons.push(new google.maps.Polygon({
                paths: polygonCoors,
                strokeColor: "#5CB8E4",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#5CB8E4",
                fillOpacity: 0.7,
                draggable: false,
                editable: false,
                map: map
            }))
        });
    };

    document.getElementById('clickSave').onclick = () => {
        if (isNewMode && tmpPolygon.length !== 0) {
            console.log('Saving new drawing polygon');
            drawingPolygonDataArr.push(tmpPolygon);
            console.log(drawingPolygonDataArr);
        } else {
            console.log('Saving new editing polygons');
            console.log(polygons.length);
            polygonDataArr = [];
            polygons.forEach(polygon => {
                let vertices = [];
                polygon.getPath().getArray()
                    .forEach(item => vertices.push({
                        lat: item.lat(),
                        lng: item.lng()
                    }));
                polygonDataArr.push(vertices);
            });
        }

        tmpPolygon = [];
    };

    document.getElementById('clickHideOrShowDraw').onclick = () => {

    };

    document.getElementById('mapSatellite').onclick = () => map.setMapTypeId('satellite');

    document.getElementById('mapNormal').onclick = () => map.setMapTypeId('terrain');

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
        // console.log(polygon);
        // console.log(polygon.getPath().getArray());
        drawingPolygon.push(polygon);
        let array = polygon.getPath().getArray();
        tmpPolygon = [];
        array.forEach(item => {
            console.log(item.lat() + ', ' + item.lng());
            let coor = {lat: item.lat(), lng: item.lng()};
            tmpPolygon.push(coor);
        });
    });
}

declare global {
    interface Window {
        initMap: () => void;
    }
}
window.initMap = initMap;
export { };