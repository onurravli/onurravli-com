CREATE DATABASE IF NOT EXISTS analytics;

CREATE TABLE IF NOT EXISTS analytics.page_views
(
    id           UUID    DEFAULT generateUUIDv4(),
    session_id   String,
    timestamp    DateTime DEFAULT now(),
    path         String,
    referrer     String,
    utm_source   String,
    utm_medium   String,
    utm_campaign String,
    utm_term     String,
    utm_content  String,
    country      LowCardinality(String),
    city         String,
    browser      LowCardinality(String),
    os           LowCardinality(String),
    device_type  LowCardinality(String),
    screen_width UInt16,
    screen_height UInt16
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, session_id)
TTL timestamp + INTERVAL 2 YEAR;

CREATE TABLE IF NOT EXISTS analytics.events
(
    id         UUID    DEFAULT generateUUIDv4(),
    session_id String,
    timestamp  DateTime DEFAULT now(),
    path       String,
    event_name String,
    metadata   String   -- JSON: arbitrary key/value pairs per event type
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, session_id)
TTL timestamp + INTERVAL 2 YEAR;
