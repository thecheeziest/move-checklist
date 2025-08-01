import React, { useState, useEffect } from 'react';
import { useChecklistStore } from '../../../shared/stores/checklistStore';
import { SlidePanel } from '../../../shared/components/SlidePanel';
import { SlidePanelContent } from '../../../shared/components/SlidePanelContent';

type OGData = {
  image?: string;
  title?: string;
  description?: string;
  url?: string;
};

function OGPreview({ url }: { url: string }) {
  const [og, setOg] = useState<OGData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError('');
    const isOwnService = url.includes('move-checklist');
    if (isOwnService) {
      setOg(null);
      setLoading(false);
      setError('');
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`/api/og?url=${encodeURIComponent(url)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setOg(data.data);
          else setError('URL 썸네일을 찾을 수 없습니다.');
        })
        .catch(() => setError('URL 썸네일을 찾을 수 없습니다.'))
        .finally(() => setLoading(false));
    }, 500);
    return () => clearTimeout(timeout);
  }, [url]);

  if (!url) return null;
  const isOwnService = url.includes('move-checklist');
  // 모바일 환경 감지
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  const ogWidth = isMobile ? 400 : 1200;
  const ogHeight = isMobile ? 400 : 630;
  if (isOwnService) {
    const title = decodeURIComponent(url.split('/').pop() || '체크리스트');
    return (
      <div className="mt-2">
        <div className="text-xs text-gray-400 mb-1">OG 이미지 미리보기</div>
        <img
          src={`/api/og?title=${encodeURIComponent(title)}&width=${ogWidth}&height=${ogHeight}`}
          alt="OG 미리보기"
          className="w-full max-w-md border rounded bg-white/80"
        />
      </div>
    );
  }
  if (loading) return <div className="text-xs text-gray-400 mt-2">미리보기 불러오는 중...</div>;
  if (error) return <div className="text-xs text-red-400 mt-2">{error}</div>;
  if (!og) return null;
  return (
    <div className="flex items-center gap-3 mt-2 p-2 border rounded bg-white/80">
      {og.image ? (
        <img src={og.image} alt="썸네일" className="w-16 h-16 object-cover rounded" />
      ) : null}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{og.title}</div>
        {og.description && <div className="text-xs text-gray-500 truncate">{og.description}</div>}
        <a href={og.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline break-all">{og.url}</a>
      </div>
    </div>
  );
}

export const DetailPanel: React.FC = () => {
  const {
    selectedItem,
    isDetailPanelOpen,
    closeDetailPanel,
    deleteItem,
  } = useChecklistStore();

  const getCategoryColors = (category: string) => {
    switch (category) {
      case '가구':
        return 'bg-amber-200 text-amber-800';
      case '가전':
        return 'bg-teal-100 text-teal-700';
      case '소품':
        return 'bg-pink-100 text-pink-700';
      case '정리':
        return 'bg-purple-100 text-purple-700';
      case '식기':
        return 'bg-blue-100 text-blue-700';
      case '렌트':
        return 'bg-yellow-100 text-yellow-600';
      case '기타':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? parseInt(price.replace(/,/g, '')) : price;
    return num.toLocaleString();
  };

  const getStatusText = () => {
    if (!selectedItem) return '';
    if (selectedItem.isPurchased) {
      return selectedItem.purchasedDate 
        ? `구매완료 (${new Date(selectedItem.purchasedDate).toLocaleDateString('ko-KR')})`
        : '구매완료';
    } else {
      return selectedItem.purchasedDate 
        ? `구매예정 (${new Date(selectedItem.purchasedDate).toLocaleDateString('ko-KR')})`
        : '구매예정';
    }
  };

  return (
    <SlidePanel
      isOpen={isDetailPanelOpen}
      onClose={closeDetailPanel}
    >
      {selectedItem && (
        <SlidePanelContent
          showActions
          onDelete={() => deleteItem(selectedItem.id)}
          saveText="수정"
          deleteText="삭제"
        >
        <div>
          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              selectedItem.isPurchased 
                ? 'bg-green-100 text-green-700' 
                : getCategoryColors(selectedItem.category)
            }`}>
              {selectedItem.category}
            </div>
          </div>

          {/* Brand */}
          {selectedItem.brand && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                브랜드
              </label>
              <div className="text-gray-800 font-medium">
                {selectedItem.brand}
              </div>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <div className="text-lg font-semibold text-gray-800 break-words">
              {selectedItem.title}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              가격
            </label>
            <div className="text-xl font-bold text-green-600">
              ₩{formatPrice(selectedItem.price)}
            </div>
          </div>

          {/* Purchase Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              구매 상태
            </label>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              selectedItem.isPurchased
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}>
              {getStatusText()}
            </div>
          </div>

          {/* Option */}
          {selectedItem.option && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                옵션
              </label>
              <div className="text-gray-800">
                {selectedItem.option}
              </div>
            </div>
          )}

          {/* Memo */}
          {selectedItem.memo && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비고
              </label>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="text-gray-800 whitespace-pre-wrap break-words">
                  {selectedItem.memo}
                </div>
              </div>
            </div>
          )}

          {/* URL */}
          {selectedItem.url && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 break-all">
                  <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {selectedItem.url}
                  </a>
                </div>
                <OGPreview url={selectedItem.url} />
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="mb-6">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  생성일
                </label>
                <div className="text-sm text-gray-600">
                  {selectedItem.createdAt.toLocaleDateString('ko-KR')}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  수정일
                </label>
                <div className="text-sm text-gray-600">
                  {selectedItem.updatedAt.toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SlidePanelContent>
      )}
    </SlidePanel>
  );
}; 