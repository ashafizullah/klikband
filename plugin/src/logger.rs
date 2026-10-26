use std::io::{self, Write};

use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};

// Plugin output goes to stdout, which AstroBox copies into its own log
pub fn init() {
    let layer = fmt::layer()
        .with_target(false)
        .with_ansi(false)
        .with_writer(|| PluginWriter(io::stdout()))
        .compact();
    let _ = tracing_subscriber::registry().with(layer).try_init();
}

struct PluginWriter<W: Write>(W);

impl<W: Write> Write for PluginWriter<W> {
    fn write(&mut self, buf: &[u8]) -> io::Result<usize> {
        self.0.write_all(b"[KlikBand] ")?;
        self.0.write(buf)
    }
    fn flush(&mut self) -> io::Result<()> {
        self.0.flush()
    }
}
