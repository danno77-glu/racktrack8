-- Function to get auditor statistics
    CREATE OR REPLACE FUNCTION get_auditor_stats()
    RETURNS TABLE (
      auditor_id UUID,
      auditor_name TEXT,
      completed_audits INTEGER,
      booked_audits INTEGER,
      outstanding_audits INTEGER
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT
        a.id AS auditor_id,
        a.name AS auditor_name,
        COALESCE(completed_counts.count, 0) AS completed_audits,
        COALESCE(booked_counts.count, 0) AS booked_audits,
        COALESCE(outstanding_counts.count, 0) AS outstanding_audits
      FROM
        auditors a
      LEFT JOIN (
        SELECT
          auditor_id,
          COUNT(*) as count
        FROM
          scheduled_audits
        WHERE
          booking_date < NOW()
        GROUP BY
          auditor_id
      ) AS completed_counts ON a.id = completed_counts.auditor_id
      LEFT JOIN (
        SELECT
          auditor_id,
          COUNT(*) as count
        FROM
          scheduled_audits
        WHERE
          booking_date >= NOW()
        GROUP BY
          auditor_id
      ) AS booked_counts ON a.id = booked_counts.auditor_id
      LEFT JOIN (
        SELECT
          c.default_auditor,
          COUNT(*) as count
        FROM
          customers c
        WHERE
          (c.next_audit_due < NOW() OR c.next_audit_due IS NULL)
          AND NOT EXISTS (
            SELECT 1
            FROM scheduled_audits sa
            WHERE sa.customer_id = c.id
          )
          OR EXISTS (
            SELECT 1
            FROM scheduled_audits sa
            WHERE sa.customer_id = c.id AND sa.booking_date < NOW()
            AND NOT EXISTS (
              SELECT 1
              FROM audits au
              WHERE au.site_name = c.name AND au.company_name = c.company AND au.audit_date::text = sa.booking_date::text
            )
          )
        GROUP BY
          c.default_auditor
      ) AS outstanding_counts ON a.name = outstanding_counts.default_auditor;
    END;
    $$ LANGUAGE plpgsql;
