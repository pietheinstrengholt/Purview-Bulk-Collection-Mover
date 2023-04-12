const { default:PurviewCatalog } = require("@azure-rest/purview-catalog");
const { DefaultAzureCredential } = require("@azure/identity");

const dotenv = require("dotenv");
dotenv.config();
const endpoint = process.env["ENDPOINT"];

exports.moveEntities = async (req, res) => {
  const client = PurviewCatalog(endpoint, new DefaultAzureCredential());
  const dataSources = await client.path("/collections/" + req.body.collectionName + "/entity/moveHere?api-version=2022-08-01-preview").post({body: 
      {
          "entityGuids": req.body.guidList
      }
  });
  return res.status(200).json(dataSources.body.value);
}