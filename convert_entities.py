#!/usr/bin/env python3
"""
Script to convert numeric character references to Unicode characters
in HTML specification files.

This addresses GitHub issue #3683 in the WHATWG HTML repository.
"""

import re
import os
import sys
from pathlib import Path


def should_keep_encoded(code_point):
    """
    Determine if a character should remain encoded.
    Keep encoded: control characters, invisible characters, etc.
    """
    # Control characters (C0)
    if 0x00 <= code_point <= 0x1F:
        return True
    
    # DEL and C1 control characters
    if 0x7F <= code_point <= 0x9F:
        return True
    
    # Zero-width characters and other invisible formatting
    invisible_chars = {
        0x200B,  # Zero-width space
        0x200C,  # Zero-width non-joiner
        0x200D,  # Zero-width joiner
        0x200E,  # Left-to-right mark
        0x200F,  # Right-to-left mark
        0xFEFF,  # Zero-width no-break space
    }
    if code_point in invisible_chars:
        return True
    
    return False


def decode_numeric_entities(text):
    """
    Decode numeric character references (&#x...; and &#...;) to Unicode.
    Preserves control and invisible characters as entities.
    """
    changes_made = []
    
    # Decode hex entities like &#x0426;
    def replace_hex(match):
        code_point = int(match.group(1), 16)
        
        if should_keep_encoded(code_point):
            return match.group(0)  # Keep as-is
        
        char = chr(code_point)
        changes_made.append(f"{match.group(0)} → {char} (U+{code_point:04X})")
        return char
    
    # Decode decimal entities like &#1062;
    def replace_dec(match):
        code_point = int(match.group(1))
        
        if should_keep_encoded(code_point):
            return match.group(0)
        
        char = chr(code_point)
        changes_made.append(f"{match.group(0)} → {char} (U+{code_point:04X})")
        return char
    
    # Replace hex entities
    text = re.sub(r'&#x([0-9a-fA-F]+);', replace_hex, text)
    
    # Replace decimal entities
    text = re.sub(r'&#([0-9]+);', replace_dec, text)
    
    return text, changes_made


def process_file(filepath, dry_run=False):
    """
    Process a single file and convert numeric entities.
    
    Args:
        filepath: Path to the file
        dry_run: If True, only report changes without modifying files
    
    Returns:
        Number of changes made
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()
    except UnicodeDecodeError:
        print(f"⚠️  Skipping {filepath} (not UTF-8)")
        return 0
    
    new_content, changes = decode_numeric_entities(original_content)
    
    if changes:
        print(f"\n📝 {filepath}")
        print(f"   Found {len(changes)} numeric entities to convert")
        
        if dry_run:
            # Show first 5 changes as examples
            for change in changes[:5]:
                print(f"   - {change}")
            if len(changes) > 5:
                print(f"   ... and {len(changes) - 5} more")
        else:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"   ✅ Converted!")
        
        return len(changes)
    
    return 0


def find_html_files(root_dir):
    """Find all HTML and source HTML files in the repository."""
    html_files = []
    root_path = Path(root_dir)
    
    # Look for .html and .src.html files
    for pattern in ['**/*.html', '**/*.src.html']:
        html_files.extend(root_path.glob(pattern))
    
    return [str(f) for f in html_files]


def main():
    """Main function to process the repository."""
    print("🔄 HTML Entity Converter")
    print("=" * 50)
    
    # Determine if this is a dry run
    dry_run = '--dry-run' in sys.argv or '-n' in sys.argv
    
    if dry_run:
        print("🔍 DRY RUN MODE - No files will be modified")
        print("   Run without --dry-run to apply changes")
    else:
        print("⚠️  LIVE MODE - Files will be modified")
        response = input("Continue? (y/n): ")
        if response.lower() != 'y':
            print("Cancelled.")
            return
    
    print()
    
    # Find all HTML files
    current_dir = os.getcwd()
    html_files = find_html_files(current_dir)
    
    print(f"Found {len(html_files)} HTML files to process\n")
    
    # Process each file
    total_changes = 0
    files_modified = 0
    
    for filepath in html_files:
        changes = process_file(filepath, dry_run)
        if changes > 0:
            total_changes += changes
            files_modified += 1
    
    # Summary
    print("\n" + "=" * 50)
    print(f"📊 Summary:")
    print(f"   Files processed: {len(html_files)}")
    print(f"   Files with changes: {files_modified}")
    print(f"   Total entities converted: {total_changes}")
    
    if dry_run:
        print("\n💡 To apply these changes, run:")
        print("   python convert_entities.py")
    else:
        print("\n✅ All changes applied!")
        print("\n📋 Next steps:")
        print("   1. Review changes: git diff")
        print("   2. Test the build (if applicable)")
        print("   3. Commit: git add . && git commit -m 'Editorial: decode numeric entities'")
        print("   4. Push: git push origin your-branch-name")


if __name__ == "__main__":
    main()