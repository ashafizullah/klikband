// Talking to KlikBand on the band over interconnect. Messages are JSON
// strings; see src/common/phone.js in the app for the other side.
use astrobox_ng_wit::astrobox::psys_host;
use serde_json::{Value, json};

use crate::places::Place;

pub const PACKAGE: &str = "com.ashafizullah.klikband";

// The first KlikBand that answers the plugin (1.25.0)
const MIN_VERSION_CODE: u32 = 56;
// The first that knows the JAKIM method (1.26.0); an older one would keep its
// own method
const JAKIM_VERSION_CODE: u32 = 60;

// Why nothing was sent, as a key of the page's texts
pub enum Problem {
    NoBand,
    NotInstalled,
    TooOld,
    SendFailed,
}

// Every connected band, subscribed to KlikBand's replies
async fn bands() -> Vec<String> {
    let mut addrs = Vec::new();
    for device in psys_host::device::get_connected_device_list().await {
        let _ = psys_host::register::register_interconnect_recv(&device.addr, PACKAGE).await;
        addrs.push(device.addr);
    }
    addrs
}

// KlikBand only hears the phone while it runs, so it is opened on the band
// first; opening it again when it already runs leaves it as it is
async fn open_klikband(addr: &str, min_version: u32) -> Result<(), Problem> {
    let Ok(apps) = psys_host::thirdpartyapp::get_thirdparty_app_list(addr).await else {
        // The list is not essential: try sending anyway
        return Ok(());
    };
    let Some(app) = apps.into_iter().find(|a| a.package_name == PACKAGE) else {
        return Err(Problem::NotInstalled);
    };
    if app.version_code < min_version {
        return Err(Problem::TooOld);
    }
    if psys_host::thirdpartyapp::launch_qa(addr, &app, "").await.is_ok() {
        // Time for the app to start and listen
        std::thread::sleep(std::time::Duration::from_millis(1500));
    }
    Ok(())
}

async fn send(message: Value, min_version: u32) -> Result<usize, Problem> {
    let addrs = bands().await;
    if addrs.is_empty() {
        return Err(Problem::NoBand);
    }
    let text = message.to_string();
    let mut sent = 0;
    let mut problem = Problem::SendFailed;
    for addr in &addrs {
        if let Err(p) = open_klikband(addr, min_version).await {
            problem = p;
            continue;
        }
        if psys_host::interconnect::send_qaic_message(addr, PACKAGE, &text).await.is_ok() {
            sent += 1;
        }
    }
    if sent == 0 { Err(problem) } else { Ok(sent) }
}

pub async fn ask_state() -> Result<usize, Problem> {
    send(json!({ "type": "getState" }), MIN_VERSION_CODE).await
}

pub async fn set_location(place: &Place, tz: f64, method: &str) -> Result<usize, Problem> {
    // The band accepts names up to 40 characters
    let name: String = place.name.chars().take(40).collect();
    send(json!({
        "type": "setLocation",
        "name": name,
        "lat": (place.lat * 10000.0).round() / 10000.0,
        "lng": (place.lng * 10000.0).round() / 10000.0,
        "tz": tz,
        "method": method,
    }), if method == "jakim" { JAKIM_VERSION_CODE } else { MIN_VERSION_CODE })
    .await
}

// A reply from the band, from the interconnect-message event payload
// ({ addr, payloadText, ... })
pub fn parse_reply(event_payload: &str) -> Option<Value> {
    let event: Value = serde_json::from_str(event_payload).ok()?;
    let text = event.get("payloadText")?.as_str()?;
    serde_json::from_str(text).ok()
}
