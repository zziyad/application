DROP FUNCTION IF EXISTS
CREATE OR REPLACE FUNCTION generate_report_counts(
    target_month INTEGER,
    verification_level_filter INTEGER
)
RETURNS TABLE (
    upsellstartdate date,
    bfs_count INTEGER,
    rm_count INTEGER,
    total_bfs_count INTEGER,
    total_rm_count INTEGER
)
AS $$
BEGIN
  RETURN QUERY
    SELECT
      ur.upsellstartdate,
      COALESCE(SUM(CASE WHEN ur.type = 'BFS' AND ur.verificationlevel = verification_level_filter THEN 1 ELSE 0 END)::INTEGER, 0) AS bfs_count,
      COALESCE(SUM(CASE WHEN ur.type = 'RM' AND ur.verificationlevel = verification_level_filter THEN 1 ELSE 0 END)::INTEGER, 0) AS rm_count,
      COALESCE(SUM(CASE WHEN ur.type = 'BFS' THEN 1 ELSE 0 END)::INTEGER, 0) AS total_bfs_count,
      COALESCE(SUM(CASE WHEN ur.type = 'RM' THEN 1 ELSE 0 END)::INTEGER, 0) AS total_rm_count
    FROM
      upsellreport ur
    WHERE
      EXTRACT(MONTH FROM ur.upsellstartdate) = target_month
    GROUP BY
      ur.upsellstartdate
    ORDER BY
      ur.upsellstartdate;
END;
$$ LANGUAGE plpgsql;


DROP FUNCTION IF EXISTS
CREATE OR REPLACE FUNCTION get_total_upsell_report_count(
    verification_level_filter INTEGER,
    target_month INTEGER,
    status_filter VARCHAR(20),
    upsell_type VARCHAR(3)
)
RETURNS INTEGER
AS $$
DECLARE
  total_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO total_count
  FROM upsellreport
  WHERE verificationlevel = verification_level_filter
    AND EXTRACT(MONTH FROM upsellstartdate) = target_month
    AND status = status_filter
    AND type = upsell_type;

  RETURN total_count;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS
CREATE OR REPLACE FUNCTION get_total_pages(
    verification_level_filter INTEGER,
    target_month INTEGER,
    status_filter VARCHAR(20),
    upsell_type VARCHAR(3),
    page_size INTEGER
)
RETURNS INTEGER
AS $$
DECLARE
  total_count INTEGER;
  total_pages INTEGER;
BEGIN
  total_count := get_total_upsell_report_count(verification_level_filter, target_month, status_filter, upsell_type);
  total_pages := CEIL(total_count / page_size);
  RETURN total_pages;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS get_paginated_upsell_reports;
CREATE OR REPLACE FUNCTION get_paginated_upsell_reports(
    page_number INTEGER,
    page_size INTEGER,
    verification_level_filter INTEGER,
    upsell_type VARCHAR(3),
    target_month INTEGER,
    status_filter VARCHAR(20)
)
RETURNS TABLE (
    upsell_id INTEGER,
    report_type VARCHAR(10),
    guestname VARCHAR(255),
    guestlastname VARCHAR(255),
    upsellstartdate DATE,
    upsellenddate DATE,
    upgraded_firstname VARCHAR(255),
    upgraded_lastname VARCHAR(255),
    verification_level INTEGER,
    upsell_amount NUMERIC(10, 2),
    total_upsell_amount NUMERIC(10, 2),
    incentive_fee NUMERIC(10, 2),
    room_number INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    notes TEXT,
    room_type VARCHAR(10),
    rtc VARCHAR(10),
    adult INTEGER,
    child INTEGER
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        ur.id AS upsell_id,
        ur.type AS report_type,
        ur.guestname AS guest_name,
        ur.guestlastname AS guest_lastname,
        ur.upsellstartdate AS arrival_date,
        ur.upsellenddate AS departure_date,
        pi.firstname AS upgraded_firstname,
        pi.lastname AS upgraded_lastname,
        ur.verificationlevel,
        ur.upsellamount,
        ur.totalupsellamount AS total_upsell_amount,
        ur.incentivefee,
        ur.roomnumber AS room_number,
        ur.createdat AS created_at,
        ur.notes,
        ru.roomtype,
        ru.rtc,
        b.adult,
        b.child
    FROM
        upsellreport ur
    LEFT JOIN roomupsell ru ON ur.id = ru.upsellreportid
    LEFT JOIN breakfastupsell b ON ur.id = b.upsellreportid
    LEFT JOIN accounts a ON ur.upgradedby = a.id
    LEFT JOIN personal_info pi ON a.personal_info_id = pi.id
    WHERE
        ur.type = upsell_type AND
        ur.verificationlevel = verification_level_filter AND
        EXTRACT(MONTH FROM ur.upsellstartdate) = target_month AND
        ur.status = status_filter
    ORDER BY ur.upsellstartdate
    OFFSET (page_number - 1) * page_size
    LIMIT page_size;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS
CREATE OR REPLACE FUNCTION public.update_room_price_difference(
    from_room_type character varying,
    to_room_type character varying,
    new_price_difference integer
)
RETURNS void
AS $$
BEGIN
    UPDATE room_price_differences
    SET price_difference = new_price_difference
    WHERE room_type_from = from_room_type
    AND room_type_to = to_room_type;

    -- Check if any rows were affected by the UPDATE
    IF NOT FOUND THEN
        -- If no rows were updated, you might want to handle this case.
        -- For example, you could insert a new record or raise an exception.
        -- For simplicity, this example raises a NOTICE.
        RAISE NOTICE 'No record found for room_type_from=% and room_type_to=%', from_room_type, to_room_type;
    END IF;
END;
$$ LANGUAGE plpgsql;
