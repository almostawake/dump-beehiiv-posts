import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config();

const apiKey = process.env.BEEHIIV_API_KEY;

if (!apiKey) {
  console.error('Error: BEEHIIV_API_KEY must be set in .env file');
  process.exit(1);
}

export interface BeehiivPublication {
  id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  web_url: string;
  [key: string]: any;
}

export interface BeehiivPublicationsResponse {
  data: BeehiivPublication[];
  total: number;
  page: number;
  size: number;
  total_pages?: number;
}

export async function fetchPublications(): Promise<BeehiivPublicationsResponse> {
  try {
    const response = await axios.get<BeehiivPublicationsResponse>(
      'https://api.beehiiv.com/v2/publications',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error fetching publications:', error.response?.data || error.message);
    } else {
      console.error('Error fetching publications:', error);
    }
    throw error;
  }
}

export async function listPublications(): Promise<void> {
  try {
    console.log('Fetching publications from Beehiiv API...');
    
    const response = await fetchPublications();
    
    console.log(`\nFound ${response.total} publication(s):\n`);
    
    response.data.forEach((pub, index) => {
      console.log(`${index + 1}. ID: ${pub.id}`);
      console.log(`   Title: ${pub.title}`);
      console.log(`   Description: ${pub.description || 'No description'}`);
      console.log(`   Web URL: ${pub.web_url}`);
      console.log('');
    });
    
    console.log('To use a publication, set BEEHIIV_PUBLICATION_ID in your .env file to the desired ID.');
    
  } catch (error) {
    console.error('Failed to list publications:', error);
    process.exit(1);
  }
}