import React, { useEffect, useState } from 'react';
import { useChecklistStore } from '../../../shared/stores/checklistStore';
import { SlidePanel } from '../../../shared/components/SlidePanel';
import { SlidePanelContent } from '../../../shared/components/SlidePanelContent';
import type { PurchaseCategory } from '../../../shared/stores/checklistStore';

const CATEGORIES: PurchaseCategory[] = ['가구', '가전', '소품', '정리', '식기', '렌트', '기타'];

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
    const timeout = setTimeout(() => {
      fetch(`/api/og?url=${encodeURIComponent(url)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setOg(data.data);
          else setError('URL 썸네일을 찾을 수 없습니다.');
        })
        .catch(() => setError('URL 썸네일을 찾을 수 없습니다.'))
        .finally(() => setLoading(false));
    }, 500); // debounce
    return () => clearTimeout(timeout);
  }, [url]);

  if (!url) return null;
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

export const PurchaseFormPanel: React.FC = () => {
  const {
    isAddFormOpen,
    selectedItem,
    purchaseForm,
    closeAddForm,
    updatePurchaseForm,
    addItem,
    updateItem,
  } = useChecklistStore();

  const isEditMode = !!selectedItem;
  const title = isEditMode ? '구입 항목 수정' : '구입 항목 추가';

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue === '') return '';
    return parseInt(numericValue).toLocaleString();
  };

  const handlePriceChange = (value: string) => {
    const formatted = formatPrice(value);
    updatePurchaseForm('price', formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (purchaseForm.title.trim() && purchaseForm.price) {
      if (isEditMode && selectedItem) {
        updateItem(selectedItem.id, purchaseForm as unknown as Partial<Record<string, unknown>>, true);
      } else {
        addItem(purchaseForm);
      }
    }
  };

  const handleSave = () => {
    if (purchaseForm.title.trim() && purchaseForm.price) {
      if (isEditMode && selectedItem) {
        updateItem(selectedItem.id, purchaseForm as unknown as Partial<Record<string, unknown>>, true);
      } else {
        addItem(purchaseForm);
      }
    }
  };

  return (
    <SlidePanel
      isOpen={isAddFormOpen}
      onClose={closeAddForm}
      title={title}
    >
      <SlidePanelContent
        showActions
        onSave={handleSave}
        saveText={isEditMode ? "수정하기" : "추가하기"}
        isSaveDisabled={!purchaseForm.title.trim() || !purchaseForm.price}
      >
        <form onSubmit={handleSubmit}>
          {/* 1. Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 <span className="text-yellow-500 font-bold">*</span>
            </label>
            <select
              value={purchaseForm.category}
              onChange={(e) => updatePurchaseForm('category', e.target.value as PurchaseCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Brand */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              브랜드
            </label>
            <input
              type="text"
              value={purchaseForm.brand}
              onChange={(e) => updatePurchaseForm('brand', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="브랜드명을 입력하세요"
            />
          </div>

          {/* 3. Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제품명 <span className="text-yellow-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={purchaseForm.title}
              onChange={(e) => updatePurchaseForm('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="제품명을 입력하세요"
              required
            />
          </div>

          {/* 4. Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              가격 <span className="text-yellow-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={purchaseForm.price}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="1,000"
              required
            />
          </div>

          {/* 5. Date and Purchase Status */}
          <div className="mb-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {purchaseForm.isPurchased ? '구매일' : '구매 예정일'}
                </label>
                <input
                  type="date"
                  value={purchaseForm.purchasedDate}
                  onChange={(e) => updatePurchaseForm('purchasedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPurchased"
                  checked={purchaseForm.isPurchased}
                  onChange={(e) => updatePurchaseForm('isPurchased', e.target.checked)}
                  className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                />
                <label htmlFor="isPurchased" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  이미 구매했어요
                </label>
              </div>
            </div>
          </div>

          {/* 6. Option */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              옵션
            </label>
            <input
              type="text"
              value={purchaseForm.option}
              onChange={(e) => updatePurchaseForm('option', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="색상, 사이즈 등 옵션을 입력하세요"
            />
          </div>

          {/* 7. Memo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비고
            </label>
            <textarea
              value={purchaseForm.memo}
              onChange={(e) => updatePurchaseForm('memo', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              placeholder="추가 메모를 입력하세요"
            />
          </div>

          {/* 8. URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              value={purchaseForm.url}
              onChange={(e) => updatePurchaseForm('url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="https://example.com"
            />
            {purchaseForm.url && (
              <OGPreview url={purchaseForm.url} />
            )}
          </div>
        </form>
      </SlidePanelContent>
    </SlidePanel>
  );
}; 