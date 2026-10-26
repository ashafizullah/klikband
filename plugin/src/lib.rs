// KlikBand for AstroBox: sends a place picked on the phone to KlikBand on the
// band over interconnect. Built for AstroBox plugin API level 3.
//
// AstroBox 2.2.0 never ran tasks handed to spawn() from a UI event, so event
// work runs to completion with block_on before the callback returns.
use astrobox_ng_wit::FutureReader;
use astrobox_ng_wit::astrobox::psys_host::{self, ui_v3::Event};
use astrobox_ng_wit::exports::astrobox::psys_plugin::{
    event_v3::{self as event, EventType},
    lifecycle,
};

mod band;
mod logger;
mod places;
mod view;

struct KlikBand;

fn reply() -> FutureReader<String> {
    let (writer, reader) = astrobox_ng_wit::wit_future::new::<String>(String::new);
    astrobox_ng_wit::spawn(async move {
        let _ = writer.write(String::new()).await;
    });
    reader
}

fn finished() -> FutureReader<()> {
    let (writer, reader) = astrobox_ng_wit::wit_future::new::<()>(|| ());
    astrobox_ng_wit::spawn(async move {
        let _ = writer.write(()).await;
    });
    reader
}

impl event::Guest for KlikBand {
    fn on_event(event_type: EventType, event_payload: String) -> FutureReader<String> {
        if let EventType::InterconnectMessage = event_type {
            view::on_band_reply(&event_payload);
        }
        reply()
    }

    fn on_ui_event_v3(event_id: String, event: Event, event_payload: String) -> FutureReader<String> {
        astrobox_ng_wit::block_on(view::on_ui_event(&event_id, event, &event_payload));
        reply()
    }

    fn on_ui_render(element_id: String) -> FutureReader<()> {
        view::render(&element_id);
        finished()
    }

    fn on_card_render(_card_id: String) -> FutureReader<()> {
        finished()
    }
}

impl lifecycle::Guest for KlikBand {
    fn on_load() {
        logger::init();
        let lang = astrobox_ng_wit::block_on(async { psys_host::os::astrobox_language().await });
        view::set_language(&lang);
        tracing::info!("loaded, language {}", lang);
    }
}

astrobox_ng_wit::export!(KlikBand);
