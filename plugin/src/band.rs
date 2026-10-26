// Talking to KlikBand on the band over interconnect. Messages are JSON
// strings; see src/common/phone.js in the app for the other side.
use astrobox_ng_wit::astrobox::psys_host;
use serde_json::{Value, json};

use crate::places::Place;

pub const PACKAGE: &str = "com.ashafizullah.klikband";

// Every connected band, subscribed to KlikBand's replies
async fn bands() -> Vec<String> {
    let mut addrs = Vec::new();
    for device in psys_host::device::get_connected_device_list().await {
        let _ = psys_host::register::register_interconnect_recv(&device.addr, PACKAGE).await;
        addrs.push(device.addr);
    }
    addrs
}

async fn send(message: Value) -> Result<usize, String> {
    let addrs = bands().await;
    if addrs.is_empty() {
        return Err("no band".into());
    }
    let text = message.to_string();
    let mut sent = 0;
    for addr in &addrs {
        if psys_host::interconnect::send_qaic_message(addr, PACKAGE, &text).await.is_ok() {
            sent += 1;
        }
    }
    if sent == 0 { Err("send failed".into()) } else { Ok(sent) }
}

pub async fn ask_state() -> Result<usize, String> {
    send(json!({ "type": "getState" })).await
}

pub async fn set_location(place: &Place, tz: f64, method: &str) -> Result<usize, String> {
    // The band accepts names up to 40 characters
    let name: String = place.name.chars().take(40).collect();
    send(json!({
        "type": "setLocation",
        "name": name,
        "lat": (place.lat * 10000.0).round() / 10000.0,
        "lng": (place.lng * 10000.0).round() / 10000.0,
        "tz": tz,
        "method": method,
    }))
    .await
}

// A reply from the band, from the interconnect-message event payload
// ({ addr, payloadText, ... })
pub fn parse_reply(event_payload: &str) -> Option<Value> {
    let event: Value = serde_json::from_str(event_payload).ok()?;
    let text = event.get("payloadText")?.as_str()?;
    serde_json::from_str(text).ok()
}
