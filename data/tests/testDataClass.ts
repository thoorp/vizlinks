import { should } from 'chai';
import { expect } from 'chai';

//import 'mocha';
import { BudNode } from "../BudNode";
import { Link } from "../Link";
import { BudNodes } from "../BudNodes";
import { Links } from "../Links";

var configstr = '{"app": {"level": "TOP_INDEPENDENT_LEVEL", "rank": 1}, "function": {"level": "DEPENDENT_LEVEL",    "rank": 2}'
    + ',  "api": { "level": "TOP_INDEPENDENT_LEVEL", "rank": 1}'
    +', "domain": {"level": "TOP_INDEPENDENT_LEVEL",  "rank": 2}}';

var configData = JSON.parse(configstr);

let bnode: BudNode = new BudNode("CustomerApi", "app", configData);
let fnode: BudNode = new BudNode("getCustomerDetails1", "function", configData);
let fnode2: BudNode = new BudNode("getCustomerDetails2", "function", configData);
let fnode3: BudNode = new BudNode("getCustomerDetails3", "function", configData);
bnode.addChild(fnode);

  let domainnode:BudNode=new BudNode("Tomcat","domain",configData);

let allnodes = new BudNodes();
allnodes.addNode("app", bnode);
allnodes.addNode("function", fnode);
allnodes.addNode("function", fnode2);
allnodes.addNode("function", fnode3);
let apinode: BudNode = allnodes.getOrAddNode("api", "AccountsApi", configData);


function BudNodeTest() {
    it('BudNode test ', function () {
        expect(fnode.getParent().getName()).equals('CustomerApi');
        expect(domainnode.isLateral()).to.equal(true);
    });
}

function BudNodesTest() {
    it('BudNodes test ', function () {
        expect(allnodes.getNode("app", "CustomerApi").getName()).to.equal("CustomerApi");
        expect(allnodes.getNodeByName("getCustomerDetails3").getName()).to.equal("getCustomerDetails3");
        expect(allnodes.getNodeTypes().length).to.equal(3);

        let fnode4 = new BudNode("getCustomerDetails2", "function", configData);
        allnodes.getOrAddNode("function", "getCustomerDetails2", configData);

        expect(allnodes.getNodes("function").length).to.equal(3);
    });
}

let l, l2: Link;
function LinkTest() {
    l = new Link(fnode2, apinode);
    l2 = new Link(fnode, apinode);
    it('Link test ', function () {
        //console.log(l.toString());
        expect(l.getDestNode().getName()).to.equal("AccountsApi");
        expect(l.getSrcNode().getName()).to.equal("getCustomerDetails2");
        expect(l.isDestLateral()).to.equal(false);
    });
}

function LinksTest() {
    let links: Links = new Links();
    links.addLink(l);
    links.addLink(l2);

    it('Links test ', function () {
        expect(links.getUpStreamNodes(apinode).length).to.equal(2);
        expect(links.getDownStreamBudNodes(fnode2)[0].getName()).to.equal("AccountsApi");
        expect(links.getDownstreamLateralBudNodes(fnode).length).to.equal(0);

        let l3:Link = new Link(fnode, domainnode);
        links.addLink(l3);
  
        expect(links.getDownstreamLateralBudNodes(fnode)[0].getName()).to.equal("Tomcat");
    });
}


describe('Dataclasses', function () {
    describe('BudNode', BudNodeTest);
    describe('BudNodes', BudNodesTest);
    describe('Link', LinkTest);
    describe('Links', LinksTest);


});
