import { Video } from '@/types/YoutubeContents';

interface PlayerModalProps {
  video: Video;
  onClose: () => void;
}

export default function PlayerModal({ video, onClose }: PlayerModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded"
          >
            닫기
          </button>
        </div>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 비율 */ }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-md"
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}