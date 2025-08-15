/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchStoryById } from '../redux/slices/farmConnectSlice';
import moment from 'moment';
import { FaArrowLeft, FaClock, FaTag, FaTrophy } from 'react-icons/fa';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStory = async () => {
      setError(null);
      setLoading(true);
      try {
        const resultAction = await dispatch(fetchStoryById(id));
        if (fetchStoryById.fulfilled.match(resultAction)) {
          setStory(resultAction.payload);
        } else {
          setError(resultAction.payload || 'Story not found.');
        }
      } catch (err) {
        setError('Failed to load story.');
      } finally {
        setLoading(false);
      }
    };
    loadStory();
  }, [dispatch, id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!story) return null;

  const getInitials = (name = '') => {
    const names = name.trim().split(' ');
    if (!names.length) return '';
    if (names.length === 1) return names[0].toUpperCase();
    return (names + names).toUpperCase();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-purple-600 hover:underline">
        <FaArrowLeft /> Back
      </button>

      {/* Cover Image */}
      <div className="mb-6">
        {story.coverImage ? (
          <img src={story.coverImage} alt={story.title} className="w-full h-60 object-cover rounded-lg" />
        ) : (
          <div className="w-full h-60 flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg text-5xl font-bold text-white select-none">
            {getInitials(story?.user?.name || '')}
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          {story.user?.name && (
            <>
              <span className="font-medium text-gray-800">{story.user.name}</span>
              <span className="ml-2 bg-green-600 text-white px-2 py-0.5 rounded-full text-xs">🌱 Farmer</span>
            </>
          )}
        </div>
        <span className="flex items-center gap-1">
          <FaClock /> {moment(story.createdAt).format('LLL')}
        </span>
        {story.readTime && <span>{story.readTime} min read</span>}
      </div>

      {story.category && (
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs mb-4 inline-block">
          {story.category}
        </span>
      )}

      {story.excerpt && (
        <blockquote className="italic text-gray-600 border-l-4 border-purple-300 pl-3 mb-5">
          {story.excerpt}
        </blockquote>
      )}

      <div className="prose max-w-none text-lg mb-6 whitespace-pre-line">
        {story.content}
      </div>

      {story.tags && story.tags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center">
                <FaTag className="mr-1" /> #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {story.achievements && story.achievements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Achievements</h3>
          <ul className="list-disc list-inside">
            {story.achievements.map((a, idx) => (
              <li key={idx}><FaTrophy className="inline text-yellow-500 mr-1" />{a}</li>
            ))}
          </ul>
        </div>
      )}

      {story.timeline && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Timeline</h3>
          <p className="bg-blue-50 border-l-4 border-blue-400 pl-4 py-2 rounded">{story.timeline}</p>
        </div>
      )}
    </div>
  );
};

export default StoryDetail;
