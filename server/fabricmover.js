const { default:PurviewAccount } = require("@azure-rest/purview-account");
const { default:PurviewCatalog } = require("@azure-rest/purview-catalog");
const { DefaultAzureCredential } = require("@azure/identity");

const logger = require('@azure/logger');
logger.setLogLevel('error');

const dotenv = require("dotenv");
dotenv.config();

const endpoint = process.env["ENDPOINT"];

//capture arguments from command line
var args = process.argv.slice(2);
workspaceName = args[0];
collectionName = args[1];

//validate arguments
if (args.length != 2) {
    console.log("Invalid number of arguments.");
    console.log("Usage: node fabricmover.js <workspaceName> <collectionName>");
    getCollections().catch(console.error);
}

//Get the workspace by name
async function getWorkspaceByName(workspaceName) {
    const client = PurviewCatalog(endpoint, new DefaultAzureCredential());
    const response = await client.path("/search/query?api-version=2022-08-01-preview").post({body: 
        {
            "keywords": workspaceName,
            "limit": 1,
            "filter": {
              "and": [
                {
                  "entityType": "fabric_workspace",
                  "includeSubTypes": true
                }
              ]
            }
        }
    });

    if (response.status !== "200") {
        console.log(`GET "/search/query?api-version=2022-08-01-preview" failed with ${response.status}`);
    } else {
        if (response.body.value.length == 0) {
            console.log("No workspace found with the name: " + workspaceName);
            process.exit();
        }
        if (response.body.value.length > 1) {
            console.log("Multiple workspaces found with the name: " + workspaceName);
            process.exit();
        }
        if (response.body.value[0].qualifiedName) {
            //return the qualifiedName of the workspace
            return response.body.value[0].qualifiedName;
        }
    }
}

//Get the items in the workspace
async function getWorkspaceItems(workspaceName) {
    const client = PurviewCatalog(endpoint, new DefaultAzureCredential());
    const response = await client.path("/search/query?api-version=2022-08-01-preview").post({body: 
        {
            "keywords": null,
            "limit": 1000,
            "filter": {
              "and": [
                {
                  "attributeName": "qualifiedName",
                  "operator": "contains",
                  "attributeValue": workspaceName
                }
              ]
            }
        }
    });

    if (response.status !== "200") {
        console.log(`GET "/search/query?api-version=2022-08-01-preview" failed with ${response.status}`);
    } else {
        if (response.body.value.length == 0) {
            console.log("No items found in the workspace: " + workspaceName);
            process.exit();
        }
        if (response.body.value.length > 0) {
            return response.body.value;
        }
    }
}

//Move the entities to the collection
async function moveEntities(collectionName, guidList) {
    const client = PurviewCatalog(endpoint, new DefaultAzureCredential());
    const response = await client.path("/collections/" + collectionName + "/entity/moveHere?api-version=2022-08-01-preview").post({body: 
        {
            "entityGuids": guidList
        }
    });

    if (response.status !== "200") {
        console.log(`GET "/search/query?api-version=2022-08-01-preview" failed with ${response.status}`);
    } else {
        return response.body.value;
    }
}

//Get the collections
async function getCollections() {
    const client = PurviewAccount(endpoint, new DefaultAzureCredential());
    const response = await client.path("/collections").get();

    if (response.status !== "200") {
        console.log(`GET "/collections" failed with ${response.status}`);
    } else {
        console.log("====================================");
        if (response.body.value) {
            response.body.value.forEach(res => {
                console.log("FriendlyName: " + res.friendlyName.padEnd(50) + "collectionName to be used: " + res.name);
            });
        }
        process.exit()
    }
}

const workspace = getWorkspaceByName(workspaceName).catch(console.error);

workspace.then(function(workspaceName) {
    const results = getWorkspaceItems(workspaceName).catch(console.error);
    results.then(function(workspaceItems) {

        const guidList = [];

        workspaceItems.forEach(res => {
            guidList.push(res.id);
        })
        moveEntities(collectionName, guidList).catch(console.error);
        console.log("Moved " + guidList.length + " entities to collection: " + collectionName);
    });
});