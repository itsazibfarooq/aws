"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-bucket");

const exampleBucketOwnershipControls = new aws.s3.BucketOwnershipControls(
  "example",
  {
    bucket: bucket.id,
    rule: {
      objectOwnership: "BucketOwnerPreferred",
    },
  }
);
const exampleBucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock(
  "example",
  {
    bucket: bucket.id,
    blockPublicAcls: false,
    blockPublicPolicy: false,
    ignorePublicAcls: false,
    restrictPublicBuckets: false,
  }
);
const exampleBucketAclV2 = new aws.s3.BucketAclV2(
  "example",
  {
    bucket: bucket.id,
    acl: "public-read",
  },
  {
    dependsOn: [exampleBucketOwnershipControls, exampleBucketPublicAccessBlock],
  }
);

const files = [
  ["index.html", "text/html"],
  ["style.css", "text/css"],
  ["index.js", "text/javascript"],
];

files.forEach((file) => {
  const uploadFiles = new pulumi.asset.FileAsset(`../app/${file[0]}`);

  const bucketObject = new aws.s3.BucketObject(
    file[0],
    {
      bucket: bucket.id,
      key: file[0],
      source: uploadFiles,
      acl: "public-read",
      contentType: file[1],
    },
    {
      dependsOn: [exampleBucketAclV2],
    }
  );
});

const bucketWebsite = new aws.s3.BucketWebsiteConfigurationV2(
  "website",
  {
    bucket: bucket.id,
    indexDocument: {
      suffix: "index.html",
    },
  },
  {
    dependsOn: [exampleBucketAclV2],
  }
);

// Export the name of the bucket
exports[(bucket.id, bucketWebsite.websiteEndpoint)];
