import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">Welcome to</p>
        <h1 className="text-5xl font-bold text-white mb-4">Digifello <span className="text-indigo-400">AI</span></h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
          Developer · Creator · Builder. Sharing knowledge through blogs, tools, and open ideas.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/blogs" className="btn-primary">Read Blogs</Link>
          <Link to="/tools" className="btn-secondary">Browse Tools</Link>
          <Link to="/about" className="btn-secondary">About Me</Link>
        </div>
      </div>

      {/* Quick sections */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card hover:border-indigo-700 transition-colors">
          <div className="text-2xl mb-3">📝</div>
          <h3 className="text-white font-semibold text-lg mb-2">Blogs</h3>
          <p className="text-gray-400 text-sm mb-4">Technical articles and tutorials on web development, Node.js, and more.</p>
          <Link to="/blogs" className="text-indigo-400 text-sm hover:underline">Read all blogs →</Link>
        </div>
        <div className="card hover:border-indigo-700 transition-colors">
          <div className="text-2xl mb-3">🛠️</div>
          <h3 className="text-white font-semibold text-lg mb-2">Tools</h3>
          <p className="text-gray-400 text-sm mb-4">Free and paid tools built to boost your productivity and workflow.</p>
          <Link to="/tools" className="text-indigo-400 text-sm hover:underline">Browse tools →</Link>
        </div>
        <div className="card hover:border-indigo-700 transition-colors">
          <div className="text-2xl mb-3">💡</div>
          <h3 className="text-white font-semibold text-lg mb-2">Request a Tool</h3>
          <p className="text-gray-400 text-sm mb-4">Have an idea for a tool? Submit a request and let's build it together.</p>
          <Link to="/tool-request" className="text-indigo-400 text-sm hover:underline">Submit request →</Link>
        </div>
      </div>
    </div>
  )
}
