// Content service for fetching dynamic content from the API

export interface ContentData {
  hero?: {
    title?: string
    subtitle?: string
    stats_spending?: string
    stats_leads?: string
    cta_primary?: string
    cta_secondary?: string
  }
  about?: {
    title?: string
    description?: string
  }
  services?: {
    title?: string
    service_1_title?: string
    service_1_desc?: string
    service_2_title?: string
    service_2_desc?: string
    service_3_title?: string
    service_3_desc?: string
  }
}

// Default content fallbacks
const defaultContent: ContentData = {
  hero: {
    title: 'A Lead Generation Powerhouse',
    subtitle: 'Partner for Life',
    stats_spending: '£28 million',
    stats_leads: '4.7 million leads',
    cta_primary: 'Talk to a Specialist',
    cta_secondary: 'Explore Our Work'
  },
  about: {
    title: 'About Click2Leads',
    description: 'We are a lead generation company with proven results.'
  },
  services: {
    title: 'Our Services',
    service_1_title: 'SEO Optimization',
    service_1_desc: 'Boost your organic search rankings',
    service_2_title: 'PPC Advertising',
    service_2_desc: 'Targeted paid advertising campaigns',
    service_3_title: 'Social Media Marketing',
    service_3_desc: 'Engage your audience on social platforms'
  }
}

// Cache for content
let contentCache: ContentData | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getContent(section?: string): Promise<ContentData> {
  // Check cache
  if (contentCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return section && contentCache[section as keyof ContentData] 
      ? { [section]: contentCache[section as keyof ContentData] } as ContentData
      : contentCache
  }

  try {
    const url = section ? `/api/content/${section}` : '/api/content'
    const response = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes in Next.js
    })

    if (!response.ok) {
      throw new Error('Failed to fetch content')
    }

    const data = await response.json()
    
    if (data.success) {
      contentCache = data.content
      cacheTimestamp = Date.now()
      return data.content
    }
  } catch (error) {
    console.error('Error fetching content:', error)
  }

  // Return default content as fallback
  return section && defaultContent[section as keyof ContentData]
    ? { [section]: defaultContent[section as keyof ContentData] } as ContentData
    : defaultContent
}

// Helper function to get specific content value
export async function getContentValue(section: string, key: string): Promise<string> {
  const content = await getContent(section)
  const sectionContent = content[section as keyof ContentData]
  
  if (!sectionContent || typeof sectionContent !== 'object') {
    return ''
  }
  
  // @ts-ignore - We know the structure but TypeScript doesn't
  const value = sectionContent[key]
  const defaultSection = defaultContent[section as keyof ContentData]
  // @ts-ignore
  const defaultValue = defaultSection?.[key]
  
  return value || defaultValue || ''
}