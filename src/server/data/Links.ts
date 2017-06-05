
import { BudNode } from "./BudNode";
import { Link } from "./Link";
import { Tags } from "./Tags";
import { VizdotsConstants } from "../VizdotsConstants";
import * as Logger from "bunyan";


let log: Logger = Logger.createLogger({ name: 'vizLinks', level: 'info' });


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
		var result: Link = null;
		for (var i = 0; i < this.links.length; i++) {
			if ((this.links[i].getDestNode().equals(link.getDestNode())) && this.links[i].getSrcNode().equals(link.getSrcNode()))
				result = this.links[i];
		}
		if (result == null) {
			this.links.push(link);
		}
		else{
			result.getTags().addAllTags(link.getTags());
		}
		
	}

	public getDownstreamLateralBudNodes(src: BudNode, tags: Tags=new Tags()): Array<BudNode> {
		var result: Array<BudNode> = [];
		for (var i = 0; i < this.links.length; i++) {
			//If there are no tags or if passed tags match then consider that link
			if ((this.links[i].getSrcNode().equals(src)) && this.links[i].isDestLateral()
				&& (this.links[i].getTags().isAllTagsExists(tags) || !this.links[i].getTags().hasTags() )  )
				result.push(this.links[i].getDestNode());
		}
		return result;
	}

	public getDownStreamBudNodes(src: BudNode, tags:Tags=new Tags()): Array<BudNode> {
		log.debug("Method caled");
		var result: Array<BudNode> = [];
		for (var i = 0; i < this.links.length; i++) {
			log.debug("Values src itr",src.getName(),this.links[i].getSrcNode().getName(),this.links[i].getTags().isAllTagsExists(tags),this.links[i].getTags().hasTags());			
			if ((this.links[i].getSrcNode().equals(src)) && (!this.links[i].isDestLateral()) 
				&& (this.links[i].getTags().isAllTagsExists(tags) || (!this.links[i].getTags().hasTags()) ) ) {
				//console.log("Link matched src dest  passedSrc", this.links[i].getSrcNode().getName(), this.links[i].getDestNode().getName(), src.getName())
				result.push(this.links[i].getDestNode());
			}

		}
		return result;
	}

	public getUpstreamLateralBudNodes(src: BudNode, tags:Tags=new Tags()): Array<BudNode> {
		var result: Array<BudNode> = [];
		for (var i = 0; i < this.links.length; i++) {


			if ((this.links[i].getDestNode().equals(src)) && this.links[i].isDestLateral()
			&& (this.links[i].getTags().isAllTagsExists(tags) || !this.links[i].getTags().hasTags() ) )
				result.push(this.links[i].getSrcNode());
		}
		return result;
	}

	public getLinks(): Array<Link> {
		return this.links;
	}

	public getUpStreamNodes(src: BudNode, tags:Tags=new Tags()): Array<BudNode> {
		var result: Array<BudNode> = [];
		for (var i = 0; i < this.links.length; i++) {


			if ((this.links[i].getDestNode().equals(src)) && !this.links[i].isDestLateral()
				&& (this.links[i].getTags().isAllTagsExists(tags) || !this.links[i].getTags().hasTags() )	)
				result.push(this.links[i].getSrcNode());
		}
		return result;
	}


	public toString(): string {

		var result: string;
		for (var i = 0; i < this.links.length; i++) {
			result = result + this.links[i].toString();
		}
		return result;
	}

	/**
	 * Get one level of downstream or upstream nodes for reqSrcNode based on direction 
	 * @param reqSrcNode
	 * @return
	 */
	public getUpOrDownBudNodes(reqSrcNode: BudNode, direction: number, tags:Tags=new Tags()): Array<BudNode> {
		if (direction == VizdotsConstants.DIRECTION_DOWN)
			return this.getDownStreamBudNodes(reqSrcNode,tags);
		else
			return this.getUpStreamNodes(reqSrcNode,tags);
	}

	public getLateralNodes(isActiveNode: boolean, reqBudNodeForLaterals: BudNode, direction: number,tags:Tags=new Tags()	): Array<BudNode> {
		//QUESTION: what is the role of isActiveNode here?
		if (direction == VizdotsConstants.DIRECTION_UP && isActiveNode) {
			return this.getUpstreamLateralBudNodes(reqBudNodeForLaterals,tags);
		} else {
			return this.getDownstreamLateralBudNodes(reqBudNodeForLaterals,tags);
		}
	}
}