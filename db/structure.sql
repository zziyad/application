-- Table: public.roomupsell

-- DROP TABLE IF EXISTS public.roomupsell;

CREATE TABLE IF NOT EXISTS public.roomupsell
(
    id integer NOT NULL DEFAULT nextval('roomupsell_id_seq'::regclass),
    roomtype character varying(10) COLLATE pg_catalog."default" NOT NULL,
    rtc character varying(10) COLLATE pg_catalog."default" NOT NULL,
    upsellreportid integer,
    CONSTRAINT roomupsell_pkey PRIMARY KEY (id),
    CONSTRAINT roomupsell_upsellreportid_key UNIQUE (upsellreportid),
    CONSTRAINT roomupsell_upsellreportid_fkey FOREIGN KEY (upsellreportid)
        REFERENCES public.upsellreport (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.roomupsell
    OWNER to postgres;
-- Index: idx_roomupsell_roomtype

-- DROP INDEX IF EXISTS public.idx_roomupsell_roomtype;

CREATE INDEX IF NOT EXISTS idx_roomupsell_roomtype
    ON public.roomupsell USING btree
    (roomtype COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: idx_roomupsell_rtc

-- DROP INDEX IF EXISTS public.idx_roomupsell_rtc;

CREATE INDEX IF NOT EXISTS idx_roomupsell_rtc
    ON public.roomupsell USING btree
    (rtc COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Table: public.breakfastupsell

-- DROP TABLE IF EXISTS public.breakfastupsell;

CREATE TABLE IF NOT EXISTS public.breakfastupsell
(
    id integer NOT NULL DEFAULT nextval('breakfastupsell_id_seq'::regclass),
    adult integer NOT NULL,
    child integer NOT NULL,
    upsellreportid integer,
    CONSTRAINT breakfastupsell_pkey PRIMARY KEY (id),
    CONSTRAINT breakfastupsell_upsellreportid_key UNIQUE (upsellreportid),
    CONSTRAINT breakfastupsell_upsellreportid_fkey FOREIGN KEY (upsellreportid)
        REFERENCES public.upsellreport (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.breakfastupsell
    OWNER to postgres;


-- Table: public.upsellfiles

-- DROP TABLE IF EXISTS public.upsellfiles;

CREATE TABLE IF NOT EXISTS public.upsellfiles
(
    id integer NOT NULL DEFAULT nextval('upsellfiles_id_seq'::regclass),
    screenshotfile character varying(255) COLLATE pg_catalog."default",
    activitylogfile character varying(255) COLLATE pg_catalog."default",
    guestbillfile character varying(255) COLLATE pg_catalog."default",
    upsellreportid integer,
    CONSTRAINT upsellfiles_pkey PRIMARY KEY (id),
    CONSTRAINT upsellfiles_upsellreportid_fkey FOREIGN KEY (upsellreportid)
        REFERENCES public.upsellreport (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.upsellfiles
    OWNER to postgres;
-- Index: idx_upsellfiles_upsellreportid

-- DROP INDEX IF EXISTS public.idx_upsellfiles_upsellreportid;

CREATE INDEX IF NOT EXISTS idx_upsellfiles_upsellreportid
    ON public.upsellfiles USING btree
    (upsellreportid ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.upsellreport

-- DROP TABLE IF EXISTS public.upsellreport;

CREATE TABLE IF NOT EXISTS public.upsellreport
(
    id integer NOT NULL DEFAULT nextval('upsellreport_id_seq'::regclass),
    type character varying(10) COLLATE pg_catalog."default" NOT NULL,
    guestname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    guestlastname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    upsellstartdate date NOT NULL,
    upsellenddate date NOT NULL,
    status character varying(20) COLLATE pg_catalog."default" NOT NULL,
    verificationlevel integer NOT NULL,
    upsellamount numeric(10,2) NOT NULL,
    totalupsellamount numeric(10,2) NOT NULL,
    incentivefee numeric(10,2) NOT NULL,
    upgradedby numeric NOT NULL,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    roomnumber integer NOT NULL,
    notes text COLLATE pg_catalog."default",
    rejectedby character varying(15) COLLATE pg_catalog."default",
    rejectedreason text COLLATE pg_catalog."default",
    CONSTRAINT upsellreport_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.upsellreport
    OWNER to postgres;
-- Index: idx_upsellreport_createdat

-- DROP INDEX IF EXISTS public.idx_upsellreport_createdat;

CREATE INDEX IF NOT EXISTS idx_upsellreport_createdat
    ON public.upsellreport USING btree
    (createdat ASC NULLS LAST)
    TABLESPACE pg_default;j
-- Index: idx_upsellreport_upgradedby

-- DROP INDEX IF EXISTS public.idx_upsellreport_upgradedby;

CREATE INDEX IF NOT EXISTS idx_upsellreport_upgradedby
    ON public.upsellreport USING btree
    (upgradedby ASC NULLS LAST)
    TABLESPACE pg_default;
