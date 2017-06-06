import { should } from 'chai';
import { expect } from 'chai';

import * as Promise from 'bluebird';
//import 'mocha';
import { BudNode } from "../BudNode";
import { Link } from "../Link";
import { BudNodes } from "../BudNodes";
import { Links } from "../Links";
import { BudNodeMatcher } from "../../BudNodeMatcher";
import { loadData } from "../../app"
import { Tags } from "../Tags";
import * as fs from 'fs';

const R = require('ramda');


var chaiAsPromised = require("chai-as-promised");
//chai.use(chaiAsPromised);

var loadedData = require("../../LoadedData");

var data = require('../dataSync');
var pf = require("../processFile");
var path = require('path');

import * as Logger from "bunyan";


let log: Logger = Logger.createLogger({ name: 'vizLinks', level: 'debug' });

var configstr = '{"app": {"level": "TOP_INDEPENDENT_LEVEL", "rank": 1}, "function": {"level": "DEPENDENT_LEVEL",    "rank": 2}'
    + ',  "api": { "level": "TOP_INDEPENDENT_LEVEL", "rank": 1}'
    + ', "domain": {"level": "TOP_INDEPENDENT_LEVEL",  "rank": 2}}';

var configData = JSON.parse(configstr);



let bnode: BudNode = new BudNode("CustomerApi", "app", configData);
let fnode: BudNode = new BudNode("getCustomerDetails1", "function", configData);
let fnode2: BudNode = new BudNode("getCustomerDetails2", "function", configData);
let fnode3: BudNode = new BudNode("getCustomerDetails3", "function", configData);
bnode.addChild(fnode);

//Define nodes with tags
let tags:Tags = new Tags();
tags.addTag("Env","Dev");
let bnodetag: BudNode = new BudNode("CustomerApi", "app", configData,tags);
let fnodetag: BudNode = new BudNode("getCustomerDetails1", "function", configData,tags);
bnodetag.addChild(fnodetag);


let domainnode: BudNode = new BudNode("Tomcat", "domain", configData);

let allnodes = new BudNodes();
allnodes.addNode("app", bnode);
allnodes.addNode("function", fnode);
allnodes.addNode("function", fnode2);
allnodes.addNode("function", fnode3);

allnodes.addNode("app", bnodetag,tags);
allnodes.addNode("function", fnodetag,tags);


let apinode: BudNode = allnodes.getOrAddNode("api", "AccountsApi", configData);


function DataReadTest(){
    data.readConfigFiles();
    
// const accapi:BudNode = loadedData.budNodesInstance.getOrAddNode("api",
//                          "accounts-api",loadedData.configData);
// const fnodeapi:BudNode = loadedData.budNodesInstance.getOrAddNode("function",
//                          "Sample",loadedData.configData);
// accapi.addChild(fnodeapi);
// const accapitagged:BudNode = loadedData.budNodesInstance.getOrAddNode("api",
//                          "accounts-api",loadedData.configData,new Tags().addTag("Env","Dev"));
// console.log("child count of node 1", accapi.getChildren().length);
// console.log("child count of node 2", loadedData.budNodesInstance.getNodeByName("accounts-api").getChildren().length);
// console.log("child count of node 3", loadedData.budNodesInstance.getNodeByName("accounts-api",
// new Tags().addTag("Env","Dev")).getChildren().length);


//        var f = path.join(__dirname, '..','..', 'datafiles','api-function2api-function-Dev.txt');
        var err;
       
            // Promise.map awaits for returned promises as well.
       
  //           pf.processFile(err,fs.readFileSync(f, 'utf8'));
       
        const accountsapinode = loadedData.budNodesInstance.getNodeByName("accounts-api",new Tags().addTag("Env","Dev"));

    it('getNodeByName test ', function () {
        expect(loadedData.configData["app"].level).equals("TOP_INDEPENDENT_LEVEL");
        expect(loadedData.budNodesInstance.getNodeByName("customers-api",new Tags())).not.null;
        expect(loadedData.budNodesInstance.getNodeByName("customers-api",new Tags().addTag("Env","Dev"))).not.null;
        expect(loadedData.budNodesInstance.getNodeByName("master-data-v2",new Tags())).not.null;
//        expect(loadedData.budNodesInstance.getNodeByName("accounts-api",new Tags())).null;
        expect(accountsapinode).not.null;
    });

    it('getLinks test',function(){
       // log.debug(loadedData.linksInstance.getLinks());
       
       const reserveid = loadedData.budNodesInstance.getNodeByName("POST /accounts/{reserve-id}",new Tags().addTag("Env","Dev"));
       expect(reserveid).not.null;
        expect(loadedData.linksInstance.getLinks().length).greaterThan(0);
        
        expect(loadedData.linksInstance.getDownStreamBudNodes(reserveid,new Tags().addTag("Env","Dev")).length).greaterThan(0);
  //      expect(loadedData.linksInstance.getDownStreamBudNodes(reserveid).length).equals(0); 

       const reserveidperosnal = loadedData.budNodesInstance.getNodeByName("POST /customers/{reserve-id}/personal",new Tags());
        expect(reserveidperosnal).not.null;

        expect(loadedData.linksInstance.getDownStreamBudNodes(reserveidperosnal,new Tags().addTag("Env","Dev")).length).greaterThan(0);
        expect(loadedData.linksInstance.getDownStreamBudNodes(reserveidperosnal).length).greaterThan(0);
    });
}



