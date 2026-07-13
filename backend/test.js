import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dns.resolveSrv(
  "_mongodb._tcp.wick-cluster.qphqsml.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error(err);
    } else {
      console.log(addresses);
    }
  },
);
