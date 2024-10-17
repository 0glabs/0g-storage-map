import * as echarts from "echarts";
import "echarts/extension/bmap/bmap";
import "./App.css";
import { useCallback, useEffect, useRef } from "react";
import { getData } from "./utilit/getData";
import { useState } from "react";

const RPCS = [
	"https://indexer-storage-testnet-standard.0g.ai",
	"https://indexer-storage-testnet-turbo.0g.ai",
];

function App() {
	const mapContainer = useRef();
	const chartsRef = useRef();
	const [current, setCurrent] = useState(RPCS[0]);

	const getSeries = useCallback((data) => {
		return {
			type: "effectScatter",
			coordinateSystem: "bmap",
			data: data,
			symbolSize: (val) => Math.max(20, val[2] / 10),
			encode: {
				value: 2,
			},
			label: {
				formatter: "{b}",
				position: "right",
				show: false,
			},
			emphasis: {
				label: {
					show: true,
				},
			},
		};
	}, []);

	useEffect(() => {
		console.log(import.meta.env);
		const charts = echarts.init(mapContainer.current);
		chartsRef.current = charts;
		charts.setOption({
			backgroundColor: "transparent",
			title: {
				text: "0g storage nodes",
				left: "center",
			},
			tooltip: {
				trigger: "item",
				formatter: (v) => {
					return `${v.data[3]} ${v.data[2]}`;
				},
			},
			bmap: {
				center: [104.114129, 37.550339],
				zoom: 5,
				roam: true,
				mapStyle: {
					styleJson: [
						{
							featureType: "water",
							elementType: "all",
							stylers: {
								color: "#d1d1d1",
							},
						},
						{
							featureType: "land",
							elementType: "all",
							stylers: {
								color: "#f3f3f3",
							},
						},
						{
							featureType: "railway",
							elementType: "all",
							stylers: {
								visibility: "off",
							},
						},
						{
							featureType: "highway",
							elementType: "all",
							stylers: {
								color: "#fdfdfd",
							},
						},
						{
							featureType: "highway",
							elementType: "labels",
							stylers: {
								visibility: "off",
							},
						},
						{
							featureType: "arterial",
							elementType: "geometry",
							stylers: {
								color: "#fefefe",
							},
						},
						{
							featureType: "arterial",
							elementType: "geometry.fill",
							stylers: {
								color: "#fefefe",
							},
						},
						{
							featureType: "poi",
							elementType: "all",
							stylers: {
								visibility: "off",
							},
						},
						{
							featureType: "green",
							elementType: "all",
							stylers: {
								visibility: "off",
							},
						},
						{
							featureType: "subway",
							elementType: "all",
							stylers: {
								visibility: "off",
							},
						},
						{
							featureType: "manmade",
							elementType: "all",
							stylers: {
								color: "#d1d1d1",
							},
						},
						{
							featureType: "local",
							elementType: "all",
							stylers: {
								color: "#d1d1d1",
							},
						},
						{
							featureType: "arterial",
							elementType: "labels",
							stylers: {
								visibility: "off",
							},
						},
						{
							featureType: "boundary",
							elementType: "all",
							stylers: {
								color: "#fefefe",
							},
						},
						{
							featureType: "building",
							elementType: "all",
							stylers: {
								color: "#d1d1d1",
							},
						},
						{
							featureType: "label",
							elementType: "labels.text.fill",
							stylers: {
								color: "#999999",
							},
						},
					],
				},
			},
			series: getSeries([]),
		});

		window.addEventListener("resize", charts.resize);
		return () => {
			window.removeEventListener("resize", charts.resize);
			chartsRef.current = null;
			charts.dispose();
		};
	}, [getSeries]);

	useEffect(() => {
		getData(current).then((res) => {
			if (chartsRef.current) {
				chartsRef.current.setOption({
					title: {
						text: `0g storage nodes ${res.reduce((p, c) => p + c[2], 0)}`,
					},
					series: getSeries(res),
				});
			}
		});
	}, [current, getSeries]);

	return (
		<div>
			<div style={{ width: "100vw", height: "100vh" }} ref={mapContainer}>
				loading
			</div>

			<select className="select" onChange={(e) => setCurrent(e.target.value)}>
				{RPCS.map((rpc) => (
					<option key={rpc} value={rpc}>
						{rpc}
					</option>
				))}
			</select>
		</div>
	);
}

export default App;
