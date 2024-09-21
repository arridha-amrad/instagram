SELECT
  p.*,
  u.username,
  u.id AS authorId,
  u.avatar,
  COUNT(DISTINCT (l)) AS likes,
  COUNT(DISTINCT (c.id)) + COUNT(DISTINCT (r.id)) AS COMMENTS,
  CASE
    WHEN EXISTS (
      SELECT
        *
      FROM
        likes
      WHERE
        user_id = '4f70c468-ea07-4396-a6c0-609948f48e69'
        AND post_id = p.id
    ) THEN true
    ELSE false
  END
FROM
  posts p
  INNER JOIN users u ON u.id = p.user_id
  LEFT JOIN likes l ON l.post_id = p.id
  LEFT JOIN COMMENTS c ON c.post_id = p.id
  LEFT JOIN replies r ON r.comment_id = c.id
GROUP BY
  u.id,
  u.username,
  u.avatar,
  p.id
ORDER BY
  p.created_at DESC
LIMIT
  5