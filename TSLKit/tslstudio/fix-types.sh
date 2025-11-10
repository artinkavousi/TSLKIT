#!/bin/bash

# Script to fix TypeScript type import errors

echo "Fixing type imports across all TSL modules..."

# Function to remove problematic imports from a file
fix_file() {
    local file="$1"
    if [ -f "$file" ]; then
        # Remove ShaderNodeObject and Node type imports
        sed -i '/type ShaderNodeObject/d' "$file"
        sed -i '/type Node/d' "$file"
        # Remove unused imports
        sed -i '/^import type.*ShaderNodeObject.*$/d' "$file"
        sed -i '/^import type.*Node.*$/d' "$file"
        echo "Fixed: $file"
    fi
}

# Fix all TSL module files
for file in $(find src/tsl -name "*.ts" -type f); do
    fix_file "$file"
done

# Fix core files
for file in $(find src/core -name "*.ts" -type f); do
    fix_file "$file"
done

echo "Done fixing type imports!"

