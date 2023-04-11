const { default:PurviewCatalog } = require("@azure-rest/purview-catalog");
const { DefaultAzureCredential } = require("@azure/identity");

const dotenv = require("dotenv");
dotenv.config();
const endpoint = process.env["ENDPOINT"];

exports.getEntities = async (req, res) => {
  console.log("== List entity typedefs sample ==");
  const client = PurviewCatalog(endpoint, new DefaultAzureCredential());

  const dataSources = await client.path("/atlas/v2/types/typedefs").get();

  if (dataSources.status !== "200") {
    console.log(`GET "/atlas/v2/types/typedefs" failed with ${dataSources.status}`);
    throw res.status(500).json(dataSources);
  }

  return res.status(200).json(dataSources.body.entityDefs?.map((ds) => ds.name).join("\n"));
}