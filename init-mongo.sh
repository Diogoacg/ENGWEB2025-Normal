#!/bin/bash

echo "Running post install scripts"

# Directory where JSON files are located
DATASET_DIR=/docker-entrypoint-initdb.d

# Loop through all JSON files in the dataset directory
for file in ${DATASET_DIR}/*.json; do
	# Extract filename without extension to use as collection name
	collection=$(basename "$file" .json)

	# Import JSON file into MongoDB
	mongoimport --db ${DATABASE} --collection $collection --file $file --jsonArray
done
