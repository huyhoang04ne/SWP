const NewsCard = () => {
  return (
    <article className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
      <h2 className="text-lg font-bold text-purple-800">📌 Tiêu đề bài viết mẫu</h2>
      <p className="text-sm text-gray-600 mt-2">
        Mô tả ngắn gọn nội dung bài viết giúp người đọc nắm thông tin nhanh chóng...
      </p>
    </article>
  );
};

export default NewsCard;
