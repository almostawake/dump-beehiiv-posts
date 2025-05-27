import { config } from 'dotenv';
import axios from 'axios';
import { BeehiivPost, BeehiivPostsResponse } from './types.js';

// Load environment variables
config();

const apiKey = process.env.BEEHIIV_API_KEY;
const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

if (!apiKey || !publicationId) {
  console.error('Error: BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID must be set in .env file');
  process.exit(1);
}

export async function fetchPostsPage(page: number, limit: number = 100): Promise<BeehiivPostsResponse> {
  try {
    const response = await axios.get<BeehiivPostsResponse>(
      `https://api.beehiiv.com/v2/publications/${publicationId}/posts`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          status: 'confirmed',
          limit,
          page
        }
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API Error fetching page ${page}:`, error.response?.data || error.message);
    } else {
      console.error(`Error fetching page ${page}:`, error);
    }
    throw error;
  }
}

export async function fetchPostDetail(postId: string): Promise<BeehiivPost> {
  try {
    const response = await axios.get<BeehiivPost>(
      `https://api.beehiiv.com/v2/publications/${publicationId}/posts/${postId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          expand: 'premium_email_content'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API Error fetching post ${postId}:`, error.response?.data || error.message);
    } else {
      console.error(`Error fetching post ${postId}:`, error);
    }
    throw error;
  }
}