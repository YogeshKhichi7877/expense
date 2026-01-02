import React from 'react'

const Footer = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
      <div className="max-w-3xl mx-auto py-4 px-6">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
        </p>
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          Made and maintained with ❤️ by Yogesh Khinchi .
        </p>
        <p className="text-center text-xs  text-zinc-400 dark:text-zinc-500 mt-1">
          <a href="https://github.com/YogeshKhinchi" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <br />
          <a href="https://www.linkedin.com/in/yogesh-khinchi/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
      </div>
    </div>
  )
}

export default Footer
