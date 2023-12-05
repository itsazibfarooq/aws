# create s3 bucket
resource "aws_s3_bucket" "mybucket" {
  bucket = var.bucketname
}

resource "aws_s3_bucket_ownership_controls" "example" {
  bucket = aws_s3_bucket.mybucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.mybucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "example" {
  depends_on = [
    aws_s3_bucket_ownership_controls.example,
    aws_s3_bucket_public_access_block.example,
  ]
  bucket = aws_s3_bucket.mybucket.id 
  acl = "public-read"
}

#adding objects into the bucket 
resource "aws_s3_object" "index" {
  bucket = aws_s3_bucket.mybucket.id 
  key = "index.html"
  source = "../app/index.html"
  acl = "public-read"
  content_type = "text/html"
  depends_on = [ aws_s3_bucket_acl.example ]
}

resource "aws_s3_object" "indexjs" {
  bucket = aws_s3_bucket.mybucket.id 
  key = "index.js"
  source = "../app/index.js"
  acl = "public-read"
  content_type = "text/javascript"
  depends_on = [ aws_s3_bucket_acl.example ]
}

resource "aws_s3_object" "style" {
  bucket = aws_s3_bucket.mybucket.id 
  key = "style.css"
  source = "../app/style.css"
  acl = "public-read"
  content_type = "text/css"
  depends_on = [ aws_s3_bucket_acl.example ]
}

resource "aws_s3_object" "docker" {
  bucket = aws_s3_bucket.mybucket.id 
  key = "Dockerfile"
  source = "../app/Dockerfile"
  acl = "public-read"
  content_type = "text/plain"
  depends_on = [ aws_s3_bucket_acl.example ]
}

# enabling static webpage in s bucket 
resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.mybucket.id 
  index_document {
    suffix = "index.html"
  }

  depends_on = [ aws_s3_bucket_acl.example ]
}