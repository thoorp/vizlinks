import { BudNode } from "../BudNode";
import { Base } from "./Base";
import { Cluster } from "./Cluster";
//import { LoadedData } from "../../LoadedData";

var loadedData = require("../../LoadedData");

/**
 * DOT/GraphViz VizNode
 *
 */
export class VizNode extends Base {

	public static createNode(budnode: BudNode): VizNode {
		// based on the property files
		var result: VizNode = new VizNode(budnode.getName(), budnode.getLabel());



		result.color = loadedData.configData[budnode.getType()].graphvizNodeColor;

		result.fontColor = loadedData.configData[budnode.getType()].graphvizNodeFontColor;
		result.fontName = loadedData.configData[budnode.getType()].graphvizNodeFontName;
		result.fontSize = loadedData.configData[budnode.getType()].graphvizNodeFontSize;
		result.style = loadedData.configData[budnode.getType()].graphvizNodeStyle;
		result.iconFont = loadedData.configData[budnode.getType()].graphvizNodeIconFont;
		result.shape = loadedData.configData[budnode.getType()].graphvizNodeShape;


		result.gradientAngle = loadedData.configData[budnode.getType()].graphvizNodeGradientAngle;

		VizNode.populateUrl(budnode, result);

		return result;
	}

	protected static populateUrl(budnode: BudNode, result: VizNode) {
		// TODO - TOMCAT specific fix to deal with encoded slash. 
		// more information: http://stackoverflow.com/questions/19576777/why-does-apache-tomcat-handle-encoded-slashes-2f-as-path-separators
		// there are two ways to fix it.. change tomcat server settings (which is a security concern) or handle it as a work around here.
		// let's do the later.

		//commented replaceAll as this is not relevant in Node
		var budnodeName: string = budnode.getName(); //.replaceAll("/", "%2F");
		result.url = Base.VIZDOTSAPI_ROOT_URL + encodeURIComponent(budnodeName);
	}


	private cluster: Cluster;


	public constructor(name: string, label: string) {
		super(name, label);
	}

	public clone(): VizNode {
		var result = VizNode.constructor(this.name, this.label);
		for (var attr in this) {
			if (result.hasOwnProperty(attr)) result[attr] = this[attr];
		}
		return result;
	}

	public valueOf() { //NO_UCD

		// TODO DISPLAY LOGIC: sort all types of nodes - first based on the shape and second by name (converted to lowercase). 
		// this is achieved by concatenating shape and name and use it for comparing.
		var str: string = ((this.shape == null) ? "" : this.shape.toLowerCase()) + ((name == null) ? "" : this.name.toLowerCase());
		//return str.compareTo(compareString);
		return str.valueOf();
	}

	public copyDesign(designTemplate: VizNode) {
		this.color = designTemplate.color;
		this.fontColor = designTemplate.fontColor;
		this.fontName = designTemplate.fontName;
		this.shape = designTemplate.shape;
		this.style = designTemplate.style;

	}


	public equals(node: VizNode): boolean {


		if (!(this.name == node.name))
			return false;

		return true;
	}

	public getCluster(): Cluster {
		return this.cluster;
	}


	public getLabelAndIcon(): string {
		return (this.label == null) ? name : this.label + (this.iconFont == null ? "" : " " + this.iconFont);
	}




	public setCluster(cluster: Cluster) {
		this.cluster = cluster;
	}


	public toString(): string {
		var result: string;
		this.determineFontColor();
		this.determineShape();
		var height: string = this.determineHeight();
		result = "\"" + this.name + "\" [" +
			"height=\"" + height + "\"," +
			"shape=\"" + this.shape + "\", " +
			"URL=\"" + this.determineURL() + "\"," +
			"label=\"" + this.getLabelAndIcon() + "\"," +
			"fontcolor=\"" + this.fontColor + "\"," +
			"fontname=\"" + this.fontName + "\"," +
			"fontsize=\"" + this.fontSize + "\"," +
			"color=\"" + this.color + "\"," +
			"gradientangle=\"" + this.gradientAngle + "\"," +
			"style=\"" + this.style + "\"]\n";
		return result;
	}

	protected determineURL(): string {
		return (this.url == null) ? "#" : this.url;
	}

	protected determineHeight(): string {
		return Base.STYLE_INVIS == this.style ? "0" : ".1";
	}

	protected determineShape() {
		if (Base.STYLE_INVIS == this.style) {
			this.shape = "point";
		} else if (this.shape == null) {
			this.shape = "";
		}
	}

	protected determineFontColor() {
		if (this.highlight)
			this.fontColor = Base.COLOR_HIGHLIGHT;
	}
}
