#!/bin/bash
set -o errexit
set -o nounset

INPUT="source"

mkdir -p "review-drafts"
REVIEW_DRAFT="review-drafts/$(date +'%Y-%m').wattsi"

# Note that %B in date is locale-specific. Let's hope for English.
sed -e 's/^  <title w-nodev>HTML Standard<\/title>$/  <title w-nodev>HTML Standard Review Draft '"$(date +'%B %Y')"'<\/title>/' \
    -e 's/^    <h2 w-nohtml w-nosnap id="living-standard" class="no-num no-toc">Review Draft &mdash; Last Updated <span class="pubdate">\[DATE: 01 Jan 1901\]<\/span><\/h2>$/    <h2 w-nohtml w-nosnap id="living-standard" class="no-num no-toc">Review Draft \&mdash; Last Updated '"$(date +'%d %B %Y')"'<\/h2>/' \
    < "$INPUT" > "$REVIEW_DRAFT"
echo "Created Review Draft at $REVIEW_DRAFT"
echo "Please verify that only two lines changed relative to $INPUT:"
diff -up "$INPUT" "$REVIEW_DRAFT"
