#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Media.Control.h>
#include <winrt/Windows.Foundation.Collections.h>
#include <iostream>
#include <string>
#include <mutex>
#include <chrono>
#include <sstream>
#include <iomanip>
#include <atomic>

using namespace winrt;
using namespace Windows::Foundation;
using namespace Windows::Media::Control;

// Simple JSON helper to avoid heavy dependencies
std::string EscapeJson(const std::wstring& s) {
    std::ostringstream o;
    for (auto c : s) {
        if (c == L'"' || c == L'\\') {
            o << "\\" << (char)c;
        } else if (c >= 0 && c <= 31) {
            o << "\\u" << std::hex << std::setw(4) << std::setfill('0') << (int)c;
        } else {
            // Convert to UTF-8
            if (c < 0x80) o << (char)c;
            else if (c < 0x800) {
                o << (char)(0xc0 | (c >> 6));
                o << (char)(0x80 | (c & 0x3f));
            } else {
                o << (char)(0xe0 | (c >> 12));
                o << (char)(0x80 | ((c >> 6) & 0x3f));
                o << (char)(0x80 | (c & 0x3f));
            }
        }
    }
    return o.str();
}

struct MediaState {
    std::wstring title;
    std::wstring artist;
    std::wstring album;
    bool isPlaying = false;
    double lastElapsed = -1.0;
    std::chrono::steady_clock::time_point lastEmitTime = std::chrono::steady_clock::now();
};

MediaState g_state;
std::mutex g_stateMutex;
std::atomic<bool> g_isEmitting{false};
GlobalSystemMediaTransportControlsSession g_currentSession{nullptr};

void EmitMediaInfo(GlobalSystemMediaTransportControlsSession session, bool forceMetadata) {
    if (!session) return;

    // Concurrency guard
    bool expected = false;
    if (!g_isEmitting.compare_exchange_strong(expected, true)) return;

    try {
        auto playback = session.GetPlaybackInfo();
        auto timeline = session.GetTimelineProperties();
        
        if (!playback || !timeline) {
            g_isEmitting = false;
            return;
        }

        bool isPlaying = playback.PlaybackStatus() == GlobalSystemMediaTransportControlsSessionPlaybackStatus::Playing;
        double currentTime = std::chrono::duration<double>(timeline.Position()).count();
        double duration = std::chrono::duration<double>(timeline.EndTime()).count();

        std::wstring title, artist, album;
        bool metadataChanged = false;

        if (forceMetadata || g_state.title.empty()) {
            auto props = session.TryGetMediaPropertiesAsync().get();
            if (props) {
                title = props.Title().c_str();
                artist = props.Artist().c_str();
                album = props.AlbumTitle().c_str();
                metadataChanged = (title != g_state.title || artist != g_state.artist);
            }
        } else {
            title = g_state.title;
            artist = g_state.artist;
            album = g_state.album;
        }

        auto now = std::chrono::steady_clock::now();
        double timeSinceLastEmit = std::chrono::duration<double>(now - g_state.lastEmitTime).count();
        bool stateChanged = isPlaying != g_state.isPlaying;
        bool timeJumped = std::abs(currentTime - g_state.lastElapsed) > 1.0;

        bool shouldEmit = metadataChanged || stateChanged || timeJumped || (isPlaying && timeSinceLastEmit >= 1.0);

        if (shouldEmit) {
            std::lock_guard<std::mutex> lock(g_stateMutex);
            g_state.title = title;
            g_state.artist = artist;
            g_state.album = album;
            g_state.isPlaying = isPlaying;
            g_state.lastElapsed = currentTime;
            g_state.lastEmitTime = now;

            std::cout << "{\"payload\":{"
                      << "\"title\":\"" << EscapeJson(title) << "\","
                      << "\"artist\":\"" << EscapeJson(artist) << "\","
                      << "\"album\":\"" << EscapeJson(album) << "\","
                      << "\"playbackRate\":" << (isPlaying ? 1 : 0) << ","
                      << "\"playing\":" << (isPlaying ? "true" : "false") << ","
                      << "\"elapsedTime\":" << currentTime << ","
                      << "\"duration\":" << duration << ","
                      << "\"bundleIdentifier\":\"" << EscapeJson(session.SourceAppUserModelId().c_str()) << "\""
                      << "}}" << std::endl;
        }
    } catch (...) {}

    g_isEmitting = false;
}

void UpdateSession(GlobalSystemMediaTransportControlsSession const& session) {
    static event_token t1, t2, t3;

    if (g_currentSession) {
        g_currentSession.MediaPropertiesChanged(t1);
        g_currentSession.PlaybackInfoChanged(t2);
        g_currentSession.TimelinePropertiesChanged(t3);
    }

    g_currentSession = session;

    if (g_currentSession) {
        t1 = g_currentSession.MediaPropertiesChanged([](auto const& s, auto const&) { EmitMediaInfo(s, true); });
        t2 = g_currentSession.PlaybackInfoChanged([](auto const& s, auto const&) { EmitMediaInfo(s, false); });
        t3 = g_currentSession.TimelinePropertiesChanged([](auto const& s, auto const&) { EmitMediaInfo(s, false); });
        EmitMediaInfo(g_currentSession, true);
    }
}

int main() {
    init_apartment();
    
    // Set console to UTF-8
    setlocale(LC_ALL, ".UTF8");

    try {
        auto manager = GlobalSystemMediaTransportControlsSessionManager::RequestAsync().get();
        
        UpdateSession(manager.GetCurrentSession());
        
        manager.CurrentSessionChanged([](auto const& sender, auto const&) {
            UpdateSession(sender.GetCurrentSession());
        });

        // Keep alive
        std::wstring input;
        std::getline(std::wcin, input);
    } catch (hresult_error const& ex) {
        std::wcerr << L"Error: " << ex.message().c_str() << std::endl;
    }

    return 0;
}
