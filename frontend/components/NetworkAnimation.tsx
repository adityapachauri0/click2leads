'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function NetworkAnimation() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Animate the connections
    const paths = svgRef.current.querySelectorAll('.connection-path')
    paths.forEach((path, index) => {
      const length = (path as SVGPathElement).getTotalLength()
      ;(path as SVGPathElement).style.strokeDasharray = `${length}`
      ;(path as SVGPathElement).style.strokeDashoffset = `${length}`
      ;(path as SVGPathElement).style.animation = `drawPath 3s ${index * 0.2}s ease-in-out infinite`
    })
  }, [])

  const nodes = [
    { id: 1, x: 50, y: 50, size: 8 },
    { id: 2, x: 150, y: 30, size: 6 },
    { id: 3, x: 250, y: 70, size: 10 },
    { id: 4, x: 100, y: 120, size: 7 },
    { id: 5, x: 200, y: 140, size: 9 },
    { id: 6, x: 300, y: 100, size: 6 },
    { id: 7, x: 80, y: 180, size: 8 },
    { id: 8, x: 280, y: 160, size: 7 },
    { id: 9, x: 180, y: 80, size: 12 }, // Central node
  ]

  const connections = [
    { from: 9, to: 1 },
    { from: 9, to: 2 },
    { from: 9, to: 3 },
    { from: 9, to: 4 },
    { from: 9, to: 5 },
    { from: 1, to: 2 },
    { from: 3, to: 6 },
    { from: 4, to: 7 },
    { from: 5, to: 8 },
    { from: 6, to: 8 },
  ]

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        viewBox="0 0 350 200"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>
            {`
              @keyframes drawPath {
                0% {
                  stroke-dashoffset: var(--path-length);
                  opacity: 0;
                }
                20% {
                  opacity: 1;
                }
                50% {
                  stroke-dashoffset: 0;
                  opacity: 1;
                }
                80% {
                  opacity: 1;
                }
                100% {
                  stroke-dashoffset: calc(var(--path-length) * -1);
                  opacity: 0;
                }
              }
              @keyframes pulse {
                0%, 100% {
                  transform: scale(1);
                  opacity: 0.8;
                }
                50% {
                  transform: scale(1.2);
                  opacity: 1;
                }
              }
              .node-circle {
                animation: pulse 3s ease-in-out infinite;
              }
              .connection-path {
                --path-length: 100;
              }
            `}
          </style>
        </defs>

        {/* Connections */}
        {connections.map((connection, index) => {
          const fromNode = nodes.find(n => n.id === connection.from)
          const toNode = nodes.find(n => n.id === connection.to)
          if (!fromNode || !toNode) return null

          return (
            <path
              key={index}
              className="connection-path"
              d={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
              stroke={index % 2 === 0 ? "url(#gradient1)" : "url(#gradient2)"}
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <g key={node.id}>
            {/* Outer glow */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size + 4}
              fill={node.id === 9 ? "#A855F7" : "#0EA5E9"}
              opacity="0.2"
              filter="url(#glow)"
            />
            
            {/* Main node */}
            <motion.circle
              className="node-circle"
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill={node.id === 9 ? "url(#gradient2)" : "url(#gradient1)"}
              filter="url(#glow)"
              style={{
                transformOrigin: `${node.x}px ${node.y}px`,
                animationDelay: `${index * 0.2}s`,
              }}
              whileHover={{ scale: 1.5 }}
            />
            
            {/* Inner dot */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size / 3}
              fill="white"
              opacity="0.8"
            />
          </g>
        ))}

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.circle
            key={`particle-${i}`}
            r="2"
            fill="#0EA5E9"
            opacity="0.6"
            animate={{
              x: [0, 350, 0],
              y: [
                Math.random() * 200,
                Math.random() * 200,
                Math.random() * 200,
              ],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>

      {/* Overlay text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <h3 className="text-2xl font-display font-bold mb-2 text-white/90">
            Connected for Success
          </h3>
          <p className="text-white/60 text-sm">
            Your gateway to unlimited leads
          </p>
        </motion.div>
      </div>
    </div>
  )
}