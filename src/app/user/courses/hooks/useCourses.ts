import { useState, useEffect } from 'react';
import { request } from '@/utils/request';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await request('/courses', {
        method: 'GET',
      });
      setCourses(response.data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    refreshCourses: fetchCourses
  };
} 