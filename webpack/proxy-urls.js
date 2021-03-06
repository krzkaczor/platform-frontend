const { mapValues } = require("lodash");

/**
 * Unified local proxy configuration. Add new urls here.
 *
 * Params:
 * backendUrl: string
 *
 * NOTE: if backendUrl === http://localhost we assume it's local setup and links are slightly different (services run on different ports)
 */
function generateProxyConfig(backendUrl, nodeUrl) {
  const base = {
    "/node": {
      targetLocal: "http://localhost:8545",
      targetRemote: nodeUrl,
      pathRewrite: { "^/node": "" },
    },
    "/api/signature": {
      targetLocal: "http://localhost:5000",
      targetRemote: backendUrl + "signature",
      pathRewrite: { "^/api/signature": "" },
    },
    "/api/wallet": {
      targetLocal: "http://localhost:5001",
      targetRemote: backendUrl + "wallet",
      pathRewrite: { "^/api/wallet": "" },
    },
    "/api/user": {
      targetLocal: "http://localhost:5002",
      targetRemote: backendUrl + "user",
      pathRewrite: { "^/api/user": "" },
    },
    "/api/kyc": {
      targetLocal: "http://localhost:5003",
      targetRemote: backendUrl + "kyc",
      pathRewrite: { "^/api/kyc": "" },
    },
    "/api/eto-listing": {
      targetLocal: "http://localhost:5009",
      targetRemote: backendUrl + "eto-listing",
      pathRewrite: { "^/api/eto-listing": "" },
    },
    "/api/document-storage": {
      targetLocal: "http://localhost:5015",
      targetRemote: backendUrl + "document-storage",
      pathRewrite: { "^/api/document-storage": "" },
    },
    "/api/newsletter": {
      targetLocal: "http://localhost:5014",
      targetRemote: backendUrl + "newsletter",
      pathRewrite: { "^/api/newsletter": "" },
    },
    "/api/external-services-mock": {
      targetLocal: "http://localhost:1337",
      targetRemote: backendUrl + "external-services-mock",
      pathRewrite: { "^/api/external-services-mock": "" },
    },
    "/api/gas": {
      targetLocal: "http://localhost:5013",
      targetRemote: backendUrl + "gas",
      pathRewrite: { "^/api/gas": "" },
    },
    "/api/immutable-storage": {
      targetLocal: "http://localhost:5012",
      targetRemote: backendUrl + "immutable-storage",
      pathRewrite: { "^/api/immutable-storage": "" },
    },
  };

  return mapValues(base, value => {
    const isRemote = backendUrl !== "http://localhost";

    const proxyConfig = {
      pathRewrite: value.pathRewrite,
      target: isRemote ? value.targetRemote : value.targetLocal,
    };

    if (isRemote) {
      proxyConfig.changeOrigin = true;
    }

    return proxyConfig;
  });
}

module.exports = generateProxyConfig;
