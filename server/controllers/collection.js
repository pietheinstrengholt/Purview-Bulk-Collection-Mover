const { default:PurviewAccount } = require("@azure-rest/purview-account");
const { default:PurviewCatalog } = require("@azure-rest/purview-catalog");
const { DefaultAzureCredential } = require("@azure/identity");

const dotenv = require("dotenv");
dotenv.config();
const endpoint = process.env["ENDPOINT"];

exports.getCollections = async (req, res) => {
    const client = PurviewAccount(endpoint, new DefaultAzureCredential());
    const dataCollections = await client.path("/collections").get();

    if (dataCollections.status !== "200") {
        console.log(`GET "/collections" failed with ${dataCollections.status}`);
    }

    return res.status(200).json(dataCollections.body.value);
}

exports.discoverCollection = async (req, res) => {
    const collectionName = req.body.collectionName;
    const client = PurviewCatalog(endpoint, new DefaultAzureCredential());
    const dataSources = await client.path("/search/query?api-version=2022-08-01-preview").post({body: 
        {
            "keywords": null,
            "limit": 1000,
            "filter": {
              "collectionId": collectionName
            }
        }
    });
    return res.status(200).json(dataSources.body.value);
}