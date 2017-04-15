var loadedData =require( "../LoadedData");

export class BudNode {
    name: string;
    //String label;  //commented as this is now moved to properties

    type: string; // App/DBUser/DB/Domain/VIP/Function
    parent: BudNode;

    children: Array<BudNode> = [];
    level: number; // 1 for independent node and 2 for depedent node
    rank: number;
    // 1 for app; 3 for db user; 2 for others that shows precedence in case of
    // lateral connections

    // TODO - slippery slope.. once we start introducing display considerations
    // here.. we blurred the lines.. haven't we?
    displayForNonActiveNode: boolean; // used only for lateral connections if
    // this should be displayed if it is not
    // active node

    configProperties: Map<string, string> = new Map<string, string>();
    userProperties: Map<string, string> = new Map<string, string>();

    public static readonly TOP_INDEPENDENT_LEVEL = 1;

    public static readonly DEPENDENT_LEVEL = 2;

    public static readonly RANK_ONE = 1;

    public static readonly RANK_TWO = 2;

    public static readonly RANK_THREE = 3;



    constructor(vName: string, vType: string, configData:any) {
        this.name = vName;
        this.type = vType;
		//console.log(configData);
		this.level=configData[vType].level=="TOP_INDEPENDENT_LEVEL"?BudNode.TOP_INDEPENDENT_LEVEL:BudNode.DEPENDENT_LEVEL;
		this.displayForNonActiveNode=configData[vType].displayForNonActiveNode;
		this.rank=configData[vType].rank;
    }

    public setParent(parent: BudNode) {
        this.parent = parent;
    }

    public getParent(): BudNode {
        return this.parent;
    }
    public addChild(child: BudNode) {
        if (!this.containsChild(child))
            this.children.push(child);
        child.setParent(this);
    }

    public containsChild(param: BudNode): boolean {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].equals(param)) return true;
        }
        return false;
    }

    public addUserProperty( propName:string, propValue:string){
		this.userProperties.set(propName, propValue);
	}


    public getChildren(): BudNode[] {
        return this.children;
    }

    getName(): string {
        return this.name;
    }

    public equals(param: BudNode): boolean {

        if (param.name=== this.name && param.type=== this.type)
            return true;
        else
            return true;
    }

   public  getLabel():string {
		var label = this.userProperties.get("label");
		if (label !=null)
			return label;
		else
			return this.name;
	}

	public  isTopIndependentLevel():boolean{
		return this.level == BudNode.TOP_INDEPENDENT_LEVEL;
	}

	public isDependentLevel():boolean{
		return this.level !== BudNode.TOP_INDEPENDENT_LEVEL;
	}

	public  getConfigProperty(property:string):string {
		var value = this.configProperties.get(property);
		if(value==null) value ="";
		return value;
	}

	public  getRank():number {
		return this.rank;
	}

	/**
	 * @return the type
	 */
	public  getType():string {
		return this.type;
	}

	public  getUserProperties():Map<string,string> {
		return this.userProperties;
	}

	public  isDisplayForNonActiveNode():boolean {
		return this.displayForNonActiveNode;
	}

	

	public  setConfigProperties(properties:Map<string,string>) {
		this.configProperties = properties;
	}

	public  isLateral():boolean{
		if (this.isDependentLevel()){
			return this.getParent().isRankOne() ? false : true;
		}
		else {
			return this.isRankOne() ? false : true;
		}
	}
	
	public  isHighlight():boolean{
		return this.getRank() == BudNode.RANK_ONE;
	}
	
	public  isRankOne():boolean{
		return this.getRank() == BudNode.RANK_ONE;
	}

    	public  hashCode():number {
	    var prime:number = 31;
		var result = 1;
		//result = prime * result + ((name == null) ? 0 : this.name.hashCode());
		return result;
	}


    public toString():string {
        
        	return "BudNode [name=" + this.getName() + ", Type=" + this.type + ", " + ", parent=" + this.parent + ", children count="
				+ this.children.length + ", level=" + this.level + ", rank=" + this.rank + ", displayForNonActiveNode="
				+ this.displayForNonActiveNode + "]"+ this.userProperties;

    }

}


// let bnode: BudNode = new BudNode("CustomerApi", "app");
// let fnode: BudNode = new BudNode("getCustoerDetails", "function");
// let fnode2: BudNode = new BudNode("getCustoerDetails", "function");
// let fnode3: BudNode = new BudNode("getCustoerDetails", "function");
// bnode.addChild(fnode);
// bnode.addChild(fnode2);
// bnode.addChild(fnode3);

// console.log(fnode.getParent().getName());
// console.log(bnode);
