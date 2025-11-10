#!/bin/bash

# Fix Fn function signatures across all TSL files
# Change Fn(([params]) => {}) to Fn((params) => {})

echo "Fixing Fn function signatures..."

# Find all TypeScript files in src directory
find src -name "*.ts" -type f | while read file; do
    # Use perl to fix the Fn signatures (more reliable than sed for multiline)
    # This changes Fn(([params]) to Fn((params)
    perl -i -pe 's/Fn\(\s*\(\[/Fn\(\(/g' "$file"
    
    # Also fix the closing: ]) => to ) =>
    perl -i -pe 's/\]\)\s*=>/\) =>/g' "$file"
    
    echo "Fixed: $file"
done

echo "Done! Fn signatures fixed across all files."

