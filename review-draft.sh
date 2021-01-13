#!/bin/bash
set -o errexit
set -o nounset

# This is based on a script named review.sh over at
# https://github.com/whatwg/whatwg.org/tree/main/resources.whatwg.org/build
#
# Please see https://github.com/whatwg/meta/blob/main/MAINTAINERS.md for information on creating
# and announcing Review Drafts.

header() {
  echo ""
  echo -e "\\x1b[1m$1\\x1b[0m"
  echo ""
}

header "Creating a git branch with a Review Draft:"

git checkout main
git pull
git checkout -b "review-draft-$(date +'%F')"
echo ""

INPUT="source"
YYYYMM="$(date +'%Y-%m')"

sed -E -i '' 's/<a href="\/review-drafts\/'[0-9]\+'-'[0-9]\+'\/">/<a href="\/review-drafts\/'"$YYYYMM"'\/">/' "$INPUT"
echo "Updated Living Standard to point to the new Review Draft"
header "Please verify that only one line changed:"
git diff -up
echo ""

mkdir -p "review-drafts"
REVIEW_DRAFT="review-drafts/$YYYYMM.wattsi"

# Note that %B in date is locale-specific. Let's hope for English.
sed -e 's/^  <title w-nodev>HTML Standard<\/title>$/  <title w-nodev>HTML Standard Review Draft '"$(date +'%B %Y')"'<\/title>/' \
    -e 's/^    <h2 w-nohtml w-nosnap id="living-standard" class="no-num no-toc">Review Draft &mdash; Published <span class="pubdate">\[DATE: 01 Jan 1901\]<\/span><\/h2>$/    <h2 w-nohtml w-nosnap id="living-standard" class="no-num no-toc">Review Draft \&mdash; Published '"$(date +'%d %B %Y')"'<\/h2>/' \
    < "$INPUT" > "$REVIEW_DRAFT"
echo "Created Review Draft at $REVIEW_DRAFT"
header "Please verify that only two lines changed relative to $INPUT:"
diff -up "$INPUT" "$REVIEW_DRAFT" || true
echo ""

git add "$INPUT"
git add review-drafts/*
git commit -m "Review Draft Publication: $(date +'%B %G')"
