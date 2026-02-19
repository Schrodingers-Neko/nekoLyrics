using System;
using System.Threading.Tasks;
using Windows.Media.Control;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Encodings.Web;

namespace MediaBridge
{
    public class MediaPayload
    {
        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [JsonPropertyName("artist")]
        public string? Artist { get; set; }

        [JsonPropertyName("album")]
        public string? Album { get; set; }

        [JsonPropertyName("playbackRate")]
        public int PlaybackRate { get; set; }

        [JsonPropertyName("playing")]
        public bool Playing { get; set; }

        [JsonPropertyName("elapsedTime")]
        public double ElapsedTime { get; set; }

        [JsonPropertyName("duration")]
        public double Duration { get; set; }

        [JsonPropertyName("bundleIdentifier")]
        public string? BundleIdentifier { get; set; }
    }

    public class MediaInfo
    {
        [JsonPropertyName("payload")]
        public MediaPayload? Payload { get; set; }
    }

    [JsonSerializable(typeof(MediaInfo))]
    internal partial class SourceGenerationContext : JsonSerializerContext
    {
    }

    class Program
    {
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            TypeInfoResolver = SourceGenerationContext.Default,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        static async Task Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            try
            {
                var manager = await GlobalSystemMediaTransportControlsSessionManager.RequestAsync();
                UpdateSession(manager.GetCurrentSession());
                manager.CurrentSessionChanged += (s, e) => UpdateSession(s.GetCurrentSession());
                await Task.Delay(-1);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error: {ex.Message}");
            }
        }

        static GlobalSystemMediaTransportControlsSession? _currentSession = null;

        static void UpdateSession(GlobalSystemMediaTransportControlsSession? session)
        {
            if (_currentSession != null)
            {
                _currentSession.MediaPropertiesChanged -= Session_MediaPropertiesChanged;
                _currentSession.PlaybackInfoChanged -= Session_PlaybackInfoChanged;
                _currentSession.TimelinePropertiesChanged -= Session_TimelinePropertiesChanged;
            }

            _currentSession = session;

            if (_currentSession != null)
            {
                _currentSession.MediaPropertiesChanged += Session_MediaPropertiesChanged;
                _currentSession.PlaybackInfoChanged += Session_PlaybackInfoChanged;
                _currentSession.TimelinePropertiesChanged += Session_TimelinePropertiesChanged;
                _ = EmitMediaInfo(_currentSession);
            }
        }

        private static void Session_TimelinePropertiesChanged(GlobalSystemMediaTransportControlsSession sender, TimelinePropertiesChangedEventArgs args) => _ = EmitMediaInfo(sender);
        private static void Session_PlaybackInfoChanged(GlobalSystemMediaTransportControlsSession sender, PlaybackInfoChangedEventArgs args) => _ = EmitMediaInfo(sender);
        private static void Session_MediaPropertiesChanged(GlobalSystemMediaTransportControlsSession sender, MediaPropertiesChangedEventArgs args) => _ = EmitMediaInfo(sender);

        static async Task EmitMediaInfo(GlobalSystemMediaTransportControlsSession session)
        {
            try
            {
                var props = await session.TryGetMediaPropertiesAsync();
                var playback = session.GetPlaybackInfo();
                var timeline = session.GetTimelineProperties();

                int statusValue = (int)playback.PlaybackStatus;
                bool isPlaying = statusValue == 4;

                var data = new MediaInfo
                {
                    Payload = new MediaPayload
                    {
                        Title = props.Title,
                        Artist = props.Artist,
                        Album = props.AlbumTitle,
                        PlaybackRate = isPlaying ? 1 : 0,
                        Playing = isPlaying,
                        ElapsedTime = timeline.Position.TotalSeconds,
                        Duration = timeline.EndTime.TotalSeconds,
                        BundleIdentifier = session.SourceAppUserModelId
                    }
                };

                string json = JsonSerializer.Serialize(data, _jsonOptions);
                Console.WriteLine(json);
            }
            catch { }
        }
    }
}
