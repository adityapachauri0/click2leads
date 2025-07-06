'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const categories = ['All', 'General News', 'Insights']

const articles = [
  {
    id: 1,
    title: 'Is AI Content A Legitimate Substitute For Real Human-Written Content?',
    excerpt: 'Let\'s get the obvious out of the way, shall we? Yes, we offer digital marketing services, and yes, those services involve content writing...',
    date: 'April 21, 2025',
    category: 'Insights',
    image: '🤖',
    slug: 'ai-content-vs-human-content',
  },
  {
    id: 2,
    title: 'How to Overcome Previous Bad Experiences with Lead Gen Companies',
    excerpt: 'If you\'re in a position where you are looking to engage the services of a lead generation company, but are hesitant due to past experiences...',
    date: 'April 3, 2025',
    category: 'Insights',
    image: '💡',
    slug: 'overcome-bad-experiences-lead-gen',
  },
  {
    id: 3,
    title: 'Freelance vs Agency Content Writing: From Both Sides of the Coin',
    excerpt: 'I have a confession to make. A confession that will shock many people in today\'s culture – where being your own boss is the dream...',
    date: 'March 6, 2025',
    category: 'Insights',
    image: '✍️',
    slug: 'freelance-vs-agency-content-writing',
  },
  {
    id: 4,
    title: 'Five Years of Growth: Louie Bartlett\'s Evolution at Click2leads',
    excerpt: 'Five years ago, Louie Bartlett joined Click2leads as an apprentice eager to explore the world of digital marketing...',
    date: 'February 12, 2025',
    category: 'General News',
    image: '🎉',
    slug: 'louie-bartlett-five-years',
  },
  {
    id: 5,
    title: 'From Apprentice to Leader: Celebrating Lauren\'s Six Years at Click2leads',
    excerpt: 'At Click2leads, we\'re all about celebrating the incredible journeys of our team members who contribute to our continued success...',
    date: 'October 8, 2024',
    category: 'General News',
    image: '🌟',
    slug: 'lauren-six-years-lead-pronto',
  },
  {
    id: 6,
    title: 'Why Content is Important for Your Website',
    excerpt: 'When an SEO expert tells an ambitious fledgling business that they need a healthy supply of content on their website...',
    date: 'September 30, 2024',
    category: 'Insights',
    image: '📝',
    slug: 'why-content-is-important',
  },
  {
    id: 7,
    title: 'Why Your Business Needs a Lead Generation Strategy',
    excerpt: 'It is essential for any business to generate leads. You could be the best in your field, but without good lead generation...',
    date: 'September 17, 2024',
    category: 'Insights',
    image: '🎯',
    slug: 'lead-generation-strategy',
  },
  {
    id: 8,
    title: '4 Reasons Why DIY Lead Generation is Bad for Your Business',
    excerpt: 'The internet is a vast bank of information where you can pretty much find anything you want, including practical help...',
    date: 'August 22, 2024',
    category: 'Insights',
    image: '⚠️',
    slug: 'diy-lead-generation-bad',
  },
]

function ArticleCard({ article, index }: { article: typeof articles[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/resources/news/${article.slug}`}>
        <div className="relative rounded-2xl overflow-hidden glass-morphism">
          <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-electric-blue/10 to-neon-purple/10 p-12 flex items-center justify-center">
            <span className="text-6xl">{article.image}</span>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm text-electric-blue">{article.date}</span>
              <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-white/70">
                {article.category}
              </span>
            </div>
            
            <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-electric-blue transition-colors">
              {article.title}
            </h3>
            
            <p className="text-white/60 text-sm mb-4">{article.excerpt}</p>
            
            <motion.div
              className="flex items-center text-electric-blue text-sm font-medium"
              animate={{ x: isHovered ? 5 : 0 }}
            >
              Read more
              <span className="ml-2">→</span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(article => article.category === selectedCategory)

  return (
    <div className="min-h-screen py-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl font-display font-bold mb-6">
            News & <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Read our latest articles and industry insights
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-electric-blue to-neon-purple text-white'
                  : 'glass-morphism text-white/70 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="px-6 py-3 rounded-full glass-morphism text-white/70 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}