import { Component, OnInit } from "@angular/core";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import View from "ol/View";
import { toStringHDMS } from "ol/coordinate";
import TileLayer from "ol/layer/Tile";
import { fromLonLat, toLonLat } from "ol/proj";
import OSM from "ol/source/OSM";

declare var $: any;

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
	layer: TileLayer<any>;
	map: Map;
	marker;
	view: View;
	vienna: Overlay;

	ngOnInit() {
		this.layer = new TileLayer({
			source: new OSM()
		});

		this.map = new Map({
			layers: [this.layer],
			target: "map",
			view: new View({
				center: [0, 0],
				zoom: 2
			})
		});

		const pos = fromLonLat([16.3725, 48.208889]);

		// Vienna marker
		this.marker = new Overlay({
			position: pos,
			positioning: "center-center",
			element: document.getElementById("marker"),
			stopEvent: false
		});
		this.map.addOverlay(this.marker);

		// Vienna label
		this.vienna = new Overlay({
			position: pos,
			element: document.getElementById("vienna")
		});
		this.map.addOverlay(this.vienna);

		// Popup showing the position the user clicked
		const popup = new Overlay({
			element: document.getElementById("popup")
		});
		this.map.addOverlay(popup);

		this.map.on("click", function (evt) {
			const element = popup.getElement();
			const coordinate = evt.coordinate;
			const hdms = toStringHDMS(toLonLat(coordinate));

			$(element).popover("dispose");
			popup.setPosition(coordinate);
			$(element).popover({
				placement: "top",
				animation: true,
				html: true,
				content:
					"<p>The location you clicked was:</p><code>" +
					hdms +
					"</code>"
			});
			$(element).popover("show");
		});
	}
}
