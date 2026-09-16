import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, User, Clock } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: Comment[];
}

const initialPosts: Post[] = [
  {
    id: '1',
    author: 'أحمد محمود',
    title: 'استفسار بخصوص رحلة الأقصر وأسوان',
    content: 'هل يوجد أماكن متبقية في رحلة الأقصر وأسوان المقررة الشهر القادم؟ ومتى آخر موعد لسداد الرسوم؟',
    date: 'منذ ساعتين',
    likes: 12,
    comments: [
      {
        id: 'c1',
        author: 'رعاية الطلاب',
        content: 'مرحباً أحمد، نعم يتبقى 5 أماكن فقط. آخر موعد للسداد هو يوم الخميس القادم.',
        date: 'منذ ساعة',
        likes: 5
      }
    ]
  },
  {
    id: '2',
    author: 'سارة خالد',
    title: 'اقتراح لنشاط ثقافي جديد',
    content: 'أقترح تنظيم صالون ثقافي شهري لمناقشة الكتب والروايات، ما رأيكم؟',
    date: 'منذ 5 ساعات',
    likes: 34,
    comments: [
      {
        id: 'c2',
        author: 'مصطفى أحمد',
        content: 'فكرة ممتازة جداً! أدعم هذا الاقتراح بشدة.',
        date: 'منذ 3 ساعات',
        likes: 8
      },
      {
        id: 'c3',
        author: 'نورهان سعيد',
        content: 'يا ريت فعلاً يتم تنفيذه، وممكن نستضيف كتاب وندوات نقاشية.',
        date: 'منذ ساعة',
        likes: 3
      }
    ]
  }
];

export default function StudentForum() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  const { showToast } = useToast();

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: 'طالب (أنت)',
      title: newPostTitle,
      content: newPostContent,
      date: 'الآن',
      likes: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    showToast('تم نشر موضوعك بنجاح!', 'success');
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'طالب (أنت)',
      content: newCommentContent,
      date: 'الآن',
      likes: 0
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
    
    setNewCommentContent('');
    setActiveCommentPostId(null);
    showToast('تم إضافة تعليقك بنجاح.', 'success');
  };

  return (
    <div id="forum" className="bg-slate-50 py-16 sm:py-24 border-t border-slate-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">المنتدى الطلابي</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            ساحة للنقاش وتبادل الأفكار والاستفسارات بين الطلاب وإدارة رعاية الطلاب.
          </p>
        </div>

        {/* Create Post Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            موضوع جديد
          </h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="عنوان الموضوع..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500 font-semibold text-slate-800"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="اكتب استفسارك أو اقتراحك هنا..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
                className="w-full rounded-lg border-slate-300 border px-4 py-3 focus:border-blue-500 focus:ring-blue-500 resize-none text-slate-700"
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>نشر</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{post.author}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.date}
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{post.title}</h3>
                <p className="text-slate-700 leading-relaxed mb-6">{post.content}</p>
                
                <div className="flex items-center gap-4 border-t border-slate-100 pt-4 mt-4">
                  <button 
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes} إعجاب</span>
                  </button>
                  <button 
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} تعليقات</span>
                  </button>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="bg-slate-50 border-t border-slate-100 p-6 space-y-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex shrink-0 items-center justify-center text-slate-500 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl rounded-tr-none p-3 w-full shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-slate-900">{comment.author}</span>
                        <span className="text-xs text-slate-500">{comment.date}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
                
                {/* Add Comment */}
                {(activeCommentPostId === post.id || post.comments.length > 0) && (
                  <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-3 mt-4 pt-4 border-t border-slate-200/60">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex shrink-0 items-center justify-center text-blue-600 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="اكتب تعليقاً..."
                        value={activeCommentPostId === post.id ? newCommentContent : ''}
                        onChange={(e) => {
                          setNewCommentContent(e.target.value);
                          if (activeCommentPostId !== post.id) setActiveCommentPostId(post.id);
                        }}
                        className="w-full rounded-lg border-slate-300 border px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                        required
                      />
                      <button 
                        type="submit" 
                        disabled={!newCommentContent.trim() || activeCommentPostId !== post.id}
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 disabled:opacity-50 p-1"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
