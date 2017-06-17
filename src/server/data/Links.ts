
import { BudNode } from "./BudNode";
import { Link } from "./Link";
import { Tags } from "./Tags";
import { VizdotsConstants } from "../VizdotsConstants";
import * as Logger from "bunyan";

const R = require("ramda");

let log: Logger = Logger.createLogger({ name: 'vizLinks', level: 'debug' });


export class Links {

	//	public static final Links INSTANCE = new Links();

	private links: Array<Link> = [];

	/**
	 * 	Check if a link exists with same source & destination by passing tags object
		If exists, just add the tags to the links tags
		if not, add the link object
	 * @param link 
	 */
	public addLink(link: Link) {

		var result: Link = R.find(
			curr => curr.getDestNode().equals(link.getDestNode()) && curr.getSrcNode().equals(link.getSrcNode()),
			this.links);
		result ? result.getTags().addAllTags(link.getTags())
			: this.links.push(link);

	}

	/**
	 * This method is used only internally and should not be called from outside this class
	 * @param src soruce node for obtaining downstream nodes
	 * @param lateral flag that tells whether to get laternal nodes or normal nodes
	 * @param tags optional tags to filter the links
	 */
	private getDownstreamNodes(src: BudNode, lateral: boolean, tags: Tags = new Tags()): Array<BudNode> {

		//functional to flip lateral check based on what is required/passed
		const lateralapply = boolVal => lateral ? boolVal : !boolVal;

		//condition to filter the links. source node should equal, lateral flag and tags
		//either all tags should exist or link should have no tags
		const condition = curr => {

			return ((curr.getSrcNode().equals(src)) && lateralapply(curr.isDestLateral())
				&& (curr.getTags().isAllTagsExists(tags) || !curr.getTags().hasTags()))
		};

		//create a list by applying filter
		return R.map(x => x.getDestNode(), R.filter(condition, this.links));

	}

	/**
	 * Get lateral nodes for the passed source node, optional tags to filter additionally
	 * @param src 
	 * @param tags 
	 */
	public getDownstreamLateralBudNodes(src: BudNode, tags: Tags = new Tags()): Array<BudNode> {

		return this.getDownstreamNodes(src, true, tags);


	}

	/**
	 * * Get regular (non lateral) nodes for the passed source node, optional tags to filter additionally
	 * @param src 
	 * @param tags 
	 */
	public getDownStreamBudNodes(src: BudNode, tags: Tags = new Tags()): Array<BudNode> {
		return this.getDownstreamNodes(src, false, tags);
	}

	/**
	 * Internal method for getting upstream nodes. To be used only in current class and not outside
	 * 
	 * @param src soruce node for obtaining upstream nodes
	 * @param lateral flag that tells whether to get laternal nodes or normal nodes
	 * @param tags optional tags to filter the links
	 */
	private _getUpstreamNodes(src: BudNode, lateral: boolean, tags: Tags = new Tags()): Array<BudNode> {
		const lateralapply = boolVal => lateral ? boolVal : !boolVal;
		const cond = (curr) => (curr.getDestNode().equals(src)) && lateralapply(curr.isDestLateral())
			&& (curr.getTags().isAllTagsExists(tags) || !curr.getTags().hasTags());

		return R.map(x => x.getSrcNode(),
			R.filter(cond, this.links));
	}

	/**
	 * To get upstream lateral nodes for the passed node
	 * @param src 
	 * @param tags 
	 */
	public getUpstreamLateralBudNodes(src: BudNode, tags: Tags = new Tags()): Array<BudNode> {

		return this._getUpstreamNodes(src, true, tags);
	}

	/**
	 * get all links
	 */
	public getLinks(): Array<Link> {
		return this.links;
	}

	/**
	 * Get upstream regular(non lateral) nodes for the passed src node
	 * @param src 
	 * @param tags 
	 */
	public getUpStreamNodes(src: BudNode, tags: Tags = new Tags()): Array<BudNode> {
		return this._getUpstreamNodes(src, false, tags);
	}


	/**
	 * Produce string representation of links
	 */
	public toString(): string {

		var cond = (acc, x) => acc + x;
		return R.reduce(cond, "", this.links);
	}

	/**
	 * Get one level of downstream or upstream nodes(non lateral) for reqSrcNode based on direction 
	 * @param reqSrcNode
	 * @return
	 */
	public getUpOrDownBudNodes(reqSrcNode: BudNode, direction: number, tags: Tags = new Tags()): Array<BudNode> {
		if (direction == VizdotsConstants.DIRECTION_DOWN)
			return this.getDownStreamBudNodes(reqSrcNode, tags);
		else
			return this.getUpStreamNodes(reqSrcNode, tags);
	}

	/**
	 * returns all lateral nodes. Usually lateral nodes are downstream. However if upstream is requested, 
	 * then it usually means one of the lateral node (like a domain) is the active node. So return regular nodes
	 * if this is the case.  So if this flag is false then upstream should return nothing
	 * @param isActiveNode used for upstream only 
	 * @param reqBudNodeForLaterals node for which lateral nodes is to be obtained
	 * @param direction upstream or downstream
	 * @param tags optional tags to filter links on
	 */
	public getLateralNodes(isActiveNode: boolean, reqBudNodeForLaterals: BudNode, direction: number, tags: Tags = new Tags()): Array<BudNode> {
		if (direction == VizdotsConstants.DIRECTION_UP && isActiveNode) {
			return this.getUpstreamLateralBudNodes(reqBudNodeForLaterals, tags);
		} else {
			return this.getDownstreamLateralBudNodes(reqBudNodeForLaterals, tags);
		}
	}
}