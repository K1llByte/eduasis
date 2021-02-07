#!/bin/bash

# python bagit module required for this script
# > pip install bagit

for fullfile in resources/*; do
    filename=$(basename -- "$fullfile")
    extension="${filename##*.}"
    filename="${filename%.*}"

    # Create item bag folder
    mkdir -p "bags/$filename"

    # If its an arquive, extract it to bag f
    # older otherwise copy the file
    if [ "$extension" == 'zip' ]; then
        unzip "$fullfile" -d "bags/$filename/"
    else
        cp "$fullfile" "bags/$filename/"
    fi
    
    # Create bag structure
    bagit.py --sha256 "bags/$filename/"

    # Zip bag folder
    mkdir -p "zip_bags/"
    cd bags/
    zip -r "../zip_bags/$filename.zip" "$filename/"
    cd ..
done

rm -rf bags/