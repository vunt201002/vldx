#!/bin/bash
# Blog API Test Script
# Usage: bash backend/src/scripts/testBlogApi.sh
# Requires: backend running on localhost:5000, curl, jq (optional)

BASE="http://localhost:5000/api"
PASS=0
FAIL=0
TOKEN=""
POST_SLUG=""
COMMENT_ID=""

green() { echo -e "\033[32m✓ $1\033[0m"; }
red() { echo -e "\033[31m✗ $1\033[0m"; }

assert_status() {
  local label="$1" expected="$2" actual="$3" body="$4"
  if [ "$actual" = "$expected" ]; then
    green "$label (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    red "$label — expected $expected, got $actual"
    echo "  Response: $body"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "═══════════════════════════════════════════════"
echo "  Blog API Test Suite"
echo "═══════════════════════════════════════════════"
echo ""

# ─── 0. Health check ──────────────────────────────
echo "── Prerequisites ──"
RESP=$(curl -s -w "\n%{http_code}" "$BASE/health")
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Health check" "200" "$HTTP" "$BODY"

# ─── 1. Admin login ──────────────────────────────
echo ""
echo "── Admin Auth ──"
RESP=$(curl -s -w "\n%{http_code}" "$BASE/admin/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vlxd.vn","password":"admin123"}')
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Admin login" "200" "$HTTP" "$BODY"

TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  red "Could not extract admin token — cannot continue"
  echo "  Response: $BODY"
  echo ""
  echo "Results: $PASS passed, $((FAIL + 1)) failed"
  exit 1
fi
green "Got admin token: ${TOKEN:0:20}..."

# ─── 2. Create blog post (admin) ─────────────────
echo ""
echo "── Admin CRUD ──"
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog/admin" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Hướng dẫn chọn xi măng phù hợp",
    "content": "<h2>Giới thiệu</h2><p>Xi măng là vật liệu quan trọng nhất trong xây dựng.</p>",
    "excerpt": "Cách chọn xi măng phù hợp cho từng loại công trình",
    "tags": ["xi-mang", "huong-dan"],
    "isPublished": true
  }')
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Create blog post" "201" "$HTTP" "$BODY"

POST_ID=$(echo "$BODY" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
POST_SLUG=$(echo "$BODY" | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "  Post ID: $POST_ID"
echo "  Slug: $POST_SLUG"

# ─── 3. Get all posts (admin) ────────────────────
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog/admin/list" \
  -H "Authorization: Bearer $TOKEN")
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Admin list posts" "200" "$HTTP" "$BODY"

# ─── 4. Get post by ID (admin) ───────────────────
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog/admin/$POST_ID" \
  -H "Authorization: Bearer $TOKEN")
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Admin get by ID" "200" "$HTTP" "$BODY"

# ─── 5. Update post (admin) ──────────────────────
RESP=$(curl -s -w "\n%{http_code}" -X PUT "$BASE/blog/admin/$POST_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"excerpt": "Bài viết đã được cập nhật"}')
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Update blog post" "200" "$HTTP" "$BODY"

# ─── 6. Public listing ───────────────────────────
echo ""
echo "── Public Routes ──"
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog")
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Public listing" "200" "$HTTP" "$BODY"

# ─── 7. Public listing with tag filter ────────────
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog?tag=xi-mang")
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Public listing (tag filter)" "200" "$HTTP" "$BODY"

# ─── 8. Get by slug ──────────────────────────────
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog/$POST_SLUG")
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Get by slug" "200" "$HTTP" "$BODY"

# ─── 9. ETag caching — second request returns 304 ─
ETAG=$(curl -s -D - "$BASE/blog" -o /dev/null 2>/dev/null | grep -i etag | tr -d '\r' | awk '{print $2}')
if [ -n "$ETAG" ]; then
  HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/blog" \
    -H "If-None-Match: $ETAG")
  assert_status "ETag returns 304" "304" "$HTTP" ""
else
  red "ETag not found in response headers"
  FAIL=$((FAIL + 1))
fi

# ─── 10. Anonymous comment ────────────────────────
echo ""
echo "── Comments ──"
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog/$POST_SLUG/comments" \
  -H "Content-Type: application/json" \
  -d '{"content": "Bài viết rất hữu ích!"}')
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Anonymous comment (Ẩn danh)" "201" "$HTTP" "$BODY"

# Check name is "Ẩn danh"
if echo "$BODY" | grep -q "Ẩn danh"; then
  green "Comment name is 'Ẩn danh'"
  PASS=$((PASS + 1))
else
  red "Expected name 'Ẩn danh' in response"
  FAIL=$((FAIL + 1))
fi

COMMENT_ID=$(echo "$BODY" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)

# ─── 11. Named anonymous comment ─────────────────
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog/$POST_SLUG/comments" \
  -H "Content-Type: application/json" \
  -d '{"content": "Cảm ơn bạn!", "name": "Nguyễn Văn A"}')
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Named anonymous comment" "201" "$HTTP" "$BODY"

# ─── 12. Get comments ────────────────────────────
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog/$POST_SLUG/comments")
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Get comments" "200" "$HTTP" "$BODY"

# ─── 13. Anonymous like ──────────────────────────
echo ""
echo "── Likes ──"
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog/$POST_SLUG/likes" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-session-abc"}')
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Anonymous like" "200" "$HTTP" "$BODY"

if echo "$BODY" | grep -q '"liked":true'; then
  green "Like toggled ON"
  PASS=$((PASS + 1))
else
  red "Expected liked:true"
  FAIL=$((FAIL + 1))
fi

# ─── 14. Unlike (toggle off) ─────────────────────
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog/$POST_SLUG/likes" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-session-abc"}')
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Unlike (toggle off)" "200" "$HTTP" "$BODY"

if echo "$BODY" | grep -q '"liked":false'; then
  green "Like toggled OFF"
  PASS=$((PASS + 1))
else
  red "Expected liked:false"
  FAIL=$((FAIL + 1))
fi

# ─── 15. Like without sessionId fails ────────────
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog/$POST_SLUG/likes" \
  -H "Content-Type: application/json" \
  -d '{}')
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Like without sessionId → 400" "400" "$HTTP" "$BODY"

# ─── 16. Admin delete comment ────────────────────
echo ""
echo "── Admin Moderation ──"
RESP=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE/blog/$POST_SLUG/comments/$COMMENT_ID" \
  -H "Authorization: Bearer $TOKEN")
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Admin delete comment" "200" "$HTTP" "$BODY"

# ─── 17. Delete post (admin) — cleanup ───────────
echo ""
echo "── Cleanup ──"
RESP=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE/blog/admin/$POST_ID" \
  -H "Authorization: Bearer $TOKEN")
HTTP=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
assert_status "Delete blog post" "200" "$HTTP" "$BODY"

# ─── 18. Verify deleted ──────────────────────────
RESP=$(curl -s -w "\n%{http_code}" "$BASE/blog/$POST_SLUG")
HTTP=$(echo "$RESP" | tail -1)
assert_status "Deleted post returns 404" "404" "$HTTP" ""

# ─── Results ──────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════════════"
echo ""

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
