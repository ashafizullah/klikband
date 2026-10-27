// Place search with Open-Meteo (free, no key): geocoding for names and
// coordinates, and the forecast endpoint for a time zone's current UTC offset.
use serde::Deserialize;

#[derive(Clone, Debug)]
pub struct Place {
    pub name: String,
    pub region: String,
    pub country: String,
    pub country_code: String,
    pub lat: f64,
    pub lng: f64,
    pub timezone: String,
}

impl Place {
    pub fn label(&self) -> String {
        [self.name.as_str(), self.region.as_str(), self.country.as_str()]
            .iter()
            .filter(|s| !s.is_empty())
            .cloned()
            .collect::<Vec<_>>()
            .join(", ")
    }
}

// Nearer the poles some days have no sunrise or sunset; the band refuses these
pub const MAX_LATITUDE: f64 = 65.0;

#[derive(Deserialize)]
struct GeoResponse {
    #[serde(default)]
    results: Vec<GeoResult>,
}

#[derive(Deserialize)]
struct GeoResult {
    name: String,
    latitude: f64,
    longitude: f64,
    #[serde(default)]
    country: String,
    #[serde(default)]
    country_code: String,
    #[serde(default)]
    admin1: String,
    #[serde(default)]
    timezone: String,
}

#[derive(Deserialize)]
struct OffsetResponse {
    utc_offset_seconds: i64,
}

fn get(url: &str, query: &[(&str, &str)]) -> Result<Vec<u8>, String> {
    let response = waki::Client::new()
        .get(url)
        .query(query)
        .connect_timeout(std::time::Duration::from_secs(10))
        .send()
        .map_err(|e| e.to_string())?;
    if response.status_code() != 200 {
        return Err(format!("HTTP {}", response.status_code()));
    }
    response.body().map_err(|e| e.to_string())
}

pub fn search(query: &str, lang: &str) -> Result<Vec<Place>, String> {
    let body = get(
        "https://geocoding-api.open-meteo.com/v1/search",
        &[("name", query), ("count", "10"), ("language", lang), ("format", "json")],
    )?;
    let data: GeoResponse = serde_json::from_slice(&body).map_err(|e| e.to_string())?;
    Ok(data
        .results
        .into_iter()
        .filter(|r| !r.timezone.is_empty())
        .map(|r| Place {
            name: r.name,
            region: r.admin1,
            country: r.country,
            country_code: r.country_code,
            lat: r.latitude,
            lng: r.longitude,
            timezone: r.timezone,
        })
        .collect())
}

// Hours from UTC in the place's time zone today (daylight saving included)
pub fn utc_offset(place: &Place) -> Result<f64, String> {
    let lat = format!("{:.4}", place.lat);
    let lng = format!("{:.4}", place.lng);
    let body = get(
        "https://api.open-meteo.com/v1/forecast",
        &[("latitude", lat.as_str()), ("longitude", lng.as_str()), ("timezone", place.timezone.as_str()), ("forecast_days", "1")],
    )?;
    let data: OffsetResponse = serde_json::from_slice(&body).map_err(|e| e.to_string())?;
    Ok(data.utc_offset_seconds as f64 / 3600.0)
}

pub fn offset_label(tz: f64) -> String {
    let minutes = (tz.abs() * 60.0).round() as i64;
    let sign = if tz < 0.0 { "−" } else { "+" };
    if minutes % 60 == 0 {
        format!("UTC{}{}", sign, minutes / 60)
    } else {
        format!("UTC{}{}:{:02}", sign, minutes / 60, minutes % 60)
    }
}

// The calculation method usually followed in a country; the band keeps it
// until it is changed in KlikBand's settings
pub fn suggested_method(country_code: &str) -> &'static str {
    match country_code {
        "MY" => "jakim",
        "ID" | "SG" | "BN" => "kemenag",
        "SA" | "YE" => "ummalqura",
        "US" | "CA" => "isna",
        _ => "mwl",
    }
}
