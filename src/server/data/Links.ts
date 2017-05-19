
import { BudNode } from "./BudNode";
import { Link } from "./Link";
import { VizdotsConstants } from "../VizdotsConstants";


export class Links {

	//	public static final Links INSTANCE = new Links();

	private links: Array<Link> = [];

	public addLink(link: Link) {
		this.links.push(link);
	}

	public getDownstreamLateralBudNodes(src: BudNode): Array<BudNode> {
		var result: Array<BudNode> = [];
		for (var i = 0; i < this.links.length; i++) {


			if ((this.links[i].getSrcNode().equals(src)) && this.links[i].isDestLateral())
				result.push(this.links[i].getDestNode());
		}
		return result;
	}

	public getDownStreamBudNodes(src: BudNode): Array<BudNode> {
		var result: Array<BudNode> = [];
		for (var i = 0; i < this.links.length; i++) {

			// console.log("Link check src dest  passedSrc", this.links[i].getSrcNode().getName(), 
			// this.links[i].getDestNode().getName(), src.getName(), 
			// (this.links[i].getSrcNode().equals(src)) && !this.links[i].isDestLateral());
			if ((this.links[i].getSrcNode().equals(src)) && !this.links[i].isDestLateral()) {
				//console.log("Link matched src dest  passedSrc", this.links[i].getSrcNode().getName(), this.links[i].getDestNode().getName(), src.getName())
				result.push(this.links[i].getDestNode());
			}

		}
		return result;
	}

	public getUpstreamLateralBudNodes(src: BudNode): Array<BudNode> {
		var result: Array<BudNode> = [];
		for (var i = 0; i < this.links.length; i++) {


			if ((this.links[i].getDestNode().equals(src)) && this.links[i].isDestLateral())
				result.push(this.links[i].getSrcNode());
		}
		return result;
	}

	public getLinks(): Array<Link> {
		return this.links;
	}

	public getUpStreamNodes(src: BudNode): Array<BudNode> {
		var result: Array<BudNode> = [];
		for (var i = 0; i < this.links.length; i++) {


			if ((this.links[i].getDestNode().equals(src)) && !this.links[i].isDestLateral())
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
	public getUpOrDownBudNodes(reqSrcNode: BudNode, direction: number): Array<BudNode> {
		if (direction == VizdotsConstants.DIRECTION_DOWN)
			return this.getDownStreamBudNodes(reqSrcNode);
		else
			return this.getUpStreamNodes(reqSrcNode);
	}

	public getLateralNodes(isActiveNode: boolean, reqBudNodeForLaterals: BudNode, direction: number): Array<BudNode> {
		//QUESTION: what is the role of isActiveNode here?
		if (direction == VizdotsConstants.DIRECTION_UP && isActiveNode) {
			return this.getUpstreamLateralBudNodes(reqBudNodeForLaterals);
		} else {
			return this.getDownstreamLateralBudNodes(reqBudNodeForLaterals);
		}
	}
}