function TagsTest(){
    it("Tags Test",function(){
        expect(tags.getAllTagsForCategory("Env").length).greaterThan(0);
        expect(tags.hasTags()).equals(true);
        expect(tags.isTagExists("Env","Dev")).equals(true);
        expect(tags.isTagExists("Env","Prod")).equals(false);
        expect(tags.isTagsExists("Env",["Dev"])).equals(true);
        expect(tags.isTagsExists("Env",["Prod"])).equals(false);
        tags.addTag("Env","Staging");
        expect(tags.isAllTagsExists(new Tags().addTags("Env",["Dev","Prod"]))).equals(false);
        expect(tags.isAllTagsExists(new Tags().addTags("Env",["Dev","Staging"]))).equals(true);
        expect(tags.isTagsExists("Env",["Dev","Staging"])).equals(true);
        tags.addTag("Channel","mobile");
        expect(tags.isTagsExists("Env",["Dev","Staging"])).equals(true);

        tags.addAllTags(new Tags().addTags("Env",["E2E","SIT"]));
        expect(tags.isTagExists("Env","E2E")).equals(true);
        expect(tags.isTagsExists("Env",["E2E","SIT"])).equals(true);
    })
}

function BudNodeTest() {
    it('BudNode test ', function () {
        expect(fnode.getParent().getName()).equals('CustomerApi');
        expect(fnode.getParent().getTags().hasTags()).equals(false);
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

        expect(allnodes.getNode("app", "CustomerApi",tags).getName()).to.equal("CustomerApi");
        expect(allnodes.getNode("app", "CustomerApi",tags).getTags().hasTags()).to.equal(false);

        
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

        let l3: Link = new Link(fnode, domainnode);
        links.addLink(l3);

        expect(links.getDownstreamLateralBudNodes(fnode)[0].getName()).to.equal("Tomcat");
    });
}



// function DataTest() {

//     it('loadData test ', function () {
//         return loadData().then(() => { expect(loadedData.linksInstance.getLinks().length).to.greaterThan(0); });

//     });

// }



function BudNodeMatcherTest() {
    //Test bud Node - Mother of all tests
   data.readConfigFiles();
    data.readData();
    var matcher: BudNodeMatcher = new BudNodeMatcher();
   // matcher.

   let devtag:Tags = new Tags().addTag("Env","Dev");
   let accnode:BudNode = loadedData.budNodesInstance.getNodeByName("accounts-api",devtag);
    var result =  R.map(x=>x.getName(), accnode.getChildren());
    log.debug("test 1",result);
 accnode = loadedData.budNodesInstance.getNodeByName("accounts-api");
var result =  R.map(x=>x.getName(), accnode.getChildren());
    log.debug("test 2",result);
var newnode:BudNode = loadedData.budNodesInstance.getNodeByName("POST /accounts/{reserve-id-new}",devtag);
log.debug(newnode.getParent().getName());
log.debug("test 3", newnode.getParent().getTags(), R.map(x=>x.getName(), newnode.getParent().getChildren()));

    

    // matcher.buildGraph("POST /accounts/{reserve-id-new}", true, 100, null, false,devtag);
    // log.debug(matcher.getGraph().toString());
    
    // matcher.buildGraph("accounts-api", true, 100, null, false,devtag);
    // log.debug(matcher.getGraph().toString());

    matcher.buildGraph("accounts-api", true, 100, null, false);
    log.debug(matcher.getGraph().toString());

    it('Active bud nodes test ', function () {
        expect(matcher.activeBudNodes.length).to.equals(1);
    });
    // it('buildgraph Test', function () {
    //     expect(matcher.getGraph().getClusterSize()).to.greaterThan(0);
    // })


}

describe('Dataclasses', function () {
    describe('BudNode', BudNodeTest);
    describe('BudNodes', BudNodesTest);
    describe('Link', LinkTest);
    describe('Links', LinksTest);
    describe('Tags',TagsTest);
    describe('DataRead', DataReadTest);
    describe('BudNodeMatcher', BudNodeMatcherTest)

});